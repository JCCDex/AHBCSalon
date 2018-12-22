const SalonTokenStorage = artifacts.require('SalonTokenStorage');
const assertRevert = require('../helpers/assertRevert');
const zeroAccount = require('../helpers/zeroAccount');

contract('SalonTokenStorage', (accounts) => {
  let storage;

  beforeEach(async () => {
    storage = await SalonTokenStorage.new();
  });

  it('set and get name test', async () => {
    let name = await storage.getName();
    assert.equal(name, '');

    await storage.setName('salonToken');
    
    name = await storage.getName();
    assert.equal(name, 'salonToken');

    await assertRevert(storage.setName('salonToken1', {from: accounts[1]}));
    name = await storage.getName();
    assert.equal(name, 'salonToken');
  });

  // it('Transfer ownership by not-owner test', async () => {
  //   let before = await admin.owner.call();

  //   await assertRevert(admin.transferOwnership(accounts[2], {from: accounts[1]}));

  //   let after = await admin.owner.call();

  //   assert.equal(before, after);
  // });

});
