import { ConstructorPage } from '@pages';
//import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal } from '@components';
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
import { Children, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const ingredients = useSelector<RootState, TIngredient[]>(selectIngredients);
  const isIngredientsLoading = useSelector<RootState, boolean>(selectIsLoading);
  const error = useSelector<RootState, string | null>(selectError);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      <Routes location={background ?? location}>
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
        <Route
          path={'/ingredients/:id'}
          element={
            <div className={styles.app}>
              <AppHeader />
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Детали ингредиента
              </div>
              <div className={`${styles.title}`}>
                <IngredientDetails />
              </div>
            </div>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path={'/ingredients/:id'}
            element={
              <Modal title={'Детали ингредиента'} onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
