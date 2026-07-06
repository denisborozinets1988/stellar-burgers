import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getOrders, selectOrders } from '../../slices/orderListUserSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useAppSelector(selectOrders);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
