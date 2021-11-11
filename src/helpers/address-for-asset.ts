import { getAddresses, BONDS } from '../constants';

export const addressForAsset = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.usdc) {
    return addresses.RESERVES.USDC;
  }

  if (bond === BONDS.usdc_axe) {
    return addresses.RESERVES.USDC_AXE;
  }

  throw Error(`Address for asset doesn't support: ${bond}`);
};
