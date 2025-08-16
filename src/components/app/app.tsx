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
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../../utils/ProtectedRoute';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='feed'>
          <Route index element={<Feed />} />
          <Route
            path=':number'
            element={
              <Modal
                title={'GET ORDER NUMBER'}
                onClose={function (): void {
                  throw new Error('Function not implemented.');
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Route>
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
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
                  <Modal
                    title={'GET ORDER NUMBER'}
                    onClose={function (): void {
                      throw new Error('Function not implemented.');
                    }}
                  >
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/ingredients/:id'
          element={
            <Modal
              title={'GET INGREDIENT DETAILS'}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
            >
              <IngredientDetails />
            </Modal>
          }
        />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
