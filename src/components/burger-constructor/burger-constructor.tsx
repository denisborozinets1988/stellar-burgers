import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder, TUser } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
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
  removeOrder
} from '../../slices/orderCurrentSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const user = useSelector<RootState, TUser | null>(selectUser);
  const bun = useSelector<RootState, TConstructorIngredient | null>(selectBun);
  const ingredients = useSelector<RootState, TConstructorIngredient[]>(
    selectItems
  );
  const orderRequest = useSelector<RootState, boolean>(selectOrderIsRequested);
  let orderModalData = useSelector<RootState, TOrder | null>(selectOrder);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

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
      dispatch(orderBurger([...ingredients.map((x) => x._id), bun!._id]));
    } else {
      navigate('/login');
    }
  };
  const closeOrderModal = () => {
    dispatch(removeOrder());
    dispatch(removeConstructorItemsAll());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? bun?.price ?? 0 * 2 : 0) +
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
