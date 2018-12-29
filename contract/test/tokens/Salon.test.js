const web3 = require('web3');
const BigNumber = require('bignumber.js');
const Salon = artifacts.require('Salon');
const SalonTokenImpl = artifacts.require('SalonTokenImpl');
const SalonTokenStorage = artifacts.require('SalonTokenStorage');
const SalonToken = artifacts.require('SalonToken');
const assertRevert = require('../helpers/assertRevert');

contract('SalonTokenStorage', (accounts) => {
  let salon;
  let token;
  let storage;

  beforeEach(async () => {
    storage = await SalonTokenStorage.new();
    await storage.setName("AnHui Blockchain Salon Token");
    await storage.setSymbol("AHBC");
    await storage.setDecimals(18);

    await storage.setTotalSupply(web3.utils.toWei('0'));
    
    let tokenImpl = await SalonTokenImpl.new(storage.address, 18);
    await storage.transferAdministrator(tokenImpl.address);

    token = await SalonToken.new(tokenImpl.address, storage.address);
    await tokenImpl.transferAdministrator(token.address);

    salon = await Salon.new(token.address);
  });

  it('set and get name test', async () => {
    // let name = await storage.getName();
    // assert.equal(name, '');

    // await storage.setName('salonToken');
    
    // name = await storage.getName();
    // assert.equal(name, 'salonToken');

    // await assertRevert(storage.setName('salonToken1', {from: accounts[1]}));
    // name = await storage.getName();
    // assert.equal(name, 'salonToken');
  });
});
