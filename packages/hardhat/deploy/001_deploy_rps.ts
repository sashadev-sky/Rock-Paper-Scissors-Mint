import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

import { LOCAL_NETWORKS } from '../constants'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers, getNamedAccounts, run, upgrades } = hre;
  const { getNetworkName } = deployments;
  const { deployProxy, erc1967 } = upgrades;

  const targetNetwork = await getNetworkName();
  const { deployer } = await getNamedAccounts();

  // ############## DEPLOYING ###############

  const RPS = await ethers.getContractFactory('RPS');

  console.log(
    `Deployer ${deployer} is deploying RPS to the ${targetNetwork} network...`
  );

  // this will fail if insufficient funds
  const proxy = await deployProxy(RPS, [], {
    initializer: 'initialize',
    kind: 'transparent',
  });

  await proxy.deployed();

  console.log('RPS deployed to: ', proxy.address);

  const implementationAddr = await erc1967.getImplementationAddress(
    proxy.address
  );

  // ############## UPGRADING ###############

  // Upgrading
  // const RPS = await ethers.getContractFactory('RPS');
  // const upgraded = await upgrades.upgradeProxy(
  //   process.env.GOERLI_PROXY_CONTRACT_ADDRESS, // proxy address
  //   RPS
  // );

  // const implementationAddr = await erc1967.getImplementationAddress(
  //   upgraded.address
  // );

  // ############## VERIFICATION ###############

  if (!LOCAL_NETWORKS.includes(targetNetwork)) {
    console.log(`Waiting 60s to verify ${implementationAddr}...`);

    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        await run('verify:verify', {
          address: implementationAddr,
        }).catch((e) => console.error(`ERROR: ${e}`));
        resolve();
      }, 60 * 1000);
    });
  }
}

export default func;

func.tags = ['RPS'];
