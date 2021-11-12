export const EPOCH_INTERVAL = 2200;
export const TOKEN_DECIMALS = 9;
export const BLOCK_RATE_SECONDS = 13.14;

export enum Networks {
  UNKNOW = 0,
  MAINNET = 1,
  RINKEBY = 4,
}

export const RPCURL = {
  MAINNET: 'https://mainnet.infura.io/v3/2cca9099e91f483e97fddd17c4493c1e',
  RINKEBY: 'https://rinkeby.infura.io/v3/d98b322397ca41ee86d071d157435ba1',
};

export const DEFAULT_NETWORK = Networks.MAINNET;
// export const DEFAULT_NETWORK = Networks.RINKEBY;
