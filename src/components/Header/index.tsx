import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ReactComponent as ShoppingCart } from '../../assets/shopping-cart.svg';
import { ReactComponent as User } from '../../assets/user.svg';
import useMediaQuery from '../../hooks/useMediaQuery';
import useToast from '../../hooks/useToast';
import { $CartList, $CurrentServerUrl } from '../../recoil/atom';
import styles from './index.module.scss';

function Header() {
  const currentServerUrl = useRecoilValue($CurrentServerUrl);
  const cartList = useRecoilValue($CartList(currentServerUrl));
  const isMobile = useMediaQuery({ maxWidth: 700 });
  const Toast = useToast();

  return (
    <header className={styles.container}>
      <Link to="/">
        <h1 className={styles['header-title']}>Bottle Shop</h1>
      </Link>
      <nav className={styles.nav}>
        <Link to="/order">
          <button type="button" className={styles.order}>
            {!isMobile && <span>주문 목록</span>}
            <User width={isMobile ? 20 : 24} />
          </button>
        </Link>
        <span>|</span>
        <Link to="/cart">
          <button className={styles['cart-button']} type="button" onClick={() => Toast.reset}>
            {!isMobile && <span>장바구니</span>}
            <ShoppingCart width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} />
            <div className={styles['cart-count']}>{cartList.length}</div>
          </button>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
