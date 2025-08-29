import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  clearConstructor,
  selectAllIngredients,
  selectBun,
  selectIngredients
} from '../../slices/burgerConstructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  clearOrder,
  orderBurger,
  selectNewOrder,
  selectOrderRequest
} from '../../slices/orderSlice';
import { selectIsLoggedIn } from '../../slices/loginSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();

  const constructorItems = {
    bun: useSelector(selectBun),
    ingredients: useSelector(selectIngredients)
  };
  const dispatch = useDispatch();

  const orderRequest = useSelector(selectOrderRequest);

  const orderModalData = useSelector(selectNewOrder);

  const allIngredients = useSelector(selectAllIngredients);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const ingredientIds = allIngredients
      .filter((item): item is TIngredient => item !== null)
      .map((item) => item._id);
    dispatch(orderBurger(ingredientIds));
  };
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
    navigate('/profile/orders');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
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
