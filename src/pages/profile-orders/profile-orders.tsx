import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { getOrders, selectOrders } from '../../slices/orderListUserSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector<RootState, TOrder[]>(selectOrders);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
