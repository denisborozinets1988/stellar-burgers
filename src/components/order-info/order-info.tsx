import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectIngredients } from '../../slices/ingredientsSlice';
import { useParams } from 'react-router-dom';
import {
  getOrderByNumber,
  selectFeed,
  selectOrderData
} from '../../slices/feedSlice';
import { selectOrders } from '../../slices/orderListUserSlice';

export const OrderInfo: FC = () => {
  const { id } = useParams();
  const orders = useAppSelector(selectFeed);
  const ordersUser = useAppSelector(selectOrders);
  const ordersActual: TOrder[] = location.pathname.startsWith('/profile/orders')
    ? ordersUser
    : orders;
  const dispatch = useAppDispatch();
  let orderData = useAppSelector(selectOrderData);

  useEffect(() => {
    if (!ordersActual.length && !orderData) {
      dispatch(getOrderByNumber(Number.parseInt(id ?? '')));
    }
  }, [ordersActual]);

  if (ordersActual.length) {
    orderData =
      ordersActual.find((x) => x.number === Number.parseInt(id ?? '')) ?? null;
  }

  const ingredients = useAppSelector(selectIngredients);

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
