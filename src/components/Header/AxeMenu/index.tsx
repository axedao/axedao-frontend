import { useState, useRef } from 'react';
import { getAddresses, TOKEN_DECIMALS, DEFAULT_NETWORK } from '../../../constants';
import { useSelector } from 'react-redux';
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade } from '@material-ui/core';
import { ReactComponent as ArrowUpIcon } from '../../../assets/icons/arrow-up.svg';
import './axe-menu.scss';
import { IReduxState } from '../../../store/slices/state.interface';
import { getTokenUrl } from '../../../helpers';
import BondLogo from '../../../components/BondLogo';

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string) => async () => {
  const tokenImage = getTokenUrl(tokenSymbol.toLowerCase());

  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: tokenImage,
          },
        },
      });
    } catch (error: any) {
      console.log(error);
    }
  }
};

function AxeMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;

  const networkID = useSelector<IReduxState, number>(state => {
    return (state.app && state.app.networkID) || DEFAULT_NETWORK;
  });

  const addresses = getAddresses(networkID);

  const { AXE_ADDRESS, sAXE_ADDRESS, RESERVES } = addresses;

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = 'ohm-popper';
  return (
    <>
      <Box
        component="div"
        onMouseEnter={e => handleClick(e)}
        onMouseLeave={e => handleClick(e)}
        id="ohm-menu-button-hover"
      >
        <div className="ohm-button btn btn-white">
          <p>BUY AXE</p>
        </div>

        <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => {
            return (
              <Fade {...TransitionProps} timeout={400}>
                <Paper className="ohm-menu" elevation={1}>
                  <Box component="div" className="buy-tokens">
                    <Link
                      href={'https://app.uniswap.org/#/swap?outputCurrency=' + AXE_ADDRESS}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button size="large" variant="contained" color="secondary" fullWidth>
                        <Typography className="buy-text" align="left">
                          Buy on Uniswap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                        </Typography>
                      </Button>
                    </Link>
                    <Link
                      href={'https://www.dextools.io/app/ether/pair-explorer/' + RESERVES.USDC_AXE}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button size="large" variant="contained" color="secondary" fullWidth>
                        <Typography className="buy-text" align="left">
                          Chart on Dextool <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                        </Typography>
                      </Button>
                    </Link>
                  </Box>

                  {isEthereumAPIAvailable ? (
                    <Box className="add-tokens">
                      <Divider color="secondary" />
                      <p>ADD TOKEN TO WALLET</p>
                      <Button
                        size="large"
                        variant="contained"
                        color="secondary"
                        onClick={addTokenToWallet('AXE', AXE_ADDRESS)}
                      >
                        <div className="row">
                          <BondLogo bond="axe" />
                          <Typography className="buy-text">AXE</Typography>
                        </div>
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={addTokenToWallet('sAXE', sAXE_ADDRESS)}
                      >
                        <div className="row">
                          <BondLogo bond="saxe" />
                          <Typography className="buy-text">sAXE</Typography>
                        </div>
                      </Button>
                    </Box>
                  ) : null}
                </Paper>
              </Fade>
            );
          }}
        </Popper>
      </Box>
    </>
  );
}

export default AxeMenu;
