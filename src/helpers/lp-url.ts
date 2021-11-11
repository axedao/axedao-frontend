import { BONDS } from '../constants';
import { getAddresses } from '../constants';

export const lpURL = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.usdc_axe) {
    return `https://app.uniswap.org/#/add/${addresses.USDC_ADDRESS}/${addresses.AXE_ADDRESS}`;
  }

  throw Error(`LP url doesn't support: ${bond}`);
};
