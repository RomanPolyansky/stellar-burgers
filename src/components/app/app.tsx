import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../../pages/protected-route/protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { selectOpenOrder } from '../../slices/orderSlice';
import { useEffect, useRef } from 'react';
import { getUserInfo } from '../../slices/loginSlice';
import { getIngredients } from '../../slices/ingredientsSlice';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const background = location.state?.background;

  const openOrder = useSelector(selectOpenOrder);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    dispatch(getUserInfo());
    dispatch(getIngredients());

    hasRun.current = true;
  });

  const closeModal = () => {
    if (location.state && location.state.background) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed'>
          <Route index element={<Feed />} />
          <Route path=':id' element={<OrderInfo />} />
        </Route>
        <Route
          path='/login'
          element={
            <ProtectedRoute onUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route path='/profile'>
          <Route
            index
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path='orders'>
            <Route
              index
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path=':number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      <Routes>
        {background && (
          <Route
            path='/feed/:id'
            element={
              <Modal
                title={openOrder ? `#${openOrder.number}` : 'Загрузка...'}
                onClose={closeModal}
              >
                <OrderInfo />
              </Modal>
            }
          />
        )}
        {background && (
          <Route
            path='/profile/orders/:id'
            element={
              <ProtectedRoute>
                <Modal
                  title={
                    openOrder
                      ? `#${openOrder.number.toString()}`
                      : 'Загрузка...'
                  }
                  onClose={closeModal}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        )}
        {background && (
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
        )}
      </Routes>
    </div>
  );
};

export default App;
