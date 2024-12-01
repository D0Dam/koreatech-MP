/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { MESSAGE } from '../../constants';
import useGetQuery from '../../hooks/useGetQuery';
import useToast from '../../hooks/useToast';
import { $CurrentServerUrl } from '../../recoil/atom';
import { Product } from '../../types';
import LoadingView from '../Common/LoadingView';
import ProductItem from '../ProductItem';
import styles from './index.module.scss';

function ProductItemList() {
  const currentServerUrl = useRecoilValue($CurrentServerUrl);
  const { data: productsData, loading, error } = useGetQuery<Product[]>(`${currentServerUrl}/products`);
  const Toast = useToast();

  useEffect(() => {
    if (error) {
      Toast.error(MESSAGE.PRODUCT_GET_FAILED);
    }
  }, [error]);

  if (loading) {
    return <LoadingView />;
  }

  return (
    <section className={styles.container}>
      {productsData?.map((item: Product) => (
        <Link to={`/product/${item.id}`} key={item.id}>
          <ProductItem product={item} />
        </Link>
      ))}
    </section>
  );
}

export default ProductItemList;
