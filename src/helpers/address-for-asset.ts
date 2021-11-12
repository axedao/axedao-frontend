import { getAddresses, BONDS } from '../constants';

export const addressForAsset = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.dai) {
    return addresses.RESERVES.DAI;
  }

  if (bond === BONDS.dai_axe) {
    return addresses.RESERVES.DAI_AXE;
  }

  throw Error(`Address for asset doesn't support: ${bond}`);
};
