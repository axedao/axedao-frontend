import { ethers } from 'ethers';
import { getAddresses, BONDS } from 'src/constants';
import { UsdcContract, AxeUsdcContract } from '../abi';

export const contractForReserve = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
) => {
  const addresses = getAddresses(networkID);
  if (bond === BONDS.usdc) {
    return new ethers.Contract(addresses.RESERVES.USDC, UsdcContract, provider);
  }

  if (bond === BONDS.usdc_axe) {
    return new ethers.Contract(addresses.RESERVES.USDC_AXE, AxeUsdcContract, provider);
  }

  throw Error(`Contract for reserve doesn't support: ${bond}`);
};
