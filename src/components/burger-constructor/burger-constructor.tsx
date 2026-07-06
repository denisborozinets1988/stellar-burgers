import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient, TOrder, TUser } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  removeConstructorItemsAll,
  selectBun,
  selectItems
} from '../../slices/constructorSlice';
import { selectUser } from '../../slices/userSlice';
import {
  orderBurger,
  selectOrderIsRequested,
  selectOrder,
  removeOrder,
  selectOrderSuccess
} from '../../slices/orderCurrentSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const user = useAppSelector(selectUser);
  const bun = useAppSelector(selectBun);
  const ingredients = useAppSelector(selectItems);
  const orderRequest = useAppSelector(selectOrderIsRequested);
  const orderSuccess = useAppSelector(selectOrderSuccess);
  let orderModalData = useAppSelector(selectOrder);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(removeConstructorItemsAll());
  }, [orderSuccess]);

  const constructorItems = {
    ...(bun && {
      bun: {
        name: bun.name,
        price: bun.price,
        image: bun.image
      }
    }),
    ingredients: ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (user) {
      dispatch(
        orderBurger([...ingredients.map((x) => x._id), bun!._id, bun!._id])
      );
    } else {
      navigate('/login');
    }
  };
  const closeOrderModal = () => {
    dispatch(removeOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
