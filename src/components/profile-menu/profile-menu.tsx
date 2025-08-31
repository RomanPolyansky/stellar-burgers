import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutApi } from '@api';
import { logout } from '../../slices/loginSlice';
import { useDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout())
      .then(() => navigate('/login'))
      .catch((error) => {
        // Handle error
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
