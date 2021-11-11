import { SvgIcon } from '@material-ui/core';
import { ReactComponent as USDC } from '../assets/tokens/USDC.svg';
import { ReactComponent as AXE } from '../assets/tokens/AXE.svg';
import { ReactComponent as StakedAxe } from '../assets/tokens/sAXE.svg';

function getUSDCTokenImage() {
  return <SvgIcon component={USDC} viewBox="0 0 2000 2000" style={{ height: '32px', width: '32px' }} />;
}

function getAXETokenImage() {
  return <SvgIcon component={AXE} viewBox="0 0 1555 1555" style={{ height: '32px', width: '32px' }} />;
}

function getStakedAXETokenImage() {
  return <SvgIcon component={StakedAxe} viewBox="0 0 734 734" style={{ height: '32px', width: '32px' }} />;
}

export function getTokenImage(name: 'axe' | 'usdc' | 'saxe'): JSX.Element {
  if (name === 'usdc') return getUSDCTokenImage();
  if (name === 'axe') return getAXETokenImage();
  if (name === 'saxe') return getStakedAXETokenImage();

  throw Error(`Token image doesn't support: ${name}`);
}

function toUrl(base: string): string {
  const url = window.location.origin;
  return url + '/' + base;
}

export function getTokenUrl(name: string) {
  if (name === 'axe') {
    const path = require('../assets/tokens/AXE.svg').default;
    return toUrl(path);
  }

  if (name === 'saxe') {
    const path = require('../assets/tokens/sAXE.svg').default;
    return toUrl(path);
  }

  throw Error(`Token url doesn't support: ${name}`);
}
