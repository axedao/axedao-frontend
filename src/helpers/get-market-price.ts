import { BigNumber, ethers } from 'ethers';
import { getAddresses } from '../constants';
import { AxeUsdcContract } from '../abi';

export async function getMarketPrice(
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): Promise<BigNumber> {
  const address = getAddresses(networkID);
  const pairContract = new ethers.Contract(address.RESERVES.USDC_AXE, AxeUsdcContract, provider);
  const reserves = await pairContract.getReserves();
  const marketPrice = reserves[0].div(reserves[1]);
  return marketPrice;
}
