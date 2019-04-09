# 安徽区块链技术沙龙 DAPP

主要实现功能:1)沙龙报名,沙龙token转账;2)管理员特权:沙龙创建,人员签到,修改报名费和奖金比例,保存提问人员地址,关闭沙龙

## .env文件配置

### MOAC
```
VUE_APP_NETWORK = 'MOAC'
VUE_APP_TOKEN_ADDRESS_MOAC = ''  // 沙龙token地址
VUE_APP_SALON_ADDRESS_MOAC = ''  //沙龙合约地址
VUE_APP_SALON_VNODE_MOAC = ''  //节点url
```

### ETH
```
VUE_APP_NETWORK = 'ETH'
VUE_APP_TOKEN_ADDRESS = ''  // 沙龙token地址
VUE_APP_SALON_ADDRESS = '' //沙龙合约地址
VUE_APP_SALON_VNODE ='' //节点url
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### deploye salon contracts in moac node
```
npm run deploy
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
