import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchLogin } from '../api';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loggedIn, login } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      history.push('/posts');
    }
  }, [loggedIn, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await fetchLogin({ username, password });
    if (user.status !== 'fail') {
      login(user);
    } else {
      setError('Bilgilerinizi kontrol ediniz');
    }
  };

  return (
    <div className='form'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            onChange={(e) => setUsername(e.target.value)}
            name='username'
            type='text'
          />
        </label>
        <label>
          Password
          <input
            onChange={(e) => setPassword(e.target.value)}
            name='password'
            type='password'
          />
        </label>
        <input type='submit' value='Login' />
        {error && <p>{error}</p>}
      </form>
      <Link to='/register'>Register</Link>
    </div>
  );
};

export default Login;
