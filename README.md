# Rock Paper Scissors DeApp

## Components

### Technologies

#### Development Tools

- **Yarn** - package manager
  - This project uses [Yarn Workspaces](https://yarnpkg.com/en/docs/workspaces/)
  - [Read more]((https://github.com/sashadev-sky/Rock-Paper-Scissors-Mint/wiki/%F0%9F%A7%B6-Workspaces#yarn-configuration)) about its configuration in the project Wiki
- **Node.js**
- **TypeScript**
- **Git** - version control
- **CRA** - create react app

#### Ethereum

- **Solidity** (v.0.8.10) - implementing smart contracts
- **[HardHat](https://hardhat.org/)** - Ethereum development environment
- **ethers.js** (v.5) - library for interacting with the Ethereum blockhain
- **OpenZeppelin** (v.4) - smart contract base implementation
- **Etherscan** - contract verification
  - <https://etherscan.io/myapikey>

Decentralized storage

- [**NFT.Storage**](https://nft.storage/)
- **IPFS (InterPlanetary File System)**

#### Frontend

- **React** - JavaScript framework

  - **RainbowKit**
  - **Wagmi**
  - **Material UI** - UI framework
  - **React Router**

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/).

Run the following command to install the dependencies:

  ```bash
  yarn install
  ```

Run a Development React Frontend Server with Hot-reloading

```bash
yarn start
```

## Setup

This project makes use of the following public network node providers

- **Alchemy**
- **Infura**

### Hardhat

1. Plugins

     - **`ethers`** and **`@nomiclabs/hardhat-ethers`**, **`hardhat-deploy`**: allows using `ethers` from anywhere in the workspace
     - **`hardhat-deploy-ethers`**: extends the `ethers` object with addtional `hardhat-deploy` specific functionality
     - **`dotevn`**: add support for referencing environment variables from `.env`
     - **`typescript`** and **`ts-node`**: TypeScript support

      ```bash
      yarn workspace rps-hardhat add -D hardhat ethers @nomiclabs/hardhat-ethers hardhat-deploy hardhat-deploy-ethers @nomiclabs/hardhat-etherscan chai chai-ethers mocha @types/chai @types/mocha @types/node dotenv typescript ts-node
      ```

2. Create a `.env` file in the `hardhat` folder and add the following variables:

    ```dotfile
    ALCHEMY_STAGING_KEY=
    ALCHEMY_PRODUCTION_KEY=
    MNEMONIC=
    ```

3. Create a `hardhat.config.ts` in the `hardhat` folder

    ```typescript
    import { config as dotenvConfig } from 'dotenv';
    dotenvConfig();

    import '@nomiclabs/hardhat-ethers';
    import { HardhatUserConfig } from 'hardhat/types';
    import 'hardhat-deploy';
    import 'hardhat-deploy-ethers';

    const config: HardhatUserConfig = {
      solidity: {
        version: '0.8.10', // must match the solidity version you use in your contract
        settings: {
          optimizer: {
            // prevent ProviderError: max code size exceeded
            enabled: true,
            runs: 1,
          },
        },
      },
      networks: { // supported networks
        localhost: {
          url: 'http://localhost:8545',
          /**
           * if there is no mnemonic, it will just use account 0 of the hardhat node to deploy
           * (you can put in a mnemonic here to set the deployer locally like so:
           *
           *     accounts: {
           *       mnemonic: process.env.MNEMONIC,
           *    },
           * )
           **/
        },
        rinkeby: {
          url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_STAGING_KEY}`,
          accounts: { mnemonic: process.env.MNEMONIC },
        },
        mainnet: {
          url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_PRODUCTION_KEY}`,
          accounts: {
            mnemonic: process.env.MNEMONIC,
          },
        },
      },
    };

    export default config;
    ```

4. Create a `tsconfig.json` in the `hardhat` folder

## Writing smart contracts

See [How to Create and Deploy an ERC1155 NFT](./docs/how_to_create_an_ERC1155_nft.md).

## Adding a new contract

1. OpenZeppelin

    ```bash
    yarn workspace rps-hardhat add -D @openzeppelin/hardhat-upgrades @openzeppelin/contracts-upgradeable
    ```

2. Update the `hardhat.config.ts` imports
    <br>

    ```typescript
    // import ...
    import '@openzeppelin/hardhat-upgrades';
    // import ...
    ```

3. While by default hardhat uses `contracts` as the source folder, we prefer to change it to `frontend/src/generated` so that our frontend can access the ABI of the deployed contract. Edit your `hardhat.config.ts` file with the new config:

    ```typescript
    paths: {
      cache: '../frontend/src/generated/cache',
      artifacts: '../frontend/src/generated/artifacts',
    },
    typechain: {
      outDir: '../frontend/src/generated/contract-types'
    }
    ```

4. Create a `src` directory and add your `.sol` contract to it

5. Compile

    ```bash
    yarn compile
    ```

## Deployment Scripts

1. Create a new directory called `deploy` and in that directory create a new file called `001_deploy_rps.ts`.

    ```typescript
    import { HardhatRuntimeEnvironment } from 'hardhat/types';
    import { DeployFunction } from 'hardhat-deploy/types';

    const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
      const {
        deployments,
        ethers,
        getNamedAccounts,
        upgrades
      } = hre;
      const { getNetworkName } = deployments;
      const { deployProxy, erc1967 } = upgrades;

      const targetNetwork = await getNetworkName();
      const { deployer } = await getNamedAccounts();

       // ############## DEPLOYING ###############

      const RPS = await ethers.getContractFactory('RPS');
      console.log(`Deployer ${deployer} is deploying RPS to the ${targetNetwork} network...`);
      // `hre.upgrades.deployProxy` will deploy the new implementation contract (unless there is one already from a previous deployment)
      const proxy = await deployProxy(RPS, [], {
        initializer: 'initialize',
        kind: 'transparent',
      });
      await proxy.deployed();
      console.log('RPS deployed to: ', proxy.address);

      const implementationAddr = await erc1967.getImplementationAddress(
        proxy.address
      );
    };

    export default func;

    func.tags = ['RPS'];
    ```

2. This account needs to be setup in `hardhat.config.ts`. Modify it so it looks like this:

    ```typescript
    namedAccounts: {
      deployer: 0,  // by default take the first account as deployer
    },
    ```

## Etherscan Verification

1. Add Etherscan verification to verify with etherscan if not deployed locally:

    ```bash
    yarn workspace rps-hardhat add -D @nomiclabs/hardhat-etherscan
    ```

2. Add the following variables to `.env`:

    ```dotfile
    ETHERSCAN_STAGING_KEY=
    ETHERSCAN_PRODUCTION_KEY=
    ```

3. Update the `hardhat.config.ts`

    ```typescript
    // import ...
    import '@nomiclabs/hardhat-etherscan';
    // import ...

    const config: HardhatUserConfig = {
      //...
      etherscan: {
        // provided by the @nomiclabs/hardhat-etherscan plugin
        apiKey: {
          rinkeby: process.env.ETHERSCAN_STAGING_KEY,
          mainnet: process.env.ETHERSCAN_PRODUCTION_KEY,
        },
      },
      //...
    };
    ```

4. Thanks to the `@nomiclabs/hardhat-etherscan` package, we can verify by running the`verify` task, passing the address of the contract and the constructor arguments that were used to deploy it (if any)

    ```js
    //...
    const {
      deployments,
      ethers,
      getNamedAccounts,
      run,
      upgrades,
    } = hre;

    //...
    // ############## VERIFACTION ###############

    // need to wait
    console.log('Waiting 60s to verify');

    /**
     * verification throws an error when the contract has already been verified
     * to make life easier, just catch this error and log it.
     * */
    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        await run('verify:verify', {
          address: implementationAddr,
        }).catch((e) => console.error(`ERROR: ${e}`));
        resolve();
      }, 60* 1000);
    });
    //...
    ```

    <small>Notice that our verification is pointing to the <b>implementation</b>, not <b>proxy</b> address.</small>
    <br>

5. Run the deploy task

    ```bash
    yarn deploy
    ```

    <small>The deployed address is the address of our deployed **proxy** instance</small>
    <br>

6. Verify the Proxy

    - In Etherscan, find your contract by the deployed **proxy** address
    - Go to Contract > Code and in the right-side, select the 'More Options' dropdown menu, select 'Is this a proxy?'. That will take you to the following page:

    ![Proxy Contract Verification](./docs/images/proxy_verification.png)

    <small>The address in the red rectangle will still be that of the <b>proxy</b>.</small>

    <br>

    - Select 'Verify'. The address that pops up is the implementation contract's

    - Now when you go back to Contract > Code, you will see two new tabs `Read as Proxy` and `Write as Proxy`. This will allow us to read and write from and to our **implementation** contract:

    ![Implementation Contract Verification](./docs/images/implementation_contract.png)

## Tasks

To see a list of all tasks available:

```bash
yarn hardhat
```

## Frontend

1. Install dependencies

    ```bash
    yarn workspace rps-hardhat add -D typechain @typechain/hardhat typechain @typechain/ethers-v5 ts-morph ts-generator
    ```

2. In `hardhat.config.ts` add imports

    ```typescript
    import '@typechain/hardhat';
    import '@typechain/ethers-v5';
    ```

3. Compile again and start up the development server with hot reloading

    ```bash
    yarn compile
    yarn start
    ```

4. Create a `.env` file in the `frontend` folder and add the following variables:

    ```dotfile
    REACT_APP_ALCHEMY_STAGING_KEY=
    REACT_APP_ALCHEMY_PRODUCTION_KEY=
    REACT_APP_INFURA_ID=
    REACT_APP_RINKEBY_PROXY_CONTRACT_ADDRESS=
    REACT_APP_HOMESTEAD_PROXY_CONTRACT_ADDRESS=
    GENERATE_SOURCEMAP=false
    ```

    - After deploying a new contract, you will need to update the `REACT_APP_RINKEBY_PROXY_CONTRACT_ADDRESS` or `REACT_APP_HOMESTEAD_PROXY_CONTRACT_ADDRESS` variables.

5. In `src/constants/index.ts` update the imported contract at the top to your contract's path, the variables under "SEO and Contract Related Info" to match your Application, and the `CHAIN_ID` variable under "Network Related Info" to match the default chain to use (1 (homestead) or 4 (rinkeby)).
