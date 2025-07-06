import { ethers } from 'ethers';
import { LPTokenContract } from '../abi';
import { getTokenData } from '../utils/token-data';
import { getTokenPrice } from './token-price';

const WHITELIST_ADDRESS = [
  '0x66e428c3f67a68878562e79A0234c1F83c208770',
  '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
];

const WHITELIST_ADDRESS_BSC = ['0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'];

const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

const CRO_ADDRESS = '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23'; // use checksum
const MMF_ADDRESS = '0x97749c9B61F878a880DfE312d2594AE07AEd7656 '; // use checksum

const getLpTokenReserves = async (LpTokenContract) => {
  try {
    const totalReserves = await LpTokenContract.getReserves();

    return [Number(totalReserves[0]), Number(totalReserves[1])];
  } catch (e) {
    console.log(e);
    return [0, 0];
  }
};

const getLpTokenTotalSupply = async (LpTokenContract) => {
  try {
    const totalSupply = await LpTokenContract.totalSupply();
    return Number(totalSupply);
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const calculateLpTokenPrice = async (lp_token_address, provider) => {
  const LpTokenContract = new ethers.Contract(
    lp_token_address,
    LPTokenContract,
    provider
  );
  const token0 = await LpTokenContract.token0();
  const token1 = await LpTokenContract.token1();
  const totalReserve = await getLpTokenReserves(LpTokenContract);

  // Total Supply of LP Tokens in the Market
  const totalSupply = await getLpTokenTotalSupply(LpTokenContract);
  let lpTokenPrice;
  if (
    WHITELIST_ADDRESS.indexOf(token0) > -1 ||
    WHITELIST_ADDRESS.indexOf(token1) > -1
  ) {
    let stablecoinreserve;
    if (WHITELIST_ADDRESS.indexOf(token0) > -1) {
      stablecoinreserve = totalReserve[0] / 1e6;
    } else {
      stablecoinreserve = totalReserve[1] / 1e6;
    }

    lpTokenPrice = (stablecoinreserve * 2) / (Number(totalSupply) / 1e18);
  } else {
    let rewardTokenPrice = 0;
    let stablecoinreserve;
    // Token Price
    if (token0 == MMF_ADDRESS || token1 == MMF_ADDRESS) {
      rewardTokenPrice = getTokenPrice('MMF');
      const reserve = token0 == MMF_ADDRESS ? totalReserve[0] : totalReserve[1];
      stablecoinreserve = reserve / 1e18;
    } else if (token0 == CRO_ADDRESS || token1 == CRO_ADDRESS) {
      rewardTokenPrice = getTokenPrice('CRO');
      const reserve = token0 == CRO_ADDRESS ? totalReserve[0] : totalReserve[1];
      stablecoinreserve = reserve / 1e18;
    }
    lpTokenPrice =
      (stablecoinreserve * 2 * rewardTokenPrice) / (Number(totalSupply) / 1e18);
  }

  // If lpTokenPrice is a valid number return lpTokenPrice or return 0

  return lpTokenPrice ? lpTokenPrice : 0;
};

export const calculateLpTokenPriceBSC = async (lp_token_address, provider) => {
  const LpTokenContract = new ethers.Contract(
    lp_token_address,
    LPTokenContract,
    provider
  );
  const token0 = await LpTokenContract.token0();
  const token1 = await LpTokenContract.token1();
  const totalReserve = await getLpTokenReserves(LpTokenContract);

  // Total Supply of LP Tokens in the Market
  const totalSupply = await getLpTokenTotalSupply(LpTokenContract);
  let lpTokenPrice;
  if (
    WHITELIST_ADDRESS_BSC.indexOf(token0) > -1 ||
    WHITELIST_ADDRESS_BSC.indexOf(token1) > -1
  ) {
    let stablecoinreserve;
    if (WHITELIST_ADDRESS_BSC.indexOf(token0) > -1) {
      stablecoinreserve = totalReserve[0] / 1e18;
    } else {
      stablecoinreserve = totalReserve[1] / 1e18;
    }

    lpTokenPrice = (stablecoinreserve * 2) / (Number(totalSupply) / 1e18);
  } else {
    let rewardTokenPrice = 0;
    let stablecoinreserve;
    // Token Price
    if (token0 === WBNB_ADDRESS || token1 === WBNB_ADDRESS) {
      rewardTokenPrice = (await getTokenData('binancecoin')).price;

      const reserve =
        token0 === WBNB_ADDRESS ? totalReserve[0] : totalReserve[1];
      stablecoinreserve = reserve / 1e18;
    }
    // else if (token0 == CRO_ADDRESS || token1 == CRO_ADDRESS) {
    //   rewardTokenPrice = getTokenPrice('CRO');
    //   const reserve = token0 == CRO_ADDRESS ? totalReserve[0] : totalReserve[1];
    //   stablecoinreserve = reserve / 1e18;
    // }
    lpTokenPrice =
      (stablecoinreserve * 2 * rewardTokenPrice) / (Number(totalSupply) / 1e18);
  }

  // If lpTokenPrice is a valid number return lpTokenPrice or return 0

  return lpTokenPrice ? lpTokenPrice : 0;
};
