import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { registerUserApi } from '@api';
import { useLocation, useNavigate } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    registerUserApi({ name: userName, email, password })
      .then(({ refreshToken, accessToken, user }) => {
        localStorage.setItem('refreshToken', refreshToken);
        setCookie('accessToken', accessToken);
        location.state?.from ? navigate(location.state.from) : navigate('/');
      })
      .catch((err) => {
        setErrorText(err.message);
      });
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
