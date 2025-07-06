import { Networks } from './blockchain';

const BSC_MAINNET = {
  BETEST_ADDRESS: '0x692D1D6e3abC0a8BA86dEF9fA8FB3E0EA770d49e',
  MMF: '0x692D1D6e3abC0a8BA86dEF9fA8FB3E0EA770d49e',
  MMF_CRO: '0x692D1D6e3abC0a8BA86dEF9fA8FB3E0EA770d49e',
  MMF_USDT: '0x692D1D6e3abC0a8BA86dEF9fA8FB3E0EA770d49e',
  zBet: '0x692D1D6e3abC0a8BA86dEF9fA8FB3E0EA770d49e',
  BUSD_ADDRESS: '0x692D1D6e3abC0a8BA86dEF9fA8FB3E0EA770d49e',
  AUSD: '0x692D1D6e3abC0a8BA86dEF9fA8FB3E0EA770d49e',
};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.KATANA) return BSC_MAINNET;

  throw Error("Network don't support");
};
