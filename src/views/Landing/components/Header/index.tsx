import { useEffect, useState } from 'react';
import './header.scss';
import { Link } from '@material-ui/core';
import HeaderLogo from './header-logo.png';
import MenuIcon from './menu.svg';

export default function LandingHeader() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const [scrolled, setScrolled] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);
  let navbarClasses = ['header'];
  if (scrolled) {
    navbarClasses.push('scrolled');
  }
  // 
  if (sidebar) {
    navbarClasses.push("show-menu")
  }

  return (
    <header className={navbarClasses.join(' ')}>
      <div className="header__wrapper container">
        <div className="logo">
           <img src={HeaderLogo} alt="logo" />
        </div>
        <div className="h-center">
           <Link href="https://app.axedao.finance" target="_blank">
            <button className="pc btn btn-gradi">
              <span>Enter App</span>
            </button>
          </Link>
          <button
            className="mobile btn btn-icon menu-btn"
            onClick={(e) => { e.stopPropagation(); setSidebar(!sidebar) }}
          >
            <img src={MenuIcon} alt="" />
          </button>
        </div>
        <div className="mobile menu-overlay" onClick={(e) => { e.stopPropagation(); setSidebar(false) }}></div>
        <ul className="menu">
          <li>
            <Link href="https://app.axedao.finance/#/stake" target="_blank">Stake</Link>
          </li>
          <li>
            <Link href="https://app.axedao.finance/#/bonds" target="_blank">Bond</Link>
          </li>
          <li>
            <Link href="https://docs.axedao.finance/basics/faq" target="_blank">FAQs</Link>
          </li>
          <li>
            <Link href="https://docs.axedao.finance/links/contribute" target="_blank">Get Involved</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
