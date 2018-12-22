const SalonToken = artifacts.require('SalonToken');
const assertRevert = require('../helpers/assertRevert');
const zeroAccount = require('../helpers/zeroAccount');

contract('SalonToken', (accounts) => {
  let token;

  beforeEach(async () => {
    token = await SalonToken.new('AnHui Blockchain Salon Token', 'AHBS', 18, {gas: 4712388});
  });

  it('get name test', async () => {
    // let name = await token.name.call();
    // assert.equal(name, 'AnHui Blockchain Salon Token');

    // let symbol = await token.symbol.call();
    // assert.equal(symbol, 'AHBS');
  });
});
