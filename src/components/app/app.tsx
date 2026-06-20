import {
  ConstructorPage,
  ForgotPassword,
  Login,
  Register,
  ResetPassword
} from '@pages';
//import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal } from '@components';
import { Preloader } from '@ui';
import { AppDispatch, RootState } from '../../services/store';
import {
  fetchIngredients,
  selectIngredientsIsLoading,
  selectIngredients,
  selectIngredientsError
} from '../../slices/ingredientsSlice';
import {
  selectUser,
  selectUserIsRequested,
  selectUserError,
  selectIsSuccessRegistrarion
} from '../../slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { TIngredient, TUser } from '@utils-types';
import { Children, useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { RedirectIfAuthenticated } from '../redirect-if-authenticated';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const ingredients = useSelector<RootState, TIngredient[]>(selectIngredients);
  const isIngredientsLoading = useSelector<RootState, boolean>(
    selectIngredientsIsLoading
  );
  const isSuccessRegistrarion = useSelector<RootState, boolean>(
    selectIsSuccessRegistrarion
  );
  const ingredientsLoadingError = useSelector<RootState, string | null>(
    selectIngredientsError
  );
  const user = useSelector<RootState, TUser | null>(selectUser);
  const userName = user?.name ?? 'Личный кабинет';
  const userIsRequested = useSelector<RootState, boolean>(
    selectUserIsRequested
  );
  const userError = useSelector<RootState, string | null>(selectUserError);
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
              <AppHeader userName={userName} />
              {isIngredientsLoading ? (
                <Preloader />
              ) : ingredientsLoadingError ? (
                <div
                  className={`${styles.error} text text_type_main-medium pt-4`}
                >
                  {ingredientsLoadingError}
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
              <AppHeader userName={userName} />
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
        <Route
          path={'/login'}
          element={
            <div className={styles.app}>
              <AppHeader userName={userName} />
              {isSuccessRegistrarion && (
                <div
                  className={`${styles.title} text text_type_main-medium pt-4`}
                >
                  Вы успешно зарегистрировались! Выполните вход.
                </div>
              )}
              {userIsRequested ? (
                <Preloader />
              ) : userError ? (
                <>
                  <div
                    className={`${styles.error} text text_type_main-medium pt-4`}
                  >
                    {userError}
                  </div>
                  <RedirectIfAuthenticated>
                    <Login />
                  </RedirectIfAuthenticated>
                </>
              ) : user ? (
                <Navigate to='/' replace />
              ) : (
                <RedirectIfAuthenticated>
                  <Login />
                </RedirectIfAuthenticated>
              )}
            </div>
          }
        />
        <Route
          path={'/register'}
          element={
            <div className={styles.app}>
              <AppHeader userName={userName} />
              {userIsRequested ? (
                <Preloader />
              ) : userError ? (
                <>
                  <div
                    className={`${styles.error} text text_type_main-medium pt-4`}
                  >
                    {userError}
                  </div>
                  <RedirectIfAuthenticated>
                    <Register />
                  </RedirectIfAuthenticated>
                </>
              ) : isSuccessRegistrarion ? (
                <Navigate to='/login' replace />
              ) : (
                <RedirectIfAuthenticated>
                  <Register />
                </RedirectIfAuthenticated>
              )}
            </div>
          }
        />
        <Route
          path={'/forgot-password'}
          element={
            <div className={styles.app}>
              <AppHeader userName={userName} />
              <RedirectIfAuthenticated>
                <ForgotPassword />
              </RedirectIfAuthenticated>
            </div>
          }
        />
        <Route
          path={'/reset-password'}
          element={
            <div className={styles.app}>
              <AppHeader userName={userName} />
              <RedirectIfAuthenticated>
                <ResetPassword />
              </RedirectIfAuthenticated>
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
