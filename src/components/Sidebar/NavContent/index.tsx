import { useCallback, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Social from '../Social';
import ActiveMenuIcon from './icon_menu_active.png';
import InactiveMenuIcon from './icon_menu_inactive.png';
import AppLogo from './app_logo.png';
import { trim, shorten } from '../../../helpers';
import { useAddress, useBonds } from '../../../hooks';
import { Paper, Link, Box, SvgIcon } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import '../sidebar.scss';

function NavContent() {
  const [isActive] = useState();
  const bonds = useBonds();
  const address = useAddress();
  const location = useLocation();

  const checkPage = useCallback((location: any, page: string): boolean => {
    const currentPath = location.pathname.replace('/', '');
    if (currentPath.indexOf('dashboard') >= 0 && page === 'dashboard') {
      return true;
    }
    if (currentPath.indexOf('stake') >= 0 && page === 'stake') {
      return true;
    }
    if ((currentPath.indexOf('bonds') >= 0 || currentPath.indexOf('choose_bond') >= 0) && page === 'bonds') {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://www.axedao.finance" target="_blank">
              <img src={AppLogo} />
            </Link>
            {address && (
              <div className="wallet-link">
                <Link href={`https://etherscan.io/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Link
                component={NavLink}
                id="dashboard-nav"
                to="/dashboard"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'dashboard');
                }}
                className={`button-dapp-menu ${isActive ? 'active' : ''}`}
              >
                <div className="dapp-menu-item">
                  <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0.00195312C23.2845 0.00195312 30 6.26975 30 14.002C30 21.7342 23.2845 28.002 15 28.002C6.7155 28.002 0 21.7342 0 14.002C0 6.26975 6.7155 0.00195312 15 0.00195312ZM15 4.20195C9.201 4.20195 4.5 8.58955 4.5 14.002C4.5 16.5948 5.58 18.9538 7.341 20.7066L7.575 20.9306L9.696 18.9524C8.34 17.684 7.5 15.934 7.5 14.002C7.5 10.1366 10.8585 7.00195 15 7.00195C15.672 7.00195 16.323 7.08455 16.9425 7.23995L19.287 5.05315C17.9775 4.50715 16.527 4.20195 15 4.20195ZM24.588 10.0022L22.2465 12.189C22.4115 12.7672 22.5 13.3748 22.5 14.002C22.5 15.934 21.66 17.684 20.304 18.9524L22.425 20.932C24.324 19.1582 25.5 16.7082 25.5 14.002C25.5 12.5768 25.1745 11.223 24.588 10.0022ZM21.363 6.08215L15.7755 11.2958C15.528 11.2342 15.2685 11.202 15 11.202C13.3425 11.202 12 12.455 12 14.002C12 15.549 13.3425 16.802 15 16.802C16.6575 16.802 18 15.549 18 14.002C18 13.7514 17.9655 13.5092 17.8995 13.2782L23.4855 8.06175L21.3645 6.08215H21.363Z"
                      fill={checkPage(location, 'dashboard') ? "url(#gradient-icon)" : "rgba(255, 255, 255, 0.6)"} />
                    <defs>
                    <linearGradient id="gradient-icon" x1="-3.09917" y1="-2.46864" x2="32.296" y2="0.484762" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#69156B"/>
                      <stop offset="0.461458" stopColor="#EF003F"/>
                      <stop offset="0.9965" stopColor="#FFA252"/>
                    </linearGradient>
                    </defs>
                  </svg>
                  <p>Dashboard</p>
                </div>
              </Link>

              <Link
                component={NavLink}
                id="stake-nav"
                to="/"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'stake');
                }}
                className={`button-dapp-menu ${isActive ? 'active' : ''}`}
              >
                <div className="dapp-menu-item">
                  <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.8387 13.502H14.9227C16.6189 13.502 18.2456 14.1757 19.445 15.3749C20.6444 16.5742 21.3182 18.2007 21.3182 19.8967H11.3683L11.3697 21.3177H22.7394V19.8967C22.7349 18.3846 22.298 16.9054 21.4802 15.6335H25.5818C26.9252 15.6332 28.2412 16.0136 29.3772 16.7306C30.5132 17.4477 31.4226 18.4721 32 19.685C28.6388 24.1201 23.197 27.002 17.0545 27.002C13.1306 27.002 9.80636 26.1635 7.10606 24.6927V11.4713C8.83512 11.7189 10.4679 12.4195 11.8387 13.502ZM5.68485 24.1598C5.68485 24.5367 5.53511 24.8982 5.26858 25.1647C5.00205 25.4312 4.64056 25.5809 4.26363 25.5809H1.42121C1.04428 25.5809 0.682792 25.4312 0.416263 25.1647C0.149734 24.8982 0 24.5367 0 24.1598V11.3704C0 10.9935 0.149734 10.632 0.416263 10.3655C0.682792 10.099 1.04428 9.94932 1.42121 9.94932H4.26363C4.64056 9.94932 5.00205 10.099 5.26858 10.3655C5.53511 10.632 5.68485 10.9935 5.68485 11.3704V24.1598ZM24.1606 4.26511C25.2914 4.26511 26.3759 4.71426 27.1754 5.51376C27.975 6.31326 28.4242 7.39761 28.4242 8.52827C28.4242 9.65893 27.975 10.7433 27.1754 11.5428C26.3759 12.3423 25.2914 12.7914 24.1606 12.7914C23.0298 12.7914 21.9453 12.3423 21.1458 11.5428C20.3462 10.7433 19.897 9.65893 19.897 8.52827C19.897 7.39761 20.3462 6.31326 21.1458 5.51376C21.9453 4.71426 23.0298 4.26511 24.1606 4.26511ZM14.2121 0.00195312C15.3429 0.00195313 16.4274 0.451106 17.227 1.2506C18.0265 2.0501 18.4757 3.13445 18.4757 4.26511C18.4757 5.39577 18.0265 6.48012 17.227 7.27962C16.4274 8.07912 15.3429 8.52827 14.2121 8.52827C13.0813 8.52827 11.9969 8.07912 11.1973 7.27962C10.3977 6.48012 9.94848 5.39577 9.94848 4.26511C9.94848 3.13445 10.3977 2.0501 11.1973 1.2506C11.9969 0.451106 13.0813 0.00195313 14.2121 0.00195312Z"
                    fill={checkPage(location, 'stake') ? "url(#gradient-icon)" : "rgba(255, 255, 255, 0.6)"} />
                  </svg>
                  <p>Stake</p>
                </div>
              </Link>

              <Link
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isActive={(match: any, location: any) => {
                  return checkPage(location, 'bonds');
                }}
                className={`button-dapp-menu ${isActive ? 'active' : ''}`}
              >
                <div className="dapp-menu-item">
                  <svg width="29" height="27" viewBox="0 0 29 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6 26.002H1.45C1.06544 26.002 0.696623 25.8498 0.424695 25.5789C0.152767 25.308 0 24.9406 0 24.5575V1.4464C0 1.06331 0.152767 0.695907 0.424695 0.425021C0.696623 0.154135 1.06544 0.00195313 1.45 0.00195312H11.6C11.6 0.768134 11.9055 1.50293 12.4494 2.04471C12.9932 2.58648 13.7309 2.89084 14.5 2.89084C15.2691 2.89084 16.0068 2.58648 16.5506 2.04471C17.0945 1.50293 17.4 0.768134 17.4 0.00195312H27.55C27.9346 0.00195313 28.3034 0.154135 28.5753 0.425021C28.8472 0.695907 29 1.06331 29 1.4464V24.5575C29 24.9406 28.8472 25.308 28.5753 25.5789C28.3034 25.8498 27.9346 26.002 27.55 26.002H17.4C17.4 25.2358 17.0945 24.501 16.5506 23.9592C16.0068 23.4174 15.2691 23.1131 14.5 23.1131C13.7309 23.1131 12.9932 23.4174 12.4494 23.9592C11.9055 24.501 11.6 25.2358 11.6 26.002ZM5.8 7.22418V18.7797H8.7V7.22418H5.8ZM20.3 7.22418V18.7797H23.2V7.22418H20.3Z"
                    fill={checkPage(location, 'bonds') ? "url(#gradient-icon)" : "rgba(255, 255, 255, 0.6)"} />
                  </svg>

                  <p>Bond</p>
                </div>
              </Link>

              <div className="dapp-menu-data discounts">
                <div className="bond-discounts">
                  <small>Bond discounts</small>
                  {bonds.map((bond, i) => (
                    <Link component={NavLink} to={`/bonds/${bond.value}`} key={i} className={'bond'}>
                      {bond.discount == NaN ? (
                        <Skeleton variant="text" width={'150px'} />
                      ) : (
                        <p>
                          {bond.name}
                          <span className="bond-pair-roi">{bond.discount && trim(bond.discount * 100, 2)}%</span>
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="flex-end" flexDirection="column">
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
