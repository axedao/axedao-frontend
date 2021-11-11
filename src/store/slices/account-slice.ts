import { ethers } from 'ethers';
import { BONDS, getAddresses } from '../../constants';
import { AxeTokenContract, StakedAxeContract, USDCContract, StakingContract } from '../../abi/';
import { contractForBond, contractForReserve, setAll } from '../../helpers';

import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';

interface IState {
  [key: string]: any;
}

const initialState: IState = {
  loading: true,
};

interface IAccountProps {
  address: string;
  networkID: number;
  provider: JsonRpcProvider;
}

interface IUserBindDetails {
  bond?: string;
  allowance?: number;
  balance?: number;
  interestDue?: number;
  bondMaturationTime?: number;
  pendingPayout?: number;
}

export interface IAccount {
  balances: {
    usdc: string;
    sAxe: string;
    axe: string;
  };
  staking: {
    axeStake: number;
    sAxeUnstake: number;
    warmup: string;
    canClaimWarmup: boolean;
  };
}

export const getBalances = createAsyncThunk(
  'account/getBalances',
  async ({ address, networkID, provider }: IAccountProps) => {
    const addresses = getAddresses(networkID);
    const sAxeContract = new ethers.Contract(addresses.sAXE_ADDRESS, StakedAxeContract, provider);
    const axeContract = new ethers.Contract(addresses.AXE_ADDRESS, AxeTokenContract, provider);
    const [sAxeBalance, axeBalance] = await Promise.all([
      sAxeContract.balanceOf(address),
      axeContract.balanceOf(address)
    ])
    // const sAxeBalance = await sAxeContract.balanceOf(address);
    // const axeBalance = await axeContract.balanceOf(address);
    return {
      balances: {
        sAxe: ethers.utils.formatUnits(sAxeBalance, 'gwei'),
        axe: ethers.utils.formatUnits(axeBalance, 'gwei'),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  'account/loadAccountDetails',
  async ({ networkID, provider, address }: IAccountProps): Promise<IAccount> => {
    const addresses = getAddresses(networkID);

    const usdcContract = new ethers.Contract(addresses.USDC_ADDRESS, USDCContract, provider);
    const axeContract = new ethers.Contract(addresses.AXE_ADDRESS, AxeTokenContract, provider);
    const sAxeContract = new ethers.Contract(addresses.sAXE_ADDRESS, StakedAxeContract, provider);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

    const [usdcBalance, axeBalance, stakeAllowance, sAxeBalance, unstakeAllowance, warmup, epoch] = await Promise.all([
      usdcContract.balanceOf(address),
      axeContract.balanceOf(address),
      axeContract.allowance(address, addresses.STAKING_HELPER_ADDRESS),
      sAxeContract.balanceOf(address),
      sAxeContract.allowance(address, addresses.STAKING_ADDRESS),
      stakingContract.warmupInfo(address),
      stakingContract.epoch(),
    ]);

    return {
      balances: {
        sAxe: ethers.utils.formatUnits(sAxeBalance, 'gwei'),
        axe: ethers.utils.formatUnits(axeBalance, 'gwei'),
        usdc: ethers.utils.formatEther(usdcBalance),
      },
      staking: {
        axeStake: +stakeAllowance,
        sAxeUnstake: +unstakeAllowance,
        warmup: ethers.utils.formatUnits(warmup[0], 9),
        canClaimWarmup: warmup[0].gt(0) && epoch[1].gte(warmup[2]),
      },
    };
  },
);

interface ICalculateUserBondDetails {
  address: string;
  bond: string;
  networkID: number;
  provider: JsonRpcProvider;
}

export const calculateUserBondDetails = createAsyncThunk(
  'bonding/calculateUserBondDetails',
  async ({ address, bond, networkID, provider }: ICalculateUserBondDetails): Promise<IUserBindDetails> => {
    if (!address) return {};

    const addresses = getAddresses(networkID);
    const bondContract = contractForBond(bond, networkID, provider);
    const reserveContract = contractForReserve(bond, networkID, provider);

    let interestDue, pendingPayout, bondMaturationTime;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationTime = +bondDetails.vesting + +bondDetails.lastTimestamp;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = '0';

    if (bond === BONDS.usdc) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.USDC);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    }

    if (bond === BONDS.usdc_axe) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.USDC_AXE);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, 'ether');
    }

    return {
      bond,
      allowance: Number(allowance),
      balance: Number(balance),
      interestDue,
      bondMaturationTime,
      pendingPayout: Number(ethers.utils.formatUnits(pendingPayout, 'gwei')),
    };
  },
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.status = 'idle';
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.status = 'loading';
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.status = 'idle';
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        //@ts-ignore
        const bond = action.payload.bond!;
        state[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: { account: IAccount }) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
