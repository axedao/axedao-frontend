import { ethers } from 'ethers';
import { getAddresses } from '../../constants';
import { IDOContract, DAIContract } from '../../abi';
import { setAll } from '../../helpers';
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';

const initialState = {
  loading: true,
};

export interface IDOState {
  loading: boolean;
  walletDaiBalance: string;
  allowance: string;
  allotment: string;
}

interface loadIDODetailsPayload {
  wallet: string;
  networkID: number;
  provider: JsonRpcProvider;
}

export const loadIDODetails = createAsyncThunk(
  'ido/load-ido-details',
  //@ts-ignore
  async ({ wallet, networkID, provider }: loadIDODetailsPayload) => {
    const addresses = getAddresses(networkID);
    const dai = new ethers.Contract(addresses.DAI_ADDRESS, DAIContract, provider);
    const ido = new ethers.Contract(addresses.IDO, IDOContract, provider);

    const walletDaiBalance = ethers.utils.formatEther(await dai.balanceOf(wallet));
    const allowance = ethers.utils.formatEther(await dai.allowance(wallet, ido.address));
    const allotment = ethers.utils.formatUnits(await ido.getAllotmentPerBuyer(), 9);

    return {
      walletDaiBalance,
      allowance,
      allotment,
    };
  },
);

export interface ChangeApprovalActionPayload {
  wallet: string;
  networkID: number;
  provider: JsonRpcProvider;
}

const idoSlice = createSlice({
  name: 'ido',
  initialState,
  reducers: {
    fetchIDOSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadIDODetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadIDODetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadIDODetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

const baseInfo = (state: { ido: IDOState }) => state.ido;

export default idoSlice.reducer;

export const { fetchIDOSuccess } = idoSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
