import { Navigate } from "react-router-dom";
import { useSelector } from "../../services/store";
import { selectIsLoggedIn } from "../../slices/loginSlice";

type ProtectedRouteProps = {
  children: React.ReactElement;
  onUnAuth?: boolean;
};

export const ProtectedRoute = ({ children, onUnAuth = false }: ProtectedRouteProps) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (isLoggedIn && onUnAuth) {
    return <Navigate to='/' />;
  }

  if (!isLoggedIn) {
    return <Navigate to='/login' />;
  }

  return children;
}
