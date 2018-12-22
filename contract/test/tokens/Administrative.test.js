const Administrative = artifacts.require('AdministrativeMock');
const assertRevert = require('../helpers/assertRevert');

contract('AdministrativeMock', (accounts) => {
  let admin;

  beforeEach(async () => {
    admin = await Administrative.new();
  });

  it('Transfer zero address ownership test', async () => {
    await assertRevert(admin.transferOwnership('0'));
  });

});
