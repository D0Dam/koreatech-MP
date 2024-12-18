import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { MESSAGE, USER } from '../constants';
import { $CartList, $CheckedCartIdList, $CurrentServerUrl } from '../recoil/atom';
import useMutation from './useMutation';
import useToast from './useToast';
import type { CartItem, Product } from '../types';

const useCart = () => {
  const Toast = useToast();
  const currentServerUrl = useRecoilValue($CurrentServerUrl);
  const [cartList, setCartList] = useRecoilState($CartList(currentServerUrl));
  const setCheckedCartIdList = useSetRecoilState($CheckedCartIdList(currentServerUrl));

  const { mutateQuery: addCartQuery, loading: loadingAddState } = useMutation<Record<string, number>, CartItem>({
    onSuccess: data => {
      const regex = /[^0-9]/g;
      const cartId = data?.headers.get('Location')?.replace(regex, '');
      const product = data?.fetchInformation.referenceData as Product;

      if (cartId && product) {
        setCartList(prev => [...prev, { id: Number(cartId), quantity: 1, product }]);
      }

      setCheckedCartIdList(prev => [...prev, Number(cartId)]);

      Toast.success(MESSAGE.ADD_CART_SUCCESSFUL);
    },
    onFailure: () => {
      Toast.error(MESSAGE.ADD_CART_FAILED);
    },
  });

  const { mutateQuery: deleteCartQuery, loading: loadingDeleteState } = useMutation<Record<string, number>, CartItem>({
    onSuccess: data => {
      const regex = /(\d+)$/;
      const cartId = data?.fetchInformation.url.match(regex)?.at(1);

      setCartList(prev => prev.filter(({ id }) => id !== Number(cartId)));
      setCheckedCartIdList(prev => prev.filter(item => item !== Number(cartId)));

      Toast.success(MESSAGE.DELETE_CART_SUCCESSFUL);
    },
    onFailure: () => {
      Toast.error(MESSAGE.DELETE_CART_FAILED);
    },
  });

  const { mutateQuery: mutateQuantityQuery, loading: loadingQuantityState } = useMutation<
    Record<string, number>,
    CartItem
  >({
    onSuccess: data => {
      const regex = /(\d+)$/;
      const cartId = data?.fetchInformation.url.match(regex)?.at(1);
      const quantity = data?.fetchInformation?.bodyData?.quantity;

      if (cartId && quantity) {
        setCartList(prev => prev.map(item => (item.id === Number(cartId) ? { ...item, quantity } : item)));
      }
    },
    onFailure: () => {
      Toast.error(MESSAGE.MUTATE_CART_FAILED);
    },
  });

  const mutateQuantity = async (cartId: number, quantity: number) => {
    await mutateQuantityQuery({
      url: `${currentServerUrl}/cart-items/${cartId}`,
      method: 'PATCH',
      bodyData: { quantity },
      headers: {
        Authorization: `Basic ${btoa(USER)}`,
        'Content-Type': 'application/json',
      },
    });
  };

  const deleteCartItem = async (cartId: number) => {
    await deleteCartQuery({
      url: `${currentServerUrl}/cart-items/${cartId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${btoa(USER)}`,
      },
    });
  };

  const addCartItem = async (product: Product) => {
    await addCartQuery({
      url: `${currentServerUrl}/cart-items`,
      method: 'POST',
      bodyData: { productId: product.id },
      headers: {
        Authorization: `Basic ${btoa(USER)}`,
        'Content-Type': 'application/json',
      },
      referenceData: product,
    });
  };

  const addCartItemWithQuantity = async (product: Product, quantity: number) => {
    try {
      const res = await fetch(`${currentServerUrl}/cart-items`);
      const productData = (await res.json()) as CartItem[];

      const cart = productData?.find(cartItem => cartItem.product.id === product.id);

      if (cart) {
        await mutateQuantityQuery({
          url: `${currentServerUrl}/cart-items/${cart.id}`,
          method: 'PATCH',
          bodyData: { quantity: cart.quantity + quantity },
          headers: {
            Authorization: `Basic ${btoa(USER)}`,
            'Content-Type': 'application/json',
          },
        });

        Toast.success(MESSAGE.ADD_CART_SUCCESSFUL);
        return;
      }

      await addCartQuery({
        url: `${currentServerUrl}/cart-items`,
        method: 'POST',
        bodyData: { productId: product.id },
        headers: {
          Authorization: `Basic ${btoa(USER)}`,
          'Content-Type': 'application/json',
        },
        referenceData: product,
      });

      const afterRes = await fetch(`${currentServerUrl}/cart-items`);
      const afterProductData = (await afterRes.json()) as CartItem[];

      const afterCart = afterProductData?.find(cartItem => cartItem.product.id === product.id);

      if (afterCart) {
        await mutateQuantityQuery({
          url: `${currentServerUrl}/cart-items/${afterCart.id}`,
          method: 'PATCH',
          bodyData: { quantity },
          headers: {
            Authorization: `Basic ${btoa(USER)}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        Toast.error(MESSAGE.ADD_CART_FAILED);
      }

      Toast.success(MESSAGE.ADD_CART_SUCCESSFUL);
    } catch (error) {
      Toast.error(MESSAGE.ADD_CART_FAILED);
    }
  };

  const loading = loadingAddState || loadingDeleteState || loadingQuantityState;

  return {
    cartList,
    mutateQuantity,
    deleteCartItem,
    addCartItem,
    addCartItemWithQuantity,
    loading,
  };
};

export default useCart;
