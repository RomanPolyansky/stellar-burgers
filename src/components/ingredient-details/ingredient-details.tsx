import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  getIngredients,
  selectIngredientById
} from '../../slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const ingredientId = params.id;
  const ingredientData = useSelector((state) =>
    selectIngredientById(state, ingredientId)
  );

  useEffect(() => {
    dispatch(getIngredients());
  }, []);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
