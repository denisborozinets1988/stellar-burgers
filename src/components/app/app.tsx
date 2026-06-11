import { ConstructorPage } from '@pages';
//import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { AppDispatch, RootState } from '../../services/store';
import {
  fetchIngredients,
  selectIsLoading,
  selectIngredients,
  selectError
} from '../../slices/ingredientsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { TIngredient } from '@utils-types';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  /** TODO: взять переменные из стора */
  const ingredients = useSelector<RootState, TIngredient[]>(selectIngredients);
  const isIngredientsLoading = useSelector<RootState, boolean>(selectIsLoading);
  const error = useSelector<RootState, string | null>(selectError);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path='/'
        element={
          <div className={styles.app}>
            <AppHeader />
            {isIngredientsLoading ? (
              <Preloader />
            ) : error ? (
              <div
                className={`${styles.error} text text_type_main-medium pt-4`}
              >
                {error}
              </div>
            ) : ingredients.length > 0 ? (
              <ConstructorPage />
            ) : (
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Нет игредиентов
              </div>
            )}
          </div>
        }
      />
    </Routes>
  );
};

export default App;
