import "./style.scss"
import HandGlassIcon from './glass-icon.png';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store/slices/state.interface';
import { Skeleton } from '@material-ui/lab';

const percentFormatter = Intl.NumberFormat('en', { style: 'percent', minimumFractionDigits: 2 });

export default function LiquiditySection() {
  const pol = useSelector<IReduxState, number>(state => {
    return state.app.pol;
  });
  const isBondLoading = useSelector<IReduxState, boolean>(state => !state.bonding['usdc_axe_lp']?.bondPrice ?? true);
  const bondPurchased = useSelector<IReduxState, number>(state => {
    return state.bonding['usdc_axe_lp'] && state.bonding['usdc_axe_lp'].purchased;
  });

  return (
    <section id="liquidity">
      <div className="card">
        <div className="container">
          <div className="section-wrapper">
            <img src={HandGlassIcon} alt="" className="hand-glass" />
            <div className="left">
              <h4>Liquidity Protected</h4>
              <p className="gray">
                AxeDAO LP is owned and protected by AxeDAO itself
              </p>
              <p>
                AxeDAO owns almost all of its liquidity, which helps maintain price
                stability and treasury income. With a protocol-owned liquidity,
                AxeDAO is protected from unpredictable and unfavorable market conditions due to longevity and efficiency.
              </p>
            </div>
            <div className="right">
              <ul>
                <li>
                  <h3>
                    {isBondLoading ? (
                      <Skeleton width="150px" />
                    ) : (
                      new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(bondPurchased)
                    )}
                  </h3>
                  <p>Protocol Owned Liquidity</p>
                </li>
                <li>
                  <h3>{pol ? percentFormatter.format(pol) : <Skeleton width="150px" />}</h3>
                  <p>Of Total LP Supply</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
