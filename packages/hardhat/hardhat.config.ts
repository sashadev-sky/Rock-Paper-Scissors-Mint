import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades';
import { HardhatUserConfig, task } from 'hardhat/config';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import '@typechain/hardhat';
import '@typechain/ethers-v5';

import { Network } from 'alchemy-sdk';

import { findFirstAddr, prettyPrintBalance } from './utils';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    localhost: {
      url: 'http://localhost:8545',
    },
    goerli: {
      url: `https://${Network.ETH_GOERLI}.g.alchemy.com/v2/${process.env.ALCHEMY_TESTNET_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
    mainnet: {
      url: `https://${Network.ETH_MAINNET}.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
  },
  paths: {
    cache: '../frontend/src/generated/cache',
    artifacts: '../frontend/src/generated/artifacts',
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_TESTNET_KEY || '',
      mainnet: process.env.ETHERSCAN_MAINNET_KEY || '',
    },
  },
};

export default config;


// TASKS - Hardhat’s config DSL

task('accounts', 'Prints the list of accounts', async (_, { ethers }) => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// positional param means you just pass the param value with no flag or separators (i.e. --)
task('balance', "Prints an account's balance")
  .addPositionalParam('account', "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(
      await findFirstAddr(taskArgs.account)
    );
    console.log(prettyPrintBalance(balance));
  });

task('blockNumber', 'Prints the current block number', async (_, { ethers }) => {
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(blockNumber);
});

task('upgradeContract', 'Upgrades a contract')
  .addParam('name', "The target contract's name - could be a new file or the original one")
  .addParam('addr', "The last deployment address")
  .setAction(async (taskArgs, { ethers, upgrades }) => {
    const { addr, name } = taskArgs;
    const currContract = await ethers.getContractFactory(name);
    const updatedContract = await upgrades.upgradeProxy(addr, currContract);
    console.log('Contract upgraded to: ', updatedContract.address);
  });
