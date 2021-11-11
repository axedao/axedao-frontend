import { BigNumber, ethers } from 'ethers';
import { getAddresses, BONDS } from '../../constants';
import {
  StakingContract,
  StakedAxeContract,
  BondingCalcContract,
  AxeCirculatingSupply,
  AxeTokenContract,
} from '../../abi';
import { addressForAsset, contractForReserve, setAll } from '../../helpers';
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';
import { getMarketPrice, getTokenPrice } from '../../helpers';

const initialState = {
  loading: true,
};

export interface IApp {
  loading: boolean;
  stakingTVL: number;
  marketPrice: number;
  marketCap: number;
  totalSupply: number;
  circSupply: number;
  currentIndex: string;
  currentBlock: number;
  currentBlockTime: number;
  fiveDayRate: number;
  treasuryBalance: number;
  stakingAPY: number;
  stakingRebase: number;
  networkID: number;
  nextRebase: number;
  stakingRatio: number;
  backingPerAxe: number;
  treasuryRunway: number;
  pol: number;
}

interface ILoadAppDetails {
  networkID: number;
  provider: JsonRpcProvider;
}

// const getAmount = async (contract: any, address: string) => {
//   return await contract.balanceOf(address);
// }

export const loadAppDetails = createAsyncThunk(
  'app/loadAppDetails',
  //@ts-ignore
  async ({ networkID, provider }: ILoadAppDetails) => {
    const usdcPrice = await getTokenPrice('USDC');

    const addresses = getAddresses(networkID);
    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

    const axeContract = new ethers.Contract(addresses.AXE_ADDRESS, AxeTokenContract, provider);
    const sAXEContract = new ethers.Contract(addresses.sAXE_ADDRESS, StakedAxeContract, provider);
    const bondCalculator = new ethers.Contract(addresses.AXE_BONDING_CALC_ADDRESS, BondingCalcContract, provider);
    const axeCirculatingSupply = new ethers.Contract(
      addresses.AXE_CIRCULATING_SUPPLY,
      AxeCirculatingSupply,
      provider,
    );
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

    let token = contractForReserve(BONDS.usdc, networkID, provider);
    let token1 = contractForReserve(BONDS.usdc_axe, networkID, provider);
    // const usdcAmount = (await token.balanceOf(addresses.TREASURY_ADDRESS)) / 1e18;
    // const usdcAxeAmount = await token.balanceOf(addresses.TREASURY_ADDRESS);

    const [usdcAmount, usdcAxeAmount] = await Promise.all([
      (await token.balanceOf(addresses.TREASURY_ADDRESS)) / 1e18,
      token1.balanceOf(addresses.TREASURY_ADDRESS)
    ])

    const [
      valuation,
      markdown,
      [rfvLPValue, pol],
      stakingBalance,
      circSupply,
      totalSupply,
      epoch,
      sAxeCirc,
      currentIndex,
      rawMarketPrice
    ] = await Promise.all([
      bondCalculator.valuation(addressForAsset(BONDS.usdc_axe, networkID), usdcAxeAmount),
      bondCalculator.markdown(addressForAsset(BONDS.usdc_axe, networkID)),
      getDiscountedPairUSD(usdcAxeAmount, networkID, provider),
      stakingContract.contractBalance(),
      (await axeCirculatingSupply.AXECirculatingSupply()) / 1e9,
      (await axeContract.totalSupply()) / 1e9,
      stakingContract.epoch(),
      (await sAXEContract.circulatingSupply()) / 1e9,
      stakingContract.index(),
      getMarketPrice(networkID, provider)
    ])

    // const valuation = await bondCalculator.valuation(addressForAsset(BONDS.usdc_axe, networkID), usdcAxeAmount);
    // const markdown = await bondCalculator.markdown(addressForAsset(BONDS.usdc_axe, networkID));
    // const [rfvLPValue, pol] = await getDiscountedPairUSD(usdcAxeAmount, networkID, provider);

    const usdcAxeUSD = (valuation / 1e9) * (markdown / 1e18);

    const treasuryBalance = usdcAmount + usdcAxeUSD;
    const treasuryRiskFreeValue = usdcAmount + rfvLPValue;

    // const stakingBalance = await stakingContract.contractBalance();
    // const circSupply = (await axeCirculatingSupply.AXECirculatingSupply()) / 1e9;
    // const totalSupply = (await axeContract.totalSupply()) / 1e9;
    // const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute / 1e9;
    
    // const sAxeCirc = (await sAXEContract.circulatingSupply()) / 1e9;

    const stakingRebase = stakingReward / sAxeCirc;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
    
    const stakingRatio = sAxeCirc / circSupply;
    const backingPerAxe = treasuryRiskFreeValue / circSupply;

    // const currentIndex = await stakingContract.index();
    const nextRebase = epoch.endTime.toNumber();

    // const rawMarketPrice = await getMarketPrice(networkID, provider);
    
    const marketPrice = Number(((rawMarketPrice.toNumber() / 1e9) * usdcPrice).toFixed(2));
    const stakingTVL = (stakingBalance * marketPrice) / 1e9;
    const marketCap = circSupply * marketPrice;

    const treasuryRunway = Math.log(treasuryRiskFreeValue / sAxeCirc) / Math.log(1 + stakingRebase) / 3;

    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, 'gwei'),
      totalSupply,
      circSupply,
      marketCap,
      currentBlock,
      fiveDayRate,
      treasuryBalance,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketPrice,
      currentBlockTime,
      nextRebase,
      stakingRatio,
      backingPerAxe,
      treasuryRunway,
      pol,
    };
  },
);

//(slp_treasury/slp_supply)*(2*sqrt(lp_dai * lp_axe))
async function getDiscountedPairUSD(
  lpAmount: BigNumber,
  networkID: number,
  provider: JsonRpcProvider,
): Promise<[number, number]> {
  const pair = contractForReserve(BONDS.usdc_axe, networkID, provider);
  // const total_lp = await pair.totalSupply();
  // const reserves = await pair.getReserves();

  const [total_lp, reserves] = await Promise.all([
    pair.totalSupply(),
    pair.getReserves()
  ])

  // const lp_token_1 = reserves[0] / 1e9;
  const lp_token_2 = reserves[1] / 1e18;
  // const kLast = lp_token_1 * lp_token_2;

  const pol = lpAmount.mul(100).div(total_lp).toNumber() / 100;
  // const part2 = Math.sqrt(kLast) * 2;
  
  return [pol * lp_token_2, pol];
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

const baseInfo = (state: { app: IApp }) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
