import { BONDS } from '../constants';
import { getAddresses } from '../constants';

export const lpURL = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.dai_axe) {
    return `https://app.uniswap.org/#/add/${addresses.DAI_ADDRESS}/${addresses.AXE_ADDRESS}`;
  }

  throw Error(`LP url doesn't support: ${bond}`);
};
