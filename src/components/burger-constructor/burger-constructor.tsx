import { FC, useMemo } from 'react';
import { TConstructorIngredient, TUser } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { selectBun, selectItems } from '../../slices/constructorSlice';
import { selectUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems+, orderRequest и orderModalData из стора */
  const user = useSelector<RootState, TUser | null>(selectUser);
  const bun = useSelector<RootState, TConstructorIngredient | null>(selectBun);
  const ingredients = useSelector<RootState, TConstructorIngredient[]>(
    selectItems
  );
  const navigate = useNavigate();

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

  const orderRequest = false;
  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (user) {
    } else {
      navigate('/login');
    }
  };
  const closeOrderModal = () => {};

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
