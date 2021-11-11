import "./style.scss"
import HowWorksIcon1 from './how-works-1.png';
import HowWorksIcon2 from './how-works-2.png';
import HowWorksIcon3 from './how-works-3.png';

export default function AxeProSection() {
  return (
     <section id="how-works">
      <div className="container">
        <div className="section-wrapper">
          <h2>How AxeDAO Works</h2>
          <ul>
            <li>
              <div>
                <h3>01. Bonds & LP fees</h3>
                <h4>Treasury Revenue</h4>
                <p>
                  Bond sales and LP Fees increase Treasury Revenue and lock in liquidity and help control AXE supply
                </p>
              </div>
              <img src={HowWorksIcon1} alt="" />
            </li>
            <li>
              <div>
                <h3>02. Axe Treasury</h3>
                <h4>Treasury Growth</h4>
                <p>
                  Treasury inflow is used to increase Treasury Balance and back outstanding AXE tokens and regulate staking APY
                </p>
              </div>
              <img src={HowWorksIcon2} alt="" />
            </li>
            <li>
              <div>
                <h3>03. AXE Token</h3>
                <h4>Staking Rewards</h4>
                <p>
                  Compounds yields automatically through a treasury backed currency with intrinsic value
                </p>
              </div>
              <img src={HowWorksIcon3} alt="" />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
