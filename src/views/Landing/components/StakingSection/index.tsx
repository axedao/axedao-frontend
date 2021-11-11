import "./style.scss"
import StakeIconCheck from './stake-icon-check.png';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store/slices/state.interface';
import { trim } from '../../../../helpers';
import { Skeleton } from '@material-ui/lab';

export default function StakingSection() {
  const stakingAPY = useSelector<IReduxState, number>(state => {
    return state.app.stakingAPY;
  });
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  return (
     <section id="staking">
      <div className="card-1">
        <div className="container">
          <div className="section-wrapper">
            <div className="card">
              <h2>Sustainable Staking APY</h2>
              <img
                className="staking-icon"
                src={StakeIconCheck}
                alt=""
              />
              <ul>
                <li>
                  <div className="chip">
                    {stakingAPY ? (
                      <>{new Intl.NumberFormat('en-US').format(Number(trimmedStakingAPY))}%</>
                    ) : (
                      <Skeleton width="150px" />
                    )}
                  </div>
                  <p>AXE Staking APY</p>
                  <button className="btn btn-gradi" onClick={()=> window.open("https://app.axedao.finance/#/stake", "_blank")}>
                    <span>Stake Now</span>
                  </button>
                </li>
                <li className="hr"></li>
                <li>
                  <h4>Treasury Regulated APY</h4>
                  <p className="gray">
                    Treasury inflow will always outperform staking rewards
                  </p>
                  <p>
                    AxeDAO is designed with long-term protocol health in mind.
                    All AXE minted for staking rewards are backed with a reserve from the Treasury.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="card-2">
        <div className="container">
          <div className="section-wrapper">
            <div>
              <svg viewBox="0 0 100 100">
                <text
                  x="50%"
                  y="61%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8rem"
                  fontWeight="800"
                  fill="#303030"
                >
                  3,3
                </text>
              </svg>
              <p>AxeDAO rewards stakers with compounding interest, increasing their AXE holdings over time.</p>
            </div>
            <div>
              <h4>Investment Protection</h4>
              <p className="gray">
                The fewer AXE staked, the higher APY
              </p>
              <p>
                AXE is minted and evenly distributed for staking rewards. More AXE staked reduces the APY
                but pushes the AXE price higher, creating a balance that protects your investment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
