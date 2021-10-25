import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { fetchRegister } from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setRegistered] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await fetchRegister({ username, password });
      setRegistered(true);
      console.log(user);
      history.push('/app');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='form'>
      <h2>Register</h2>
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
        <input type='submit' value='Register' />
        {isRegistered && <p>Kayıt Başarılı</p>}
      </form>
      <Link to='/login'>Login</Link>
    </div>
  );
};

export default Register;
