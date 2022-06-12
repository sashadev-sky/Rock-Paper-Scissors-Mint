# OpenZeppelin `ERC1155`

<https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155>

This set of interfaces and contracts are all related to the ERC1155 Multi Token Standard. ERC1155 implements the mandatory **`IERC1155`** interface, as well as the optional extension **`IERC1155MetadataURI`**, by **relying on the substitution mechanism to use the same URI for all token types, dramatically reducing gas costs**.

Additionally there are multiple custom extensions, including:

- designation of addresses that can pause token transfers for all users (**`ERC1155Pausable`**).
- destruction of own tokens (**`ERC1155Burnable`**).

## Functions

### *Required* interface of an ERC1155 compliant contract

- `balanceOf(address, id)`
- `balanceOfBatch(accounts, ids)`
- `setApprovalForAll(operator, approved)`
- `isApprovedForAll(account, operator)`
- `safeTransferFrom(from, to, id, amount, data)`
- `safeBatchTransferFrom(from, to, ids, amounts, data)`

### IERC1155MetadataURI

- `uri(uint256 id) → string`
  - Returns the URI for token type `id`.
  - If the `{id}` substring is present in the URI, it must be replaced by clients with the actual token type ID.

### ERC1155

- `constructor(string uri_)`
- `supportsInterface(interfaceId)`
- `uri(_) -> string`
  - This implementation returns the same URI for **all** token types. It relies on the token type ID substitution mechanism defined in the EIP. Clients calling this function must replace the `{id}` substring with the actual token type ID.
- `balanceOf(account, id) -> uint256` - getting the balance of the token by entering the address and token id.
- `balanceOfBatch(accounts, ids)`
- `setApprovalForAll(operator, approved)`
- `isApprovedForAll(account, operator)`
- `safeTransferFrom(from, to, id, amount, data)`
- `safeBatchTransferFrom(from, to, ids, amounts, data)`
- `_safeTransferFrom(from, to, id, amount, data)` - transfers `amount` tokens of token type `id` from `from` to `to`.
  - `from` should be deployer address
  - `to` should be a different address
- `_safeBatchTransferFrom(from, to, ids, amounts, data)`
- `_setURI(string newuri)` - sets a new URI for all token types, by relying on the token type ID substitution mechanism defined in the EIP.
  - By this mechanism, any occurrence of the `{id}` substring in either the URI or any of the amounts in the JSON file at said URI will be replaced by clients with the token type ID.
    - For example, the `https://token-cdn-domain/{id}.json` URI would be interpreted by clients as `https://token-cdn-domain/000000000000000000000000000000000000000000000000000000000004cce0.json` for token type ID 0x4cce0.
  - Because these URIs cannot be meaningfully represented by the `uri` event, this function emits no events.
- `_mint(address to, uint256 id, uint256 amount, bytes data)` - creates `amount` tokens of token type `id`, and assigns them to `to`.
  - Emits a `TransferSingle` event.
  - `to` cannot be the zero address.
  - If `to` refers to a smart contract, it must implement `IERC1155Receiver.onERC1155Received` and return the acceptance magic value.
- `_mintBatch(to, ids, amounts, data)`
  - Emits a `TransferBatch` event.
- `_burn(from, id, amount)`
- `_burnBatch(from, ids, amounts)`
- `_setApprovalForAll(owner, operator, approved)`
- `_beforeTokenTransfer(operator, from, to, ids, amounts, data)`

## Configuration

### Settings (`IERC1155MetadataURI`)

- **Name**: My 1155 Horse
  - function: `name() -> string` - returns the token collection name.
- **URI**: <https://ipfs.io/ipfs/bafybeiauk67zy6lubpdhc4micdd3l3ipi7nfobqhoi3ta5bg7rwrs6rrhi/{id}.json>
  - Location of the metadata. Clients will replace any instance of `{id}` in this string with the `tokenId`.

### Features

- [x] **Mintable**: privileged accounts will be able to create more supply.
- [x] **Burnable** (extension - **`ERC1155Burnable`**): token holders will be able to destroy their tokens.
- [x] **Pausable** (extension - **`ERC1155Pausable`**): privileged accounts will be able to pause the functionality marked as`whenNotPaused`. Useful for emergency response.
- [x] **Supply Tracking** (core - **`ERC1155Supply`**): keeps track of total supply of tokens.

#### Access Control

- [ ] **Ownable**: simple mechanism with a single account authorized for all privileged actions. (**`Ownable`**)
- [x] **Access Control**: supports multiple accounts authorized for various priviledged actions designated by roles. (**`AccessControl`**)
