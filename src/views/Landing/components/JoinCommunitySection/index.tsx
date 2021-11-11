import { Link } from '@material-ui/core';
import "./style.scss"
import TeleIcon from './icons/tele.svg';
import TwitterIcon from './icons/twitter.svg';
import GithubIcon from './icons/github.svg';
import JoinIcon from './join-icon.png';

export default function JoinCommunitySection() {
  return (
    <section id="join">
      <div className="container">
        <div className="section-wrapper">
          <ul>
            <li className="left">
              <h2>Join the community</h2>
              <ul className="socials">
                <li>
                  <Link href="https://t.me/Axe_Dao" target="_blank">
                    <img src={TeleIcon} alt="" />
                  </Link>
                </li>
                <li>
                  <Link href="https://twitter.com/AxeDao" target="_blank">
                    <img src={TwitterIcon} alt="" />
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/axedao" target="_blank">
                    <img src={GithubIcon} alt="" />
                  </Link>
                </li>
              </ul>

              <ul className="menu">
                <li>
                  <ul>
                    <li>
                      <h3>Products</h3>
                    </li>
                    <li>
                      <Link href="https://app.axedao.finance/#/bonds" target="_blank">Bonds</Link>
                    </li>
                    <li>
                      <Link href="https://app.axedao.finance/#/stake" target="_blank">Staking</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <ul>
                    <li>
                      <h3>Learn</h3>
                    </li>
                    <li>
                      <Link href="https://docs.axedao.finance" target="_blank">Documentation</Link>
                    </li>
                    <li>
                      <Link href="https://axedao.medium.com/">Medium</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="right">
              <img src={JoinIcon} alt="" />
              <h3>Join the community</h3>
              <button className="btn btn-gradi" onClick={() => { window.location.href = "https://discord.gg/aPsrVWnuKG"}}>
                <span>Join Discord</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
