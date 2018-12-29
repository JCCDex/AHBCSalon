const web3 = require('web3');
const BigNumber = require('bignumber.js');
const Salon = artifacts.require('Salon');
const SalonTokenImpl = artifacts.require('SalonTokenImpl');
const SalonTokenStorage = artifacts.require('SalonTokenStorage');
const SalonToken = artifacts.require('SalonToken');
const assertRevert = require('../helpers/assertRevert');
const zeroAccount = require('../helpers/zeroAccount');

contract('Salon', (accounts) => {
  let salon;
  let token;

  beforeEach(async () => {
    token = await SalonToken.new("AnHui Blockchain Salon Token", "AHBC", 18);
    salon = await Salon.new(token.address);
    token.transferAdministrator(salon.address);
  });

  it('Create new Campaign test', async () => {
    let admin = accounts[0];
    let speaker = accounts[1];
    let sponsor = accounts[2];
    let newCampaign_logs = await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
    const LogNewCampaignEvent = newCampaign_logs.logs.find(e => e.event === 'LogNewCampaign');
    assert.notEqual(LogNewCampaignEvent, undefined);
  });

  it('Create new Campaign with invalid speaker and sponsor test', async () => {
    let admin = accounts[0];
    let speaker = accounts[1];
    let sponsor = accounts[2];

    await assertRevert(salon.newCampaign(20180901, "区块链开发介绍", zeroAccount, sponsor));
    await assertRevert(salon.newCampaign(20180901, "区块链开发介绍", speaker, zeroAccount));

    let newCampaign_logs = await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
    const LogNewCampaignEvent = newCampaign_logs.logs.find(e => e.event === 'LogNewCampaign');
    assert.notEqual(LogNewCampaignEvent, undefined);

    await assertRevert(salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor));
  });

  it('Checkin test', async () => {
    let admin = accounts[0];
    let speaker = accounts[1];
    let sponsor = accounts[2];
    let participant = accounts[3];

    let newCampaign_logs = await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
    const LogNewCampaignEvent = newCampaign_logs.logs.find(e => e.event === 'LogNewCampaign');
    assert.notEqual(LogNewCampaignEvent, undefined);

    let checkin_logs = await salon.checkInByAdmin(20180901, participant);
    let CheckinEvent = checkin_logs.logs.find(e => e.event === 'LogCheckedIn');
    assert.notEqual(CheckinEvent, undefined);

    //重复签到?
    checkin_logs = await salon.checkInByAdmin(20180901, participant);
    CheckinEvent = checkin_logs.logs.find(e => e.event === 'LogCheckedIn');
    assert.notEqual(CheckinEvent, undefined);

    let campaign = await salon.campaigns.call(20180901);
    // console.log(JSON.stringify(campaign));
  });

  it('Add question test', async () => {
    let admin = accounts[0];
    let speaker = accounts[1];
    let sponsor = accounts[2];
    let participant = accounts[3];
    let questioner = accounts[4];
    let replier = accounts[5];

    let newCampaign_logs = await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
    const LogNewCampaignEvent = newCampaign_logs.logs.find(e => e.event === 'LogNewCampaign');
    assert.notEqual(LogNewCampaignEvent, undefined);

    let checkin_logs = await salon.checkInByAdmin(20180901, participant);
    let CheckinEvent = checkin_logs.logs.find(e => e.event === 'LogCheckedIn');
    assert.notEqual(CheckinEvent, undefined);

    await salon.checkInByAdmin(20180901, questioner);
    await salon.checkInByAdmin(20180901, replier);

    let question_logs = await salon.addQuestion(20180901, questioner, replier);
    let QuestionEvent = question_logs.logs.find(e => e.event === 'LogQuestion');
    assert.notEqual(QuestionEvent, undefined);
  });

  it('Salon mining test', async () => {
    // uint public speakerPercent = 30;
    // uint public sponsorPercent = 10;
    // uint public participantPercent = 40;
    // uint public questionPercent = 20;
    let admin = accounts[0];
    let speaker = accounts[1];  //30
    let sponsor = accounts[2];  //10
    let participant = accounts[3];
    let questioner = accounts[4];
    let replier = accounts[5];

    await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
    await salon.checkInByAdmin(20180901, admin);
    await salon.checkInByAdmin(20180901, participant);
    await salon.checkInByAdmin(20180901, questioner);
    await salon.checkInByAdmin(20180901, replier);

    await salon.addQuestion(20180901, questioner, replier);

    assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '100');

    let close_logs = await salon.closeCampaign(20180901);
    let CloseEvent = close_logs.logs.find(e => e.event === 'LogClose');
    assert.notEqual(CloseEvent, undefined);

    assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '0');
    assert.equal(web3.utils.fromWei((await token.balanceOf(speaker))).toString(), '30');
    assert.equal(web3.utils.fromWei((await token.balanceOf(sponsor))).toString(), '10');
    assert.equal(web3.utils.fromWei((await token.balanceOf(admin))).toString(), '10');
    assert.equal(web3.utils.fromWei((await token.balanceOf(participant))).toString(), '10');
    assert.equal(web3.utils.fromWei((await token.balanceOf(questioner))).toString(), '20');
    assert.equal(web3.utils.fromWei((await token.balanceOf(replier))).toString(), '20');
  });

  it('Salon mining without question test', async () => {
    let admin = accounts[0];
    let speaker = accounts[1];  //30
    let sponsor = accounts[2];  //10
    let participant = accounts[3];
    let questioner = accounts[4];
    let replier = accounts[5];

    await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
    await salon.checkInByAdmin(20180901, admin);
    await salon.checkInByAdmin(20180901, participant);
    await salon.checkInByAdmin(20180901, questioner);
    await salon.checkInByAdmin(20180901, replier);

    // await salon.addQuestion(20180901, questioner, replier);

    assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '100');

    let close_logs = await salon.closeCampaign(20180901);
    let CloseEvent = close_logs.logs.find(e => e.event === 'LogClose');
    assert.notEqual(CloseEvent, undefined);

    // 剩余的用于下次分配
    assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '20');

    assert.equal(web3.utils.fromWei((await token.balanceOf(speaker))).toString(), '30');
    assert.equal(web3.utils.fromWei((await token.balanceOf(sponsor))).toString(), '10');
    assert.equal(web3.utils.fromWei((await token.balanceOf(admin))).toString(), '10');
    assert.equal(web3.utils.fromWei((await token.balanceOf(participant))).toString(), '10');
    assert.equal(web3.utils.fromWei((await token.balanceOf(questioner))).toString(), '10');
    assert.equal(web3.utils.fromWei((await token.balanceOf(replier))).toString(), '10');
  });

  it('Salon mining with multiple checkin test', async () => {
    let admin = accounts[0];
    let speaker = accounts[1];  //30
    let sponsor = accounts[2];  //10
    let participant = accounts[3];
    let questioner = accounts[4];
    let replier = accounts[5];

    await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
    await salon.checkInByAdmin(20180901, admin);
    await salon.checkInByAdmin(20180901, participant);
    await salon.checkInByAdmin(20180901, participant);
    await salon.checkInByAdmin(20180901, questioner);
    await salon.checkInByAdmin(20180901, replier);

    assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '100');

    let close_logs = await salon.closeCampaign(20180901);
    let CloseEvent = close_logs.logs.find(e => e.event === 'LogClose');
    assert.notEqual(CloseEvent, undefined);

    assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '20');

    assert.equal(web3.utils.fromWei((await token.balanceOf(speaker))).toString(), '30');
    assert.equal(web3.utils.fromWei((await token.balanceOf(sponsor))).toString(), '10');
    assert.equal(web3.utils.fromWei((await token.balanceOf(participant))).toString(), '10', "重复签到导致为8，应该是10");
  });
});
