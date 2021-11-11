import { SvgIcon } from '@material-ui/core';
import { ReactComponent as AXE } from '../assets/tokens/AXE.svg';
import { ReactComponent as USDC } from '../assets/tokens/USDC.svg';

export function getPairImage(name: string) {
  if (name.indexOf('usdc') >= 0)
    return (
      <>
        <SvgIcon component={AXE} viewBox="0 0 1555 1555" style={{ height: '32px', width: '32px', zIndex:1 }} />
        <SvgIcon component={USDC} viewBox="0 0 2000 2000" style={{ height: '32px', width: '32px',marginLeft: '-11px'}} />
      </>
    );

  throw Error(`Pair image doesn't support: ${name}`);
}
