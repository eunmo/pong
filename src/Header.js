import { Link } from 'react-router-dom';

import style from './Header.module.css';

function Header() {
  return (
    <Link className={style.Header} to="/">
      디사일로 탁구왕
    </Link>
  );
}

export default Header;
