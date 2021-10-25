import { useEffect, useState } from 'react';
import './navbar.css';
import Notification from '../../img/notification.svg';
import Logout from '../../img/logout.svg';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const { loggedIn, socket, logout } = useAuth();

  useEffect(() => {
    socket?.on('getNotification', (data) => {
      console.log(data);
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  const displayNotification = (data, idx) => {
    return (
      <span key={idx} className='notification'>
        {data.description}
      </span>
    );
  };

  const handleRead = () => {
    setNotifications([]);
    setOpen(false);
  };

  return (
    <div className='navbar'>
      <div>
        <Link to='/' className='logo'>
          Lama App
        </Link>
        <Link to='/posts' className='logo'>
          Posts
        </Link>
        {loggedIn && (
          <Link to='/posts/add' className='logo'>
            Create Post
          </Link>
        )}
      </div>

      <div className='icons'>
        <div className='icon' onClick={() => setOpen(!open)}>
          <img src={Notification} className='iconImg' alt='' />
          {notifications.length > 0 && (
            <div className='counter'>{notifications.length}</div>
          )}
        </div>
        <div className='icon' onClick={logout}>
          <img src={Logout} className='iconImg' alt='' />
        </div>
      </div>
      {open && (
        <div className='notifications'>
          {notifications.map((data, idx) => displayNotification(data, idx))}
          <button className='read-btn' onClick={handleRead}>
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
