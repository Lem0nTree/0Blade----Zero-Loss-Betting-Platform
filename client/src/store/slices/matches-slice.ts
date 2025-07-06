import { ethers, Contract } from 'ethers';
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { BetTestTokenContract, BettingProtocoalContract, StakingHelperContract } from '../../abi';
import matches from '../../data/matches.json';
import { getMultiplier, setAll } from '../../helpers';
import { getAddresses, Networks } from '../../constants';
import { JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import { info, success, warning } from './messages-slice';
import { messages } from '../../constants/messages';
import { getGasPrice } from '../../helpers/get-gas-price';
import { sleep } from '../../helpers/sleep';
import { metamaskErrorWrap } from '../../helpers/metamask-error-wrap';
import { calculateLpTokenPrice } from '../../helpers/get-lptoken-price';

export interface IMatchSlice {
  matches: any;
}

interface ILoadMatchDetails {}

export const loadMatchDetails = createAsyncThunk(
  'app/loadMatchDetails',
  //@ts-ignore
  async ({ networkID, provider, match, index }: ILoadMatchDetails) => {
    console.log('🔄 [loadMatchDetails] Starting to load match details...');
    console.log('🔄 [loadMatchDetails] Input parameters:', { networkID, provider: !!provider, match, index });

    try {
      const addresses = getAddresses(networkID);
      console.log('✅ [loadMatchDetails] Addresses loaded:', addresses);

      console.log('✅ [loadMatchDetails] Creating betting contract with address:', match.bettingcontract);
      const bettingContract = new ethers.Contract(match.bettingcontract, BettingProtocoalContract, provider);

      let lpPrice;
      if (!match.isLP) {
        lpPrice = 0;
        console.log('✅ [loadMatchDetails] Match is not LP, setting lpPrice to 0');
      } else {
        console.log('✅ [loadMatchDetails] Calculating LP price for address:', match.lpTokenAddress);
        lpPrice = await calculateLpTokenPrice(match.lpTokenAddress, provider);
        console.log('✅ [loadMatchDetails] LP price calculated:', lpPrice);
      }

      console.log('✅ [loadMatchDetails] Getting staking helper address...');
      let stakingContractAddress;
      try {
        stakingContractAddress = await bettingContract.stakingHelper();
      } catch (error) {
        console.error('❌ [loadMatchDetails] Error getting staking helper address:', error);
        throw error;
      }
      console.log('✅ [loadMatchDetails] Staking contract address:', stakingContractAddress);

      const stakingContract = new ethers.Contract(stakingContractAddress, StakingHelperContract, provider);

      console.log('✅ [loadMatchDetails] Fetching contract parameters...');
      const withDrawFee = Number(await bettingContract.WITHDRAW_FEE());
      const startTime = Number(await bettingContract.startTime());
      const bettingPeriod = Number(await bettingContract.bettingPeriod());
      const lockingPeriod = Number(await bettingContract.lockingPeriod());
      const claimingPeriod = Number(await bettingContract.claimingPeriod());
      const minimumBet = Number(await bettingContract.minimumBet()) / 1e18;
      const totalBettedAmount = Number(await bettingContract.totalBettedAmount()) / 1e18;
      const treasuryFund = Number(await bettingContract.treasuryFund()) / 1e18;
      const totalBets = Number(await bettingContract.totalBets());

      console.log('✅ [loadMatchDetails] Contract parameters loaded:', {
        withDrawFee,
        startTime,
        bettingPeriod,
        lockingPeriod,
        claimingPeriod,
        minimumBet,
        totalBettedAmount,
        treasuryFund,
        totalBets,
      });

      console.log('✅ [loadMatchDetails] Calculating actual pot...');
      let stakingTotalRewards, stakingTotalValue;

      // Check if staking contract address is zero address
      if (stakingContractAddress === '0x0000000000000000000000000000000000000000') {
        stakingTotalRewards = 0;
        stakingTotalValue = 0;
        console.log('✅ [loadMatchDetails] Staking contract is zero address, setting values to 0');
      } else {
        stakingTotalRewards = Number(await stakingContract.totalRewards());
        stakingTotalValue = Number(await stakingContract.totalValue());
      }

      console.log('✅ [loadMatchDetails] Staking values:', { stakingTotalRewards, stakingTotalValue });

      const actualPot = Number(((stakingTotalRewards + stakingTotalValue) / 1e18 - (totalBettedAmount + treasuryFund)).toFixed(2));
      console.log('✅ [loadMatchDetails] Actual pot calculated:', actualPot);

      const potPrize = ((totalBettedAmount + treasuryFund) * (match.farmapy / 365) * (lockingPeriod / 86400)) / 100;
      console.log('✅ [loadMatchDetails] Pot prize calculated:', potPrize);

      console.log('✅ [loadMatchDetails] Processing match outcomes...');
      let multiplierCalculation: any = [];
      let bettedAmountCalculation: any = [];

      await Promise.all(
        match.matchoutcome.map(async (outcome: string, index: number) => {
          console.log(`✅ [loadMatchDetails] Processing outcome ${index + 1}:`, outcome);
          const bettedAmount = Number(await bettingContract.bettedAmount(index + 1)) / 1e18;
          bettedAmountCalculation[index] = bettedAmount;
          console.log(`✅ [loadMatchDetails] Betted amount for outcome ${index + 1}:`, bettedAmount);

          if (bettedAmount) {
            const multiplier = getMultiplier(10, bettedAmount, totalBettedAmount, treasuryFund, match.farmapy, lockingPeriod);
            multiplierCalculation.push(multiplier);
            console.log(`✅ [loadMatchDetails] Multiplier for outcome ${index + 1}:`, multiplier);
          } else {
            multiplierCalculation.push(0);
            console.log(`✅ [loadMatchDetails] No betted amount for outcome ${index + 1}, multiplier set to 0`);
          }
        })
      );

      const result = {
        ...match,
        withDrawFee,
        startTime,
        bettingPeriod,
        lockingPeriod,
        claimingPeriod,
        totalBettedAmount,
        treasuryFund,
        multiplierCalculation,
        bettedAmountCalculation,
        potPrize,
        minimumBet,
        totalBets,
        actualPot,
        lpPrice,
        index,
      };

      console.log('✅ [loadMatchDetails] Final result:', result);
      console.log('✅ [loadMatchDetails] Match details loaded successfully!');

      return result;
    } catch (error) {
      console.error('❌ [loadMatchDetails] Error loading match details:', error);
      console.error('❌ [loadMatchDetails] Error details:', {
        message: error.message,
        stack: error.stack,
        networkID,
        matchAddress: match?.bettingcontract,
        index,
      });
      throw error;
    }
  }
);

interface IPlaceBet {
  amount: string;
  outCome: string;
  networkID: Networks;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  match: any;
  address: string;
}

export const placeBet = createAsyncThunk(
  'app/placeBet',
  async ({ amount, outCome, match, networkID, provider, address }: IPlaceBet, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const gasPrice = await getGasPrice(provider);

    const tokenContract = new ethers.Contract(addresses[match.farmtoken], BetTestTokenContract, signer);

    const allowance = Number(await tokenContract.allowance(address, match.bettingcontract));

    if (!allowance) {
      const approvetx = await tokenContract.approve(
        match.bettingcontract,
        '115792089237316195423570985008687907853269984665640564039457584007913129639935'
      );
      await approvetx.wait();
    }

    const bettingContract = new ethers.Contract(match.bettingcontract, BettingProtocoalContract, signer);

    let placebet;
    try {
      placebet = await bettingContract.placeBet(amount, outCome, {
        gasPrice,
      });

      await placebet.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
      await sleep(0.01);

      return;
    } catch (err: any) {
      metamaskErrorWrap(err, dispatch);
    } finally {
    }
  }
);

interface IRevokeBet {
  betId: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  match: any;
}

export const revokeBet = createAsyncThunk('app/revokeBet', async ({ match, betId, provider }: IRevokeBet, { dispatch }) => {
  if (!provider) {
    dispatch(warning({ text: messages.please_connect_wallet }));
    return;
  }

  const signer = provider.getSigner();
  const bettingContract = new ethers.Contract(match.bettingcontract, BettingProtocoalContract, signer);

  let revokeBet;
  try {
    const gasPrice = await getGasPrice(provider);

    revokeBet = await bettingContract.revokeBet(betId, {
      gasPrice,
    });

    await revokeBet.wait();
    dispatch(success({ text: messages.tx_successfully_send }));
    await sleep(0.01);
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);

    return;
  } catch (err: any) {
    metamaskErrorWrap(err, dispatch);
  } finally {
  }
});

export const claim = createAsyncThunk('app/claim', async ({ match, betId, provider }: IRevokeBet, { dispatch }) => {
  if (!provider) {
    dispatch(warning({ text: messages.please_connect_wallet }));
    return;
  }

  const signer = provider.getSigner();
  const bettingContract = new ethers.Contract(match.bettingcontract, BettingProtocoalContract, signer);

  let revokeBet;
  try {
    const gasPrice = await getGasPrice(provider);

    revokeBet = await bettingContract.claim(betId, {
      gasPrice,
    });

    await revokeBet.wait();
    dispatch(success({ text: messages.claim_success }));
    await sleep(0.01);
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);

    return;
  } catch (err: any) {
    metamaskErrorWrap(err, dispatch);
  } finally {
  }
});

const initialState = {
  matches: matches,
  loading: true,
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadMatchDetails.pending, (state) => {
        console.log('🔄 [matchSlice] loadMatchDetails.pending - Setting loading to true');
        state.loading = true;
      })
      .addCase(loadMatchDetails.fulfilled, (state, action) => {
        console.log('✅ [matchSlice] loadMatchDetails.fulfilled - Updating match at index:', action.payload.index);
        console.log('✅ [matchSlice] Updated match data:', action.payload);
        state.matches[action.payload.index] = action.payload;
        state.loading = false;
        console.log('✅ [matchSlice] Loading set to false');
      })
      .addCase(loadMatchDetails.rejected, (state, { error }) => {
        console.error('❌ [matchSlice] loadMatchDetails.rejected - Error:', error);
        console.error('❌ [matchSlice] Error message:', error.message);
        state.loading = false;
        console.log('❌ [matchSlice] Loading set to false due to error');
      });
  },
});

export default matchSlice.reducer;

const baseInfo = (state: RootState) => state.match;

export const getMatchState = createSelector(baseInfo, (match) => match);
