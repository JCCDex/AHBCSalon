import tp from "tp-js-sdk";

const SalonToken = {

  instance: null,

  fromAddress: null,

  toAddress: null,

  init: async function () {
    let self = this;

    const res = await tp.getCurrentWallet();
    self.fromAddress = res.data.address;
    if (process.env.VUE_APP_NETWORK === "MOAC") {
      self.toAddress = process.env.VUE_APP_TOKEN_ADDRESS_MOAC;
      self.instance = chain3.mc
        .contract(JSON.parse(process.env.VUE_APP_TOKENABI))
        .at(self.toAddress);
    } else {
      self.toAddress = process.env.VUE_APP_TOKEN_ADDRESS;
      self.instance = new web3.eth.Contract(
        JSON.parse(process.env.VUE_APP_TOKENABI),
        self.toAddress
      );
    }
  },

  totalSupply: async function () {
    let self = this;

    if (process.env.VUE_APP_NETWORK === "MOAC") {
      let tokens = self.instance.totalSupply();
      return chain3.fromSha(tokens, "mc");
    }
    let tokens = await self.instance.methods.totalSupply().call().catch(e => {
      console.log(e);
    });
    return web3.utils.fromWei(tokens);
  },

  getTokenBalance: async function () {
    let self = this;
    if (process.env.VUE_APP_NETWORK === "MOAC") {
      let tokens = self.instance.balanceOf(self.fromAddress);
      return chain3.fromSha(tokens, "mc");
    }
    let tokens = await self.instance.methods.balanceOf(self.fromAddress).call().catch(e => {
      console.log(e);
    });
    return web3.utils.fromWei(tokens);
  },

  transfer: async function (toAddress, amount) {
    let self = this;
    let data;
    let _amount;

    if (process.env.VUE_APP_NETWORK === "MOAC") {
      _amount = chain3.toSha(amount, "mc");
      data = self.instance.transfer.getData(toAddress, _amount);
    } else {
      _amount = web3.utils.toWei(amount);
      data = self.instance.methods.transfer(toAddress, _amount).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: chain3.version.network,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === "MOAC") {
      let res = await tp.sendMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.Transfer({
            from: self.fromAddress,
            to: toAddress
          }, function (error, result) {
            if (!error) {
              resolve(true);
            } else {
              reject(false);
            }
          });
        });
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth
          .sendSignedTransaction(res.data)
          .catch(e => {
            console.log(e);
          });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }
  },

  getBalance: async function () {
    let self = this;
    if (process.env.VUE_APP_NETWORK === "MOAC") {
      let balance = chain3.mc.getBalance(self.fromAddress).toString();
      return chain3.fromSha(balance, "mc");
    } else {
      let balance = await web3.eth.getBalance(self.fromAddress).toString();
      return web3.utils.fromWei(balance);
    }
  },

  isAddress: function (address) {
    if (process.env.VUE_APP_NETWORK === "MOAC") {
      return chain3.isAddress(address);
    }
    return web3.utils.isAddress(address);
  }
};

export default SalonToken;