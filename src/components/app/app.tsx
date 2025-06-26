import '../../index.css';
import styles from './app.module.css';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
  ConstructorPage
} from '@pages';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { getUser, getIngredients, getOrder } from '@thunk';
import { useEffect } from 'react';
import { selectIngredients, selectOrder, setUserCheck } from '@slices';
import { useAppDispatch, useAppSelector } from '@storage/hooks';
import { AppDispatch } from '@store';
import { INGREDIENT_DETAILS_TITLE } from '@utils/constants';
import { TOrder } from '@utils/types';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();

  const orderData: TOrder | null = useAppSelector(selectOrder);
  const ingredientsLoaded: boolean = useAppSelector(selectIngredients).length > 0;
  // Функция для закрытия модального окна
  const handleModalClose = () => {
    navigate(-1);
  };
  
  useEffect(() => { 
    dispatch(getUser())
      .unwrap()
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch(setUserCheck());
      });

      if (!ingredientsLoaded) {
        dispatch(getIngredients())
      }
      }, [dispatch, ingredientsLoaded]);

  useEffect(() => {
    const path = location.pathname.split('/');
    const numberIndex = path.indexOf('feed') + 1 || path.indexOf('orders') + 1;
    const orderNumber = numberIndex > 0 ? path[numberIndex]: null;

    if (orderNumber &&(!orderData || orderData.number !== parseInt(orderNumber))) {
      dispatch(getOrder(parseInt(orderNumber)))
      .unwrap()
      .catch((error) => {
        console.log(error);
      })
    }

  }, [location.pathname, dispatch, orderData])

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage/>} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<ProtectedRoute isPublic><Login /></ProtectedRoute>}/>
        <Route path='/register' element={<ProtectedRoute isPublic><Register/></ProtectedRoute>}/>
        <Route path='/forgot-password' element={<ProtectedRoute isPublic><ForgotPassword /></ProtectedRoute>}/>
        <Route path='/reset-password' element={<ProtectedRoute isPublic><ResetPassword /></ProtectedRoute>}/>
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route path='/profile/orders' element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>}/>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/feed/:number' element={<OrderInfo isModalContext={false} />}/>
        <Route path='/ingredients/:id' element={<IngredientDetails isModalContext={false} />}/>
        <Route path='/profile/orders/:number' element={<ProtectedRoute><OrderInfo isModalContext={false}/></ProtectedRoute>}/>
      </Routes>

      {background && (
        <Routes>
          <Route path='/feed/:number' element={<Modal title={orderData ? `#${orderData.number}` : ''} onClose={handleModalClose}><OrderInfo isModalContext /></Modal>}/>
          <Route path='/ingredients/:id' element={<Modal title={INGREDIENT_DETAILS_TITLE} onClose={handleModalClose}><IngredientDetails isModalContext/></Modal>}/>
          <Route path='/profile/orders/:number' element={<ProtectedRoute><Modal title={orderData ? `#${orderData.number}` : ''} onClose={handleModalClose}><OrderInfo isModalContext /></Modal></ProtectedRoute>}/>
        </Routes>
      )}
    </div>
  );
};

export default App;
