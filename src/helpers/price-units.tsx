import { SvgIcon } from '@material-ui/core';
import { ReactComponent as USDC } from '../assets/tokens/USDC.svg';

export const priceUnits = (bond: string) => {
  if (bond === 'usdc') return <SvgIcon component={USDC} viewBox="0 0 2000 2000" style={{ height: '15px', width: '15px' }} />;

  return '$';
};
