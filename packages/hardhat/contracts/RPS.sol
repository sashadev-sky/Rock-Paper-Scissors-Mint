// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

// for whitelist server signatures
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

/**
 * @title RPS
 */
contract RPS is Initializable, ERC1155Upgradeable, AccessControlUpgradeable, PausableUpgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable {
    // for whitelist server signatures
    using ECDSAUpgradeable for bytes32;

    // these state variables and their values
    // will be preserved forever, regardless of upgrading

    // for upgradeable contracts, you can only initialize constant state variables
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // max total supply RPC's
    uint256 public constant SUPPLY_LIMIT = 9;
    // max whitelist supply RPC's
    uint256 public constant WHITELIST_SUPPLY_LIMIT = 3;
    // max mints per whitelisted address
    uint256 public constant MAX_WHITELIST_MINT_AMOUNT = 1;
    // max public sale mints per address
    uint256 public constant MAX_PUBLIC_SALE_MINT_AMOUNT = 3;

    // otherwise, you declare state variables here but initialize them in the initialize method

    // 0: whitelist
    // 1: public
    // 2: ended
    uint8 public saleState;
    /**
     * @dev cost of token
     * - change using setCost
     */
    // uint256 public cost;
    uint256 public cost;

    // running supply
    uint256 public supply;

    // number of mints per address for whitelist
    mapping(address => uint8) whitelistAddressMintedAmount;
    // number of mints per address for public sale
    mapping(address => uint8) publicSaleAddressMintedAmount;

    // token IDs that have already been minted
    mapping(uint256 => bool) private mintedTokenIds;

    // adddress for server signing for whitelist
    address private adminWalletAddress;

    /**
     * @dev keeps track of next sequential token ID
     * private state variables are only visible to contract OneV
     */
    uint256 private _nextTokenId;

    /**
     * @dev constructor
     *  - OpenZeppelin wizard suggests adding an empty constructor: see https://docs.openzeppelin.com/contracts/4.x/wizard
     * */
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /**
     * @dev initialize the contract
     */
    function initialize() initializer public {
        __ERC1155_init("https://ipfs.io/ipfs/bafybeicxlrrqm5l6uqtngfmdgrzzqrklu2vdqwg3dx32fcqpffh7qyryju/{id}.json");
        __AccessControl_init();
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();

        adminWalletAddress = msg.sender;

        _grantRole(DEFAULT_ADMIN_ROLE, adminWalletAddress);
        _grantRole(URI_SETTER_ROLE, adminWalletAddress);
        _grantRole(PAUSER_ROLE, adminWalletAddress);

        saleState = 1;
        cost = 0.001 ether;
        supply = 0;
        _nextTokenId = 0;
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // anybody with a wallet address can mint
    function mint(address account, uint256 id, uint256 amount, bytes memory data) public {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
    {
        _mintBatch(to, ids, amounts, data);
    }

    // internal: visible to contract A, also visible to derived-inherited contracts such as B
    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function uri(uint256 _tokenid) override public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/bafybeicxlrrqm5l6uqtngfmdgrzzqrklu2vdqwg3dx32fcqpffh7qyryju/",
                StringsUpgradeable.toString(_tokenid),".json"
            )
        );
    }

    function contractURI() public pure returns (string memory) {
        return "https://ipfs.io/ipfs/bafybeidiu37rmgkbxs2pv7gyewvx7mbybm7vc3a4zvccols756ci4ytd4u/collection.json";
    }

    // UTILITY FUNCTIONS

    // use this function to get the hash of any string
    function _getHash(string memory str) internal pure returns (bytes32) {
        string memory prefix = "\x19Ethereum Signed Message:\n";
        string memory stringLength = StringsUpgradeable.toString(bytes(str).length);

        bytes memory abiPackedConcattedBytes = bytes.concat(
            bytes(prefix),
            bytes(stringLength),
            bytes(str)
        );

        bytes32 ret = keccak256(abiPackedConcattedBytes);
        return ret;
    }

    // used to verify signature from backend for whitelist
    function _verifyBackendSignature(
        string memory message,
        bytes memory signature
    ) public view returns (bool) {
        // we hash it on our side to verify the message is the one signed for
        bytes32 messageHash = _getHash(message);

        // check the signing address of the message did in fact sign that message
        address signingAddress = ECDSAUpgradeable.recover(messageHash, signature);

        // verify that the message hash was signed by the admin wallet addreess
        bool valid = signingAddress == adminWalletAddress;

        require(valid, "Message not signed");

        return true;
    }

    // gets the next token id to mint
    function _getNextTokenId() private returns (uint256) {
        // we start at the current nextTokenId
        for (uint256 i = _nextTokenId; i <= SUPPLY_LIMIT; i++) {
            // this begins token IDs at 1
            _nextTokenId++;
            // inject solidity

            // if the token has already been minted (via whitelist), we keep going
            if (!mintedTokenIds[_nextTokenId]) {
                // otherwise, that's the ID we are gonna mint!
                return _nextTokenId;
            }
        }

        // there are no more tokens!
        require(false, "All tokens have been minted");
        return 0;
    }

    // ADMIN FUNCTIONS

    // requires whitelist state
    modifier requireWhitelistState() {
        require(saleState == 0, "Not in whitelist sale");
        _;
    }

    // requires public state
    modifier _requirePublicSaleState() {
        require(saleState == 1, "Not in public sale");
        _;
    }
    /**
     * @dev transition to whitelist state
     */
    function enableWhitelistState() public onlyRole(DEFAULT_ADMIN_ROLE) {
        saleState = 0;
        cost = 0.001 ether;
    }

    /**
     * @dev transition to whitelist state
     */
    function enablePublicSaleState() public onlyRole(DEFAULT_ADMIN_ROLE) {
        saleState = 1;
        cost = 0.002 ether;
    }

    /**
     * @dev end sale
     */
    function endSale() public onlyRole(DEFAULT_ADMIN_ROLE) {
        saleState = 2;
    }
    /**
     * @dev change the cost of the token
     * @param _newCost: integer in Wei (ex. 120000000000000000 === 0.12 ether)
     */
    function setCost(uint256 _newCost) public onlyRole(DEFAULT_ADMIN_ROLE) {
        cost = _newCost;
    }

     // BUYER FUNCTIONS

     function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(bytes.concat(bytes("0x"), s));
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    // used by buyer to mint if they're on the whitelist
    function whitelistMint(bytes memory signature, uint8 numberOfTokens)
        public
        payable
        requireWhitelistState

    {
        require(numberOfTokens > 0, "You must mint at least one NFT.");
        require(supply + numberOfTokens <= WHITELIST_SUPPLY_LIMIT, "Purchase would exceed max supply.");
        require(
            whitelistAddressMintedAmount[msg.sender] + numberOfTokens <= MAX_WHITELIST_MINT_AMOUNT,
            "You may mint up to 1 NFT."
        );

        require(msg.value == cost * numberOfTokens, "You must pay for your NFT.");

        string memory sender = toAsciiString(msg.sender);

        // fails if signature is invalid (message is the sender wallet address)
        _verifyBackendSignature(sender, signature);

        uint256[] memory ids = new uint256[](numberOfTokens);
        uint256[] memory amounts = new uint256[](numberOfTokens);

        for (uint i = 0; i < numberOfTokens; i++) {
            ids[i] = _getNextTokenId();
            amounts[i] = 1;
        }

        mintBatch(msg.sender, ids, amounts, "");
        supply += numberOfTokens;
         // track that the wallet minted more tokens
        whitelistAddressMintedAmount[msg.sender]++;
    }

    // public
    function publicMint(uint8 numberOfTokens) public payable _requirePublicSaleState {
        require(numberOfTokens > 0, "You must mint at least one NFT for public sale.");
        // remove the whitelist max supply from the public supply
        // require(supply + numberOfTokens <= (SUPPLY_LIMIT - WHITELIST_SUPPLY_LIMIT), "Purchase would exceed max supply.");
        require(supply + numberOfTokens <= SUPPLY_LIMIT, "Purchase would exceed max supply.");
        require(
            publicSaleAddressMintedAmount[msg.sender] + numberOfTokens <= MAX_PUBLIC_SALE_MINT_AMOUNT,
            "You may mint up to 3 NFTs on the public list sale."
        );

        require(msg.value == cost * numberOfTokens, "You must pay for your NFT.");

        uint256[] memory ids = new uint256[](numberOfTokens);
        uint256[] memory amounts = new uint256[](numberOfTokens);

        for (uint i = 0; i < numberOfTokens; i++) {
            ids[i] = _getNextTokenId();
            amounts[i] = 1;
        }

        mintBatch(msg.sender, ids, amounts, "");
        supply += numberOfTokens;
         // track that the wallet minted more tokens
        publicSaleAddressMintedAmount[msg.sender] += numberOfTokens;
    }

    function whitelistMintedByAddress() public view returns (uint8) {
        return whitelistAddressMintedAmount[msg.sender];
    }

    function publicMintedByAddress() public view returns (uint8) {
        return publicSaleAddressMintedAmount[msg.sender];
    }
}
