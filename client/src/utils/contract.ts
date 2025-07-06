import { StaticJsonRpcProvider, JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { Networks } from '../constants/blockchain';
import { ERC20Contract, zBetToken } from '../abi';
import { ethers } from 'ethers';
import { getAddresses } from '../constants/addresses';

export function getZBETSignerContract(networkID: Networks, signer: JsonRpcSigner) {
  const addresses = getAddresses(networkID);
  // const signer = provider.getSigner();
  return new ethers.Contract(addresses.zBet, zBetToken, signer);
}

export function getBUSDSignerContract(networkID: Networks, signer: JsonRpcSigner) {
  const addresses = getAddresses(networkID);
  // const signer = provider.getSigner();
  return new ethers.Contract(addresses.zBet, ERC20Contract, signer);
}
