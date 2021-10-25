import { Route } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import Unauthorized from './Unauthorized';
const ProdectedRoute = ({ component: Component, ...rest }) => {
  const { loggedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loggedIn) {
          return <Component {...props} />;
        }
        return <Unauthorized />;
      }}
    />
  );
};

export default ProdectedRoute;
