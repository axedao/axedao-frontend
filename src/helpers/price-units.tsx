import { SvgIcon } from '@material-ui/core';
import { ReactComponent as DAI } from '../assets/tokens/DAI.svg';

export const priceUnits = (bond: string) => {
  if (bond === 'dai') return <SvgIcon component={DAI} viewBox="0 0 32 32" style={{ height: '15px', width: '15px' }} />;

  return '$';
};
