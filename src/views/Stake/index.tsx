import { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Box,
  Paper,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tab,
  Tabs,
  TabsActions,
  Zoom,
} from '@material-ui/core';
import RebaseTimer from '../../components/RebaseTimer/RebaseTimer';
import TabPanel from '../../components/TabPanel';
import { trim } from '../../helpers';
import { changeStake, changeApproval, axeWarmup } from '../../store/slices/stake-thunk';
import './stake.scss';
import { useWeb3Context } from '../../hooks';
import { IPendingTxn, isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';
import { Skeleton } from '@material-ui/lab';
import { IReduxState } from '../../store/slices/state.interface';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Stake() {
  const dispatch = useDispatch();
  const { provider, address, connect, chainID } = useWeb3Context();
  const tabsActions = useRef<TabsActions>(null);

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState<string>();

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const currentIndex = useSelector<IReduxState, string>(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector<IReduxState, number>(state => {
    return state.app.fiveDayRate;
  });
  const axeBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.axe;
  });
  const sAxeBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.sAxe;
  });
  const stakeAllowance = useSelector<IReduxState, number>(state => {
    return state.account.staking && state.account.staking.axeStake;
  });
  const unstakeAllowance = useSelector<IReduxState, number>(state => {
    return state.account.staking && state.account.staking.sAxeUnstake;
  });
  const warmupBalance = useSelector<IReduxState, string>(state => {
    return state.account.staking && state.account.staking.warmup;
  });
  const canClaimWarmup = useSelector<IReduxState, boolean>(state => {
    return state.account.staking && state.account.staking.canClaimWarmup;
  });
  const stakingRebase = useSelector<IReduxState, number>(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector<IReduxState, number>(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector<IReduxState, number>(state => {
    return state.app.stakingTVL;
  });
  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(axeBalance);
    } else {
      setQuantity(sAxeBalance);
    }
  };

  const onSeekApproval = async (token: string) => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    //@ts-ignore
    if (isNaN(quantity) || quantity === 0 || quantity === '') {
      // eslint-disable-next-line no-alert
      alert('Please enter a value!');
    } else {
      await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: chainID }));
    }
  };

  const onClaimWarmup = async () => {
    await dispatch(axeWarmup({ address, provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === 'AXE') return stakeAllowance > 0;
      if (token === 'sAXE') return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance],
  );

  const changeView = (event: any, newView: number) => {
    setView(newView);
  };

  const trimmedSAxeBalance = trim(Number(sAxeBalance), 4);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim(
    (Number(stakingRebasePercentage) / 100) * (Number(trimmedSAxeBalance) + Number(warmupBalance)),
    4,
  );

  useEffect(() => {
    if (tabsActions.current) {
      setTimeout(() => tabsActions?.current?.updateIndicator(), 300);
    }
  }, [tabsActions]);

  return (
    <div id="stake-view">
      <Zoom in={true}>
        <Paper className="ohm-card">
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <p className="single-stake-title">
                  AXE Staking ({String.fromCodePoint(0x1FA93)}, {String.fromCodePoint(0x1FA93)})
                </p>
                <RebaseTimer />
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <p className="single-stake-subtitle">APY</p>
                      <p className="single-stake-subtitle-value mark-gradient-text">
                        {stakingAPY ? (
                          new Intl.NumberFormat('en-US', {
                            style: 'percent',
                          }).format(stakingAPY)
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </p>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <p className="single-stake-subtitle">TVL</p>
                      <p className="single-stake-subtitle-value mark-gradient-text">
                        {stakingTVL ? (
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }).format(stakingTVL)
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </p>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <p className="single-stake-subtitle">Current Index</p>
                      <p className="single-stake-subtitle-value mark-gradient-text">
                        {currentIndex ? <>{trim(Number(currentIndex), 3)} sAXE</> : <Skeleton width="150px" />}
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    <div className="app-otter-button" onClick={connect}>
                      <p>Connect Wallet</p>
                    </div>
                  </div>
                  <p className="desc-text">Connect your wallet to stake AXE tokens!</p>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      action={tabsActions}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Unstake" {...a11yProps(0)} />
                    </Tabs>

                    <Box className="stake-action-row" display="flex" alignItems="center">
                      <FormControl className="ohm-input" variant="outlined" color="primary">
                        <InputLabel htmlFor="amount-input"></InputLabel>
                        <OutlinedInput
                          id="amount-input"
                          type="number"
                          placeholder="Amount"
                          className="stake-input"
                          value={quantity || ""}
                          onChange={e => setQuantity(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <div onClick={setMax} className="stake-input-btn">
                                <p>Max</p>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </FormControl>

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        <div className="stake-tab-buttons-group">
                          {address && hasAllowance('AXE') ? (
                            <div
                              className="stake-tab-panel-btn btn btn-gradi"
                              onClick={() => {
                                if (isPendingTxn(pendingTransactions, 'staking')) return;
                                onChangeStake('stake');
                              }}
                            >
                              <p>{txnButtonText(pendingTransactions, 'staking', 'Stake')}</p>
                            </div>
                          ) : (
                            <div
                              className="stake-tab-panel-btn btn btn-gradi"
                              onClick={() => {
                                if (isPendingTxn(pendingTransactions, 'approve_staking')) return;
                                onSeekApproval('AXE');
                              }}
                            >
                              <p>{txnButtonText(pendingTransactions, 'approve_staking', 'Approve')}</p>
                            </div>
                          )}
                          {canClaimWarmup && (
                            <div
                              className="stake-tab-panel-btn btn btn-gradi"
                              onClick={() => {
                                if (isPendingTxn(pendingTransactions, 'axeWarmup')) return;
                                onClaimWarmup();
                              }}
                            >
                              <p>{txnButtonText(pendingTransactions, 'axeWarmup', 'Claim')}</p>
                            </div>
                          )}
                        </div>
                      </TabPanel>

                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {address && hasAllowance('sAXE') ? (
                          <div
                            className="stake-tab-panel-btn btn btn-gradi"
                            onClick={() => {
                              if (isPendingTxn(pendingTransactions, 'unstaking')) return;
                              onChangeStake('unstake');
                            }}
                          >
                            <p>{txnButtonText(pendingTransactions, 'unstaking', 'Unstake AXE')}</p>
                          </div>
                        ) : (
                          <div
                            className="stake-tab-panel-btn btn btn-gradi"
                            onClick={() => {
                              if (isPendingTxn(pendingTransactions, 'approve_unstaking')) return;
                              onSeekApproval('sAXE');
                            }}
                          >
                            <p>{txnButtonText(pendingTransactions, 'approve_unstaking', 'Approve')}</p>
                          </div>
                        )}
                      </TabPanel>
                    </Box>

                    <div className="help-text">
                      {address && ((!hasAllowance('AXE') && view === 0) || (!hasAllowance('sAXE') && view === 1)) && (
                        <p className="text-desc">
                          Note: The "Approve" transaction is only needed when staking/unstaking for the first time;
                          subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake"
                          transaction.
                        </p>
                      )}
                    </div>
                  </Box>

                  <div className={`stake-user-data`}>
                    {Number(warmupBalance) > 0 && (
                      <div className="data-row">
                        <p className="data-row-name-warmup">Your Staked Balance in warmup</p>
                        <p className="data-row-value">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(warmupBalance), 4)} AXE</>}
                        </p>
                      </div>
                    )}

                    <div className="data-row">
                      <p className="data-row-name">Your Balance</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(axeBalance), 4)} AXE</>}
                      </p>
                    </div>
                    <div className="data-row">
                      <p className="data-row-name">Your Staked Balance</p>
                      <p className="data-row-value">
                        {isAppLoading ? (
                          <Skeleton width="80px" />
                        ) : (
                          <>{new Intl.NumberFormat('en-US').format(Number(trimmedSAxeBalance))} sAXE</>
                        )}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">Next Reward Amount</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} sAXE</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">Next Reward Yield</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">ROI (5-Day Rate)</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(fiveDayRate) * 100, 4)}%</>}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default Stake;
