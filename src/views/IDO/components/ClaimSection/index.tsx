import "./style.scss"
import { Button } from '@material-ui/core';
import styles from '../../ido.module.scss';
import happyOtter from '../../images/otter_happy.png';
import { BigNumber, ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { IDOContract, DAIContract, StakingContract } from 'src/abi';
import { useWeb3Context } from 'src/hooks';
import { getAddresses } from 'src/constants';
import { MediumLink } from 'src/constants';
import tokenIcon from '../../images/icon_token.svg';
import walletIcon from '../../images/wallet.png';


interface State {
  loading: boolean;
  txPending: boolean;
  connected: boolean;
  finalized: boolean;
  walletDaiBalance?: string;
  walletDAIAllowance?: string;
  whitelisted: boolean;
  allotment?: string;
  idoDAIAmount?: string;
  purchasedAmount?: string;
  stakingAmount?: string;
  error?: Error;
}

export type Action =
  | {
      type: 'load-details-complete';
      walletDaiBalance: string;
      walletDAIAllowance: string;
      whitelisted: boolean;
      allotment: string;
      idoDAIAmount: string;
      purchasedAmount: string;
      connected: boolean;
      stakingAmount: string;
      finalized: boolean;
    }
  | {
      type: 'approve';
    }
  | {
      type: 'approved';
      walletDAIAllowance: string;
    }
  | {
      type: 'purchasing';
    }
  | {
      type: 'purchased';
    }
  | {
      type: 'error';
      error: Error;
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'load-details-complete':
      let { type, connected, ...rest } = action;
      if (state.connected && !connected) {
        return state;
      }
      return {
        ...state,
        ...rest,
        loading: false,
        error: undefined,
      };
    case 'approve': {
      return { ...state, txPending: true, error: undefined };
    }
    case 'approved': {
      return {
        ...state,
        txPending: false,
        walletDAIAllowance: action.walletDAIAllowance,
      };
    }
    case 'purchasing': {
      return { ...state, txPending: true, error: undefined };
    }
    case 'purchased': {
      return { ...state, txPending: false };
    }
    case 'error': {
      return { ...state, error: action.error, loading: false, txPending: false };
    }
  }
}

export default function ClaimSection() {
  const { address: wallet, connect, connected, provider, chainID } = useWeb3Context();
  const addresses = getAddresses(chainID);
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    txPending: false,
    whitelisted: false,
    connected: false,
    finalized: false,
  });

  const dai = new ethers.Contract(addresses.DAI_ADDRESS, DAIContract, provider);
  const ido = new ethers.Contract(addresses.IDO, IDOContract, provider);
  const staking = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

  const loadDetails = useCallback(async () => {
    const idoDAIAmount = ethers.utils.formatEther(await dai.balanceOf(ido.address));
    let walletDaiBalance = connected ? await dai.balanceOf(wallet) : BigNumber.from(0);
    walletDaiBalance = walletDaiBalance.lt('1000000000') ? '0' : ethers.utils.formatEther(walletDaiBalance);
    const walletDAIAllowance = connected ? ethers.utils.formatEther(await dai.allowance(wallet, ido.address)) : '0';
    const whiteListEnabled = await ido.whiteListEnabled();
    const whitelisted = connected ? !whiteListEnabled || (await ido.whiteListed(wallet)) : false;
    let allotment = '0';
    try {
      allotment = whitelisted ? ethers.utils.formatUnits(await ido.getAllotmentPerBuyer(), 9) : '0';
    } catch (error: any) {}
    const purchasedAmount = connected ? ethers.utils.formatUnits(await ido.purchasedAmounts(wallet), 9) : '0';
    const warmupInfo = connected ? await staking.warmupInfo(wallet) : { deposit: BigNumber.from(0) };
    const stakingAmount = ethers.utils.formatUnits(warmupInfo.deposit, 9);
    const finalized = await ido.finalized();

    dispatch({
      type: 'load-details-complete',
      walletDaiBalance,
      walletDAIAllowance,
      whitelisted,
      allotment,
      idoDAIAmount,
      purchasedAmount,
      connected: Boolean(connected),
      stakingAmount,
      finalized,
    });
  }, [wallet, provider, connected]);
  const claim = useCallback(async () => {
    dispatch({ type: 'purchasing' });
    try {
      const tx = await ido.connect(provider.getSigner()).claim(wallet);
      await tx.wait(3);
      loadDetails();
    } catch (error: any) {
      console.error(error);
      dispatch({ type: 'error', error: error as Error });
    } finally {
      dispatch({ type: 'purchased' });
    }
  }, [provider, ido]);

  useEffect(() => {
    loadDetails();
  }, [connected]);

  useEffect(() => {
    loadDetails();
  }, [connected]);

  const NotConnectedBox = () => (
    <div className="notConnectedBox">
      <p className="title">
        Claim your <span className="mark-gradient-text">AXE</span> to join the AxeDAO now!
      </p>
      <div className="button">
        <Button className="btn btn-gradi" variant="contained" color="primary" size="large" disableElevation onClick={connect}>
          Connect Your Wallet
        </Button>
      </div>
      <div>
        <p className={styles.learnMore}>
          <a href={MediumLink}>Learn more</a>
        </p>
      </div>
      <img src={walletIcon} className="walletIcon"/>
    </div>
  );

  const SuccessBox = () => (
    <>
      <div className={styles.presale_header_success}>
        <h1 className={styles.successTitle}>You’ve claimed your AXE!</h1>
        <h1 className={styles.successSubTitle}>Welcome to the AxeDAO</h1>
      </div>
      <div className={styles.presale_success_content}>
        <div className={styles.balance_icon}>
          <img src={tokenIcon} className={styles.tokenIcon} />
        </div>

        {state.purchasedAmount != '0.0' && (
          <div className={styles.balance_stats}>
            <p>Your current balance</p>
            <div className={styles.tokenAmounts}>
              <p className={styles.tokenAmount}>
                {Intl.NumberFormat('en').format(Number(state.purchasedAmount || 0))}
                <span className={styles.tokenTitle}>AXE</span>
              </p>
            </div>
          </div>
        )}
        {state.purchasedAmount != '0.0' && (
          <div className={styles.contribution}>
            <p>Your contribution</p>
            <div className={styles.tokenAmounts}>
              <p className={styles.tokenAmount}>
                {Intl.NumberFormat('en').format(Number(state.purchasedAmount || 0) * 5)}
                <span className={styles.tokenTitle}>DAI</span>
              </p>
              <p className={styles.tokenSubTitle}>85 DAI = 1 AXE</p>
            </div>
          </div>
        )}
        {state.purchasedAmount != '0.0' && (
          <div className={styles.contribution}>
            <p>Your Staking</p>
            <div className={styles.tokenAmounts}>
              <p className={styles.tokenAmount}>
                {Intl.NumberFormat('en').format(Number(state.stakingAmount || 0))}
                <span className={styles.tokenTitle}>AXE</span>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.learnMoreArea}>
        {ethers.utils.parseUnits(state.stakingAmount || '0', 9).eq(0) && (
          <div className="claimButton">
            <Button
              className="btn btn-gradi"
              variant="contained"
              color="primary"
              size="medium"
              disableElevation
              onClick={claim}
              disabled={!state.finalized || state.txPending}
            >
              Claim & Stake
            </Button>
            {!state.finalized && <p>Stake & Claim will be available after 2021/11/10 0:00 UTC</p>}
            {state.error && <p>{state.error.message}</p>}
          </div>
        )}
        <div className="claimButton">
          <a style={{ textDecoration: 'none' }} href="https://app.axedao.finance">
            <Button className="btn btn-gradi" variant="contained" color="primary" size="medium" disableElevation>
              Enter app
            </Button>
          </a>
        </div>
        <p className={styles.learnMore}>
          <a href={MediumLink}>Learn more</a>
        </p>
      </div>
    </>
  );

  return (
    <section id="claim">
        <div className="container">
          <div className="section-wrapper">
            <div className="claim-header">
              <h1 className="claim-title mark-gradient-text">Claim your AXE</h1>
              <p className="claim-desc">
              The IDO will be held from Nov 10, 2021 0:00 UTC to Nov 10, 2021 23:59 UTC.
              Join the AxeDAO now!
            </p>
            </div>

           

            <div className="claim-card">
             <div className="claim-raised">
                <h1>Total Raised (DAI)</h1>
                <h2 className="mark-gradient-text">${Intl.NumberFormat('en').format(170000)}</h2>
            </div>

            
              {connected ? (
              <div className="claim-connect-card">
                
                  { (Number(state.purchasedAmount || '0') > 0 || Number(state.stakingAmount || '0')) > 0 ? (
                    <SuccessBox />
                  ) : state.loading ? (
                    <p className="soldOut">Loading...</p>
                  ) : (
                    <div className="soldOutContainer">
                      <p className="soldOut">Sold Out!</p>
                      <a style={{ textDecoration: 'none' }} href="https://app.axedao.finance">
                        <Button className="btn btn-gradi" variant="contained" color="primary" size="large" disableElevation>
                          Open App
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <NotConnectedBox />
              )}
            </div>
          </div>
        </div>
    </section>
  );
}
