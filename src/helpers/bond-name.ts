import { BONDS } from '../constants';

export const bondName = (bond: string): string => {
  if (bond === BONDS.usdc) return 'USDC';
  if (bond === BONDS.usdc_axe) return 'AXE-USDC LP';

  throw Error(`Bond name doesn't support: ${bond}`);
};
