import { useEffect } from 'react';
import { useHistory } from 'react-router';
const Unauthorized = () => {
  const history = useHistory();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      history.push('/login');
    }, 500);
    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [history]);
  return (
    <div className='unauthorized'>
      <h1>Unauthorized Location</h1>
      <p> You are redirecting...</p>
    </div>
  );
};

export default Unauthorized;
