import { isBondLP, getTokenImage, getPairImage } from '../helpers';
import { Box } from '@material-ui/core';

interface IBondHeaderProps {
  bond: string;
}

function BondHeader({ bond }: IBondHeaderProps) {
  const reserveAssetImg = () => {
    if (bond.indexOf('saxe') >= 0) {
      return getTokenImage('saxe');
    }
    else if (bond.indexOf('axe') >= 0) {
      return getTokenImage('axe');
    }
    else if (bond.indexOf('dai') >= 0) {
      return getTokenImage('dai');
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={'74px'}>
      {isBondLP(bond) ? getPairImage(bond) : reserveAssetImg()}
    </Box>
  );
}

export default BondHeader;
