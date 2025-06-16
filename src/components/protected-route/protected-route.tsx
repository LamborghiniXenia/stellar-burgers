import { Navigate, useLocation } from 'react-router-dom';
import {
  selectUserCheck, selectUser 
} from '@slices';
import { Preloader } from '@ui';
import { useAppSelector } from '@storage/hooks';
export type ProtectedRouteProps = {
  children: React.ReactNode;
  isPublic?: boolean;
};

export const ProtectedRoute = ({ children, isPublic }: ProtectedRouteProps) => {
  const userCheck = useAppSelector(selectUserCheck);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const from = location.state?.from || '/profile';
  if (!userCheck ) {
     return <Preloader />;
  }
  if (isPublic && user) {
    return <Navigate to={from} state={{ background: from?.state?.background}}/>;
  }
  if (!isPublic && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }
  return children;
};
