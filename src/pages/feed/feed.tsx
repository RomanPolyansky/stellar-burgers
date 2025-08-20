import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedOrders, selectFeedOrders } from '../../slices/feedSlice';
import { selectIsLoading } from '../../slices/feedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(getFeedOrders());
  }, []);

  const refreshFeed = () => {
    dispatch(getFeedOrders());
  };
  
  return (
    <>
      {isLoading ? <Preloader /> : 
        <FeedUI orders={orders} handleGetFeeds={refreshFeed} />
      }
    </>
  );
};
