import { ethers } from 'ethers';
import { getAddresses } from '../../constants';
import { BetTestTokenContract, BettingProtocoalContract, ERC20Contract, zBetToken } from '../../abi';
import { setAll } from '../../helpers';

import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers';

import { Networks } from '../../constants/blockchain';
import React from 'react';
import { RootState } from '../store';

interface IGetBalances {
  address: string;
  networkID: Networks;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

// interface IAccountBalances {
//   balances: {
//     betTest: string;
//   };
// }

// export const getBalances = createAsyncThunk(
//   'account/getBalances',
//   async ({
//     address,
//     networkID,
//     provider,
//   }: IGetBalances): Promise<IAccountBalances> => {
//     const addresses = getAddresses(networkID);

//     const betTestContract = new ethers.Contract(
//       addresses.BETEST_ADDRESS,
//       BetTestTokenContract,
//       provider
//     );
//     const betTestBalance = await betTestContract.balanceOf(address);

//     return {
//       balances: {
//         betTest: ethers.utils.formatUnits(betTestBalance, 'gwei'),
//       },
//     };
//   }
// );

interface ILoadAccountDetails {
  address: string;
  networkID: Networks;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
  balances: {
    zBet: string;
    BUSD: string;
    MMF_CRO: string;
    MMF_USDT: string;
    AUSD: string;
  };
}

export const loadAccountDetails = createAsyncThunk(
  'account/loadAccountDetails',
  async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let zBetBalance = 0,
      busdBalance = 0,
      mmfcroBalance = 0,
      mmfusdtBalance = 0;
    let ausdBalance = 0;

    const addresses = getAddresses(networkID);

    // if (addresses.BETEST_ADDRESS) {
    //   const betTestContract = new ethers.Contract(
    //     addresses.BETEST_ADDRESS,
    //     BetTestTokenContract,
    //     provider
    //   );
    //   betTestBalance = await betTestContract.balanceOf(address);
    // }

    if (addresses.zBet) {
      const zBetContract = new ethers.Contract(addresses.zBet, zBetToken, provider);
      zBetBalance = await zBetContract.balanceOf(address);
    }

    if (addresses.AUSD) {
      const ausdContract = new ethers.Contract(addresses.AUSD, ERC20Contract, provider);
      ausdBalance = await ausdContract.balanceOf(address);
    }

    if (addresses.BUSD_ADDRESS) {
      const busdContract = new ethers.Contract(addresses.BUSD_ADDRESS, ERC20Contract, provider);
      busdBalance = await busdContract.balanceOf(address);
    }

    // if (addresses.MMF_CRO) {
    //   const mmfContract = new ethers.Contract(
    //     addresses.MMF_CRO,
    //     BetTestTokenContract,
    //     provider
    //   );
    //   mmfcroBalance = await mmfContract.balanceOf(address);
    // }

    // if (addresses.MMF_USDT) {
    //   const mmfContract = new ethers.Contract(
    //     addresses.MMF_USDT,
    //     BetTestTokenContract,
    //     provider
    //   );
    //   mmfusdtBalance = await mmfContract.balanceOf(address);
    // }

    return {
      balances: {
        zBet: zBetBalance ? ethers.utils.formatUnits(zBetBalance, 18) : '0',
        BUSD: busdBalance ? ethers.utils.formatUnits(busdBalance, 18) : '0',
        MMF_CRO: mmfcroBalance ? ethers.utils.formatUnits(mmfcroBalance, 18) : '0',
        MMF_USDT: mmfusdtBalance ? ethers.utils.formatUnits(mmfusdtBalance, 18) : '0',
        AUSD: ausdBalance ? ethers.utils.formatUnits(ausdBalance, 18) : '0', // <-- Now included!
      },
    };
  }
);

export interface IUserTokenDetails {
  allowance: number;
  balance: number;
  isAvax?: boolean;
}

export interface IAccountSlice {
  balances: {
    betTest: string;
  };
  loading: boolean;
  tokens: { [key: string]: IUserTokenDetails };
  bets: any;
  accountbets: any;
}

const initialState: IAccountSlice = {
  loading: true,
  balances: { betTest: '' },
  tokens: {},
  bets: [],
  accountbets: [],
};

export const loadMatchBets = createAsyncThunk(
  'app/loadMatchBets',
  //@ts-ignore
  async ({ address, provider, match }: ILoadMatchDetails) => {
    const bettingContract = new ethers.Contract(match.bettingcontract, BettingProtocoalContract, provider);

    const betPagination = await bettingContract.betPagination(address, 100, 100);

    let betDetails = [];
    await Promise.all(
      betPagination.map(async (betId: string, index: number) => {
        // const betDetail = await bettingContract.bets(address, betId);
        const betDetail = await bettingContract.getBetDetails(address, betId);
        // const isWinner = await bettingContract.isWinner(address, betId);
        // let claimableReward = 0;
        // if (betDetail[6]) {
        //   claimableReward =
        //     Number(await bettingContract.claimableReward(address, betId)) /
        //     1e18;
        // }
        const resultDeclared = await bettingContract.resultDeclared();
        const totalBets = Number(await bettingContract.totalBets());

        const betObject = {
          betID: betId,
          user: address,
          amount: Number(betDetail[0]) / 1e18,
          selectedOutCome: betDetail[1],
          betTime: Number(betDetail[2]),
          betSettlementTime: Number(betDetail[3]),
          betSettled: betDetail[4],
          betRevoked: betDetail[5],
          isWinner: betDetail[6],
          resultDeclared: resultDeclared,
          claimableReward: betDetail[6] ? Number(betDetail[7]) / 1e18 : 0,
          totalBets: totalBets,
          match: match,
        };
        betDetails[index] = betObject;
      })
    );

    return {
      ...betDetails,
    };
  }
);

export const loadAccountBets = createAsyncThunk(
  'app/loadAccountBets',
  //@ts-ignore
  async ({ address, provider, match, index }: ILoadMatchDetails) => {
    const bettingContract = new ethers.Contract(match.bettingcontract, BettingProtocoalContract, provider);

    const betPagination = await bettingContract.betPagination(address, 100, 100);

    let betDetails = [];
    await Promise.all(
      betPagination.map(async (betId: string, index: number) => {
        const betDetail = await bettingContract.bets(address, betId);
        const isWinner = await bettingContract.isWinner(address, betId);
        const resultDeclared = await bettingContract.resultDeclared();
        const totalBets = Number(await bettingContract.totalBets());
        const totalBettedAmount = Number(await bettingContract.totalBettedAmount()) / 1e18;
        let claimableReward = 0;
        if (isWinner) {
          claimableReward = Number(await bettingContract.claimableReward(address, betId)) / 1e18;
        }

        const betObject = {
          betID: betDetail[0],
          user: betDetail[1],
          amount: Number(betDetail[2]) / 1e18,
          selectedOutCome: betDetail[3],
          betTime: Number(betDetail[4]),
          betSettlementTime: Number(betDetail[5]),
          betSettled: betDetail[6],
          betRevoked: betDetail[7],
          isWinner: isWinner,
          resultDeclared: resultDeclared,
          totalBettedAmount: totalBettedAmount,
          claimableReward: claimableReward,
          totalBets: totalBets,
          match: match,
        };
        betDetails[index] = betObject;
      })
    );

    return {
      ...betDetails,
      index,
    };
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAccountDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(loadMatchBets.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadMatchBets.fulfilled, (state, action) => {
        state.bets = action.payload;
        state.loading = false;
      })
      .addCase(loadMatchBets.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(loadAccountBets.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAccountBets.fulfilled, (state, action) => {
        const index = action.payload.index;
        delete action.payload['index'];
        state.accountbets[index] = action.payload;
        state.loading = false;
      })
      .addCase(loadAccountBets.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
    // .addCase(getBalances.pending, (state) => {
    //   state.loading = true;
    // })
    // .addCase(getBalances.fulfilled, (state, action) => {
    //   setAll(state, action.payload);
    //   state.loading = false;
    // })
    // .addCase(getBalances.rejected, (state, { error }) => {
    //   state.loading = false;
    //   console.log(error);
    // });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, (account) => account);
