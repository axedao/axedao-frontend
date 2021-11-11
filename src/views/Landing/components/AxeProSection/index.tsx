import "./style.scss"
import AxeProImg from './Safe.png';

export default function AxeProSection() {
  return (
     <section id="axe-pro">
      <div className="container">
        <div className="section-wrapper">
          <div className="card">
            <img className="axe-pro-img" src={AxeProImg} alt="" />
            <div className="card-wrapper">
              <h2>Introducing AxeDAO</h2>
              <p>
                AxeDAO is a fork of OlympusDAO. When the great OHM has successfully helped its investors made profit,
                and become more stable, the opportunities for new investors are significantly low. AxeDAO understands the market trends,
                therefore can offers the new opportunity for new investors into this protocol.
              </p>
              <button className="btn btn-gradi" onClick={()=> window.open("https://app.axedao.finance/")}>
                <span>View AxeDAO</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
