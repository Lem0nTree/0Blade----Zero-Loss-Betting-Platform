import { Networks } from '../constants/blockchain';

const switchRequest = () => {
  return window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x38' }],
  });
};

const addChainRequest = () => {
  return window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '129399',
        chainName: 'Tatara',
        rpcUrls: ['https://rpc.tatara.katanarpc.com/'],
        blockExplorerUrls: ['https://bscscan.com/'],
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
      },
    ],
  });
};

export const swithNetwork = async () => {
  if (window.ethereum) {
    try {
      await switchRequest();
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await addChainRequest();
          await switchRequest();
        } catch (addError) {
          console.log(error);
        }
      }
      console.log(error);
    }
  }
};
