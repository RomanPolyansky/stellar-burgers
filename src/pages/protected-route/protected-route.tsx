import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "../../services/store";
import { selectIsAuthChecked, selectIsLoggedIn } from "../../slices/loginSlice";
import { Preloader } from "@ui";

type ProtectedRouteProps = {
  children: React.ReactElement;
  onUnAuth?: boolean;
};

export const ProtectedRoute = ({ children, onUnAuth = false }: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();

  // пока идет чек на авторизацию
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // для авторизованных пользователей
  if (!onUnAuth && !isLoggedIn) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // для авторизованных пользователей
  if (!isAuthChecked && onUnAuth) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onUnAuth && isLoggedIn) {
      // для неавторизованного и авторизован
      const { from } = location.state ?? { from: { pathname: "/" } };
      return <Navigate to={from} />;
  }

  return children;
}
