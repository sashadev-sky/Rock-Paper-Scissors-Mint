import { Contract, ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

import { expect } from './chai-setup';

let RPS: ContractFactory;
let rps: Contract;

describe('RPC', () => {
  beforeEach(async () => {
    RPS = await ethers.getContractFactory('RPS');
    rps = await RPS.deploy();
    await rps.deployed();
  });

  it('contractURI()', function () {
    it('Should have a base URI after deployment', async function () {
      expect(await rps.contractURI()).to.include('https://ipfs.io/ipfs/');
    });
  });

  it('NFT is minted successfully', async () => {
    const [account1] = await ethers.getSigners();
    expect(await rps.balanceOf(account1.address, 1)).to.equal(0);
    const tx = await rps.connect(account1).mint(account1.address, 1, 1, []);
    expect(await rps.balanceOf(account1.address, 1)).to.equal(1);
  });

  it('tokenURI is set sucessfully', async function () {
    const [account1, account2] = await ethers.getSigners();
    await rps.connect(account1).mint(account1.address, 1, 1, []);
    await rps.connect(account2).mint(account2.address, 2, 1, []);
    expect(await rps.uri(1)).to.include('1.json');
    expect(await rps.uri(2)).to.include('2.json');
  });

  it('Multiple instances can be minted of each NFT', async function () {
    const [account1, account2] = await ethers.getSigners();
    await rps.connect(account1).mint(account1.address, 1, 4, []);
    await rps.connect(account2).mint(account2.address, 2, 3, []);
    expect(await rps.balanceOf(account1.address, 1)).to.equal(4);
    expect(await rps.balanceOf(account2.address, 2)).to.equal(3);
  });
});
