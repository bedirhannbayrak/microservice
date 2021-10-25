import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Posts from './pages/Posts';
import ProdectedRoute from './pages/ProtectedRoute';

import './app.css';
import Navbar from './components/navbar/Navbar';
import CreatePost from './pages/CreatePost';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className='container'>
          <Switch>
            <Route exact path='/' component={Posts} />
            <Route exact path='/posts' component={Posts} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <ProdectedRoute path='/posts/add' component={CreatePost} />
            <Route path='*' component={() => <p>Not Found</p>} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
