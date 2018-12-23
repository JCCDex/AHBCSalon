const web3 = require('web3');
const BigNumber = require('bignumber.js');
const SalonTokenImpl = artifacts.require('SalonTokenImpl');
const SalonTokenStorage = artifacts.require('SalonTokenStorage');
const assertRevert = require('../helpers/assertRevert');
const zeroAccount = require('../helpers/zeroAccount');

contract('SalonTokenImpl', (accounts) => {
  let tokenImpl;
  let storage;

  beforeEach(async () => {
    storage = await SalonTokenStorage.new();
    await storage.setName("AnHui Blockchain Salon Token");
    await storage.setSymbol("AHBC");
    await storage.setDecimals(18);
    //超过10的20次方就变成科学计数法会失败
    await storage.setTotalSupply(web3.utils.toWei('10000'));
    
    tokenImpl = await SalonTokenImpl.new(storage.address, 18);
    await storage.transferAdministrator(tokenImpl.address);

  });

  it('get name/symbol/totalSupply test', async () => {
    let name = await tokenImpl.name.call();
    assert.equal(name, 'AnHui Blockchain Salon Token');

    let symbol = await tokenImpl.symbol.call();
    assert.equal(symbol, 'AHBC');

    let total = await tokenImpl.totalSupply.call();
    assert.equal(total.toString(), web3.utils.toWei('10000').toString());
  });
});
