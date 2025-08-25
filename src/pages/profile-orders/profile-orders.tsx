import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getProfileOrders, selectIsLoading, selectProfileOrders } from '../../slices/orderSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);


  return <ProfileOrdersUI orders={orders} isLoading={isLoading} />;
};
