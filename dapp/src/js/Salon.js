import tp from "tp-js-sdk";

const Salon = {

  instance: null,

  fromAddress: null,

  fromName: null,

  toAddress: null,

  init: async function () {
    let self = this;
    let admin;

    const res = await tp.getCurrentWallet();
    self.fromAddress = res.data.address;
    self.fromName = res.data.name;
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      self.toAddress = process.env.VUE_APP_SALON_ADDRESS_MOAC;
      self.instance = chain3.mc.contract(JSON.parse(process.env.VUE_APP_SALONABI)).at(self.toAddress);
      admin = chain3.toChecksumAddress(self.instance.administrator());
    } else {
      self.toAddress = process.env.VUE_APP_SALON_ADDRESS;
      self.instance = new web3.eth.Contract(JSON.parse(process.env.VUE_APP_SALONABI), self.toAddress);
      admin = await self.instance.methods.administrator().call();
    }
    return admin === self.fromAddress;
  },

  newCampaign: async function (campaignID, topic, speaker, sponsor) {
    let self = this;
    let data;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.newCampaign.getData(campaignID, topic, speaker, sponsor);
    } else {
      data = self.instance.methods.newCampaign(campaignID, topic, speaker, sponsor).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: chain3.version.network,
      data: data
    };
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.sendMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.LogNewCampaign({
            campaignID: campaignID,
            topic: topic
          }, function (error, result) {
            if (!error) {
              resolve(true);
            } else {
              reject(false)
            }
          });
        });
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }
  },

  registe: async function (campaignID) {
    let self = this;
    let data;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.register.getData(campaignID);
    } else {
      data = self.instance.methods.register(campaignID).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: chain3.version.network,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.sendMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.LogRegister({
            who: self.fromAddress
          }, function (error, result) {
            if (!error) {
              resolve(true);
            } else {
              reject(false)
            }
          });
        });
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }

  },

  checkin: async function (campaignID, address) {
    let self = this;
    let data;
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.checkin.getData(campaignID, address);
    } else {
      data = self.instance.methods.checkin(campaignID, address).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: chain3.version.network,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.sendMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.LogCheckedIn({
            who: address
          }, function (error, result) {
            if (!error) {
              console.log(result);
              resolve(true);
            } else {
              reject(false)
            }
          });
        });
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }
  },

  addQuestion: async function (campaignID, questioner, replier) {
    let self = this;
    let data;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.addQuestion.getData(campaignID, questioner, replier);
    } else {
      data = self.instance.methods.addQuestion(campaignID, questioner, replier).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: chain3.version.network,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.sendMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.LogQuestion({
            questioner: questioner,
            replier: replier
          }, function (error, result) {
            if (!error) {
              console.log(result);
              resolve(true);
            } else {
              reject(false)
            }
          });
        });
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }

  },

  changePercentage: async function (
    speakerP,
    sponsorP,
    participantP,
    questionP
  ) {
    let self = this;
    let data;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.changePercentage.getData(speakerP, sponsorP, participantP, questionP);
    } else {
      data = self.instance.methods.changePercentage(speakerP, sponsorP, participantP, questionP).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: chain3.version.network,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.sendMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      return res.result;
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }
  },

  changeFee: async function (fee) {
    let self = this;
    let data;
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.changeRegisterFee.getData(fee);
    } else {
      data = self.instance.methods.changeRegisterFee(fee).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: chain3.version.network,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.sendMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      return res.result;
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }
  },

  closeCampaign: async function (campaignID) {
    let self = this;
    let data;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.closeCampaign.getData(campaignID);
    } else {
      data = self.instance.methods.closeCampaign(campaignID).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: chain3.version.network,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.sendMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.LogClose({
            campaignID: campaignID
          }, function (error, result) {
            if (!error) {
              console.log(result);
              resolve(true);
            } else {
              reject(false)
            }
          });
        });
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        console.lg(transaction.status);
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }
  },

  getSalonInfo: async function (campaignID) {
    let self = this;
    let campaign;
    let speakerPercent;
    let sponsorPercent;
    let participantPercent;
    let questionPercent;
    let registerFee;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      campaign = self.instance.campaigns(campaignID);
      speakerPercent = self.instance.speakerPercent();
      sponsorPercent = self.instance.sponsorPercent();
      participantPercent = self.instance.participantPercent();
      questionPercent = self.instance.questionPercent();
      registerFee = self.instance.registerFee();
    } else {
      campaign = await self.instance.methods.campaigns(campaignID).call();
      speakerPercent = await self.instance.methods.speakerPercent().call();
      sponsorPercent = await self.instance.methods.sponsorPercent().call();
      participantPercent = await self.instance.methods.participantPercent().call();
      questionPercent = await self.instance.methods.questionPercent().call();
      registerFee = await self.instance.methods.registerFee().call();
    }
    let res = {
      campaign: campaign,
      speakerPercent: speakerPercent,
      sponsorPercent: sponsorPercent,
      participantPercent: participantPercent,
      questionPercent: questionPercent,
      registerFee: registerFee
    }
    return res;
  },

  isAddress: function (address) {
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      return chain3.isAddress(address);
    }
    return web3.utils.isAddress(address);
  }
};

export default Salon;