import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import CountButton from '../../components/Common/CountButton';
import LoadingView from '../../components/Common/LoadingView';
import { MESSAGE } from '../../constants';
import useCart from '../../hooks/useCart';
import useGetQuery from '../../hooks/useGetQuery';
import useMediaQuery from '../../hooks/useMediaQuery';
import useToast from '../../hooks/useToast';
import { $CurrentServerUrl } from '../../recoil/atom';
import styles from './index.module.scss';
import type { Product } from '../../types';

function ProductDetail() {
  const { id } = useParams();
  const currentServerUrl = useRecoilValue($CurrentServerUrl);
  const { data: productData, loading, error } = useGetQuery<Product>(`${currentServerUrl}/products/${id}`);
  const { addCartItemWithQuantity } = useCart();
  const Toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const isMobile = useMediaQuery({ maxWidth: 700 });
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      Toast.error(MESSAGE.PRODUCT_GET_FAILED);
    }
  }, [Toast, error]);

  if (loading || !productData) {
    return <LoadingView />;
  }

  const handleAddCart = async () => {
    await addCartItemWithQuantity(productData, quantity);
  };

  return (
    <main className={styles.container}>
      <section className={styles['left-section']}>
        <img className={styles['product-image']} src={productData?.imageUrl} alt={productData?.name} />
        <div className={styles['product-detail']}>
          {isMobile && (
            <ul className={styles['product-info']}>
              <li>
                <span>
                  <strong>용량</strong>
                </span>
                <span>제품 명에 표기</span>
              </li>
              <li>
                <span>
                  <strong>크기</strong>
                </span>
                <span>높이 20cm, 지름 6cm</span>
              </li>
              <li>
                <span>
                  <strong>무게</strong>
                </span>
                <span>20g</span>
              </li>
              <li>
                <span>
                  <strong>소재</strong>
                </span>
                <span>PET (폴리에틸렌 테레프탈레이트)</span>
              </li>
            </ul>
          )}
          <h1>제품 상세</h1>
          <p>
            {productData?.name}은 당신의 일상에 꼭 필요한 실용적인 음료 용기입니다.
            <br /> 이 페트병은 현대적인 라이프스타일에 맞춰 가볍고 휴대성이 뛰어난 디자인으로 제작되었습니다. 친환경적인
            PET(폴리에틸렌 테레프탈레이트) 소재로 만들어져 재활용이 용이하며, 투명하고 세련된 외관 덕분에 내용물을
            한눈에 확인할 수 있습니다. 특히, 500ml라는 적당한 용량은 다양한 상황에서 편리하게 사용할 수 있도록
            설계되었습니다.
          </p>
          <p>
            단순히 물을 담는 용기를 넘어, 당신의 건강한 삶을 지원하는 중요한 도구가 됩니다. 이 병은 학교, 직장, 피트니스
            센터 등 어디에서나 사용할 수 있으며, 야외 활동이나 여행 시에도 최고의 동반자가 될 것입니다. 가벼운 무게와
            슬림한 크기로 가방에 넣어도 부담스럽지 않으며, 뛰어난 밀폐력 덕분에 누수 걱정 없이 사용할 수 있습니다.
          </p>
          <h2>주요 특징</h2>
          <ul>
            <li>
              - <strong>환경 친화적:</strong> 재활용 가능한 PET 소재로 제작.
            </li>
            <li>
              - <strong>투명한 외관:</strong> 내용물을 쉽게 확인 가능.
            </li>
            <li>
              - <strong>휴대성:</strong> 가벼운 무게와 컴팩트한 크기로 이동 시 편리.
            </li>
            <li>
              - <strong>밀폐력:</strong> 강화된 캡 디자인으로 누수 방지.
            </li>
          </ul>
          <p>
            단순히 편리함을 제공하는 것을 넘어, 환경을 생각하는 지속 가능한 소비를 가능하게 합니다. 사용 후 깨끗이
            세척하여 재사용하거나, 올바른 방식으로 재활용해 환경 보호에 기여할 수 있습니다.
          </p>
          <p>
            <strong>주의:</strong> 제품을 고온에 노출하지 마세요. 장시간 햇빛 아래 보관할 경우 병의 내구성이 저하될 수
            있습니다. 사용 후 반드시 세척한 뒤 보관하세요.
          </p>
        </div>
      </section>
      <section className={styles['right-section']}>
        {isMobile ? (
          <>
            <div className={styles['top-sheet']}>
              <div>
                <h2>{productData?.name}</h2>
                <p className={styles['delivery-info']}>유통사 : 김민재 유통</p>
              </div>
              <CountButton
                count={quantity}
                size="medium"
                handleDownButton={() => setQuantity(p => (p <= 1 ? 1 : p - 1))}
                handleUpButton={() => setQuantity(p => p + 1)}
              />
            </div>
            <p className={styles['price-info']}>{(productData?.price || 0) * quantity}원</p>
            <div className={styles['button-container']}>
              <button type="button" className={styles['add-cart-button']} onClick={() => handleAddCart()}>
                장바구니 담기
              </button>
              <button type="button" className={styles['buy-button']}>
                바로 구매
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h2>{productData?.name}</h2>
              <p className={styles['delivery-info']}>유통사 : 김민재 유통</p>
            </div>
            <p className={styles['price-info']}>{(productData?.price || 0) * quantity}원</p>
            <CountButton
              count={quantity}
              size="large"
              handleDownButton={() => setQuantity(p => (p <= 0 ? 0 : p - 1))}
              handleUpButton={() => setQuantity(p => p + 1)}
            />
            <ul className={styles['product-info']}>
              <li>
                <span>
                  <strong>용량</strong>
                </span>
                <span>제품 명에 표기</span>
              </li>
              <li>
                <span>
                  <strong>크기</strong>
                </span>
                <span>높이 20cm, 지름 6cm</span>
              </li>
              <li>
                <span>
                  <strong>무게</strong>
                </span>
                <span>20g</span>
              </li>
              <li>
                <span>
                  <strong>소재</strong>
                </span>
                <span>PET (폴리에틸렌 테레프탈레이트)</span>
              </li>
            </ul>
            <div className={styles['button-container']}>
              <button type="button" className={styles['add-cart-button']} onClick={handleAddCart}>
                장바구니 담기
              </button>
              <button
                type="button"
                className={styles['buy-button']}
                onClick={() => {
                  handleAddCart();
                  navigate('/cart');
                }}
              >
                바로 구매
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default ProductDetail;
