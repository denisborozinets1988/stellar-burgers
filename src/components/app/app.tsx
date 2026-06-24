import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
//import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  FeedInfo,
  IngredientDetails,
  Modal,
  OrderInfo,
  OrdersList,
  ProfileMenu
} from '@components';
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
  selectIsSuccessRegistrarion,
  selectIsAuthChecked,
  getUser
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
  const isAuthChecked = useSelector<RootState, boolean>(selectIsAuthChecked);
  const ingredientsLoadingError = useSelector<RootState, string | null>(
    selectIngredientsError
  );
  const user = useSelector<RootState, TUser | null>(selectUser);
  const userName = user?.name;
  const userIsRequested = useSelector<RootState, boolean>(
    selectUserIsRequested
  );
  const userError = useSelector<RootState, string | null>(selectUserError);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchIngredients());
    if (!isAuthChecked && !userIsRequested) {
      dispatch(getUser());
    }
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
                  <Login />
                </>
              ) : user ? (
                <Navigate to='/' replace />
              ) : (
                <>
                  <Login />
                  {user + '!'}
                </>
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
                  <Register />
                </>
              ) : isSuccessRegistrarion ? (
                <Navigate to='/login' replace />
              ) : user ? (
                <Navigate to='/' replace />
              ) : (
                <>
                  <Register />
                  {user + '!'}
                </>
              )}
            </div>
          }
        />
        <Route
          path={'/profile'}
          element={
            <div className={styles.app}>
              <AppHeader userName={userName} />
              {user ? (
                <>
                  <Profile />
                </>
              ) : (
                <Navigate to='/login' replace />
              )}
            </div>
          }
        />
        <Route
          path={'/forgot-password'}
          element={
            <div className={styles.app}>
              <AppHeader userName={userName} />
              <ForgotPassword />
            </div>
          }
        />
        <Route
          path={'/reset-password'}
          element={
            <div className={styles.app}>
              <AppHeader userName={userName} />
              <ResetPassword />
            </div>
          }
        />
        <Route
          path={'/feed'}
          element={
            <div className={styles.app}>
              <AppHeader userName={userName} />
              <Feed />
            </div>
          }
        />{' '}
        <Route
          path={'/feed/:id'}
          element={
            <div className={styles.app}>
              <AppHeader userName={userName} />
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Детали заказа
              </div>
              <div className={`${styles.title}`}>
                <OrderInfo />
              </div>
            </div>
          }
        />
        <Route
          path={'/profile/orders'}
          element={
            user ? (
              <div className={styles.app}>
                <AppHeader userName={userName} />
                <ProfileOrders />
              </div>
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path={'/profile/orders/:id'}
          element={
            user ? (
              <div className={styles.app}>
                <AppHeader userName={userName} />
                <div
                  className={`${styles.title} text text_type_main-medium pt-4`}
                >
                  Детали заказа
                </div>
                <div className={`${styles.title}`}>
                  <OrderInfo />
                </div>
              </div>
            ) : (
              <Navigate to='/login' replace />
            )
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
          <Route
            path={'/feed/:id'}
            element={
              <Modal title={'Детали заказа'} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path={'/profile/orders/:id'}
            element={
              <Modal title={'Детали заказа'} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
