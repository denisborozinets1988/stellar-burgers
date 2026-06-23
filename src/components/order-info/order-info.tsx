import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { selectIngredients } from '../../slices/ingredientsSlice';
import { useParams } from 'react-router-dom';
import {
  getOrderByNumber,
  selectFeed,
  selectOrderData
} from '../../slices/feedSlice';

export const OrderInfo: FC = () => {
  const { id } = useParams();
  const orders = useSelector<RootState, TOrder[]>(selectFeed);
  const dispatch = useDispatch<AppDispatch>();
  let orderData = useSelector<RootState, TOrder | null>(selectOrderData);

  if (orders.length) {
    orderData =
      orders.find((x) => x.number === Number.parseInt(id ?? '')) ?? null;
  } else {
    if (!orderData) {
      dispatch(getOrderByNumber(Number.parseInt(id ?? '')));
    }
  }

  const ingredients = useSelector<RootState, TIngredient[]>(selectIngredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
