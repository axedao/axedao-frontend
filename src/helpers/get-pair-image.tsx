import { SvgIcon } from '@material-ui/core';
import { ReactComponent as AXE } from '../assets/tokens/AXE.svg';
import { ReactComponent as DAI } from '../assets/tokens/DAI.svg';

export function getPairImage(name: string) {
  if (name.indexOf('dai') >= 0)
    return (
      <>
        <SvgIcon component={AXE} viewBox="0 0 1555 1555" style={{ height: '32px', width: '32px', zIndex:1 }} />
        <SvgIcon component={DAI} viewBox="0 0 32 32" style={{ height: '32px', width: '32px',marginLeft: '-11px'}} />
      </>
    );

  throw Error(`Pair image doesn't support: ${name}`);
}
