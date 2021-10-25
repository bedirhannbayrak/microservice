import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    (() => {
      let loggedIn = localStorage.getItem('isLoggedIn');
      loggedIn = JSON.parse(loggedIn);
      if (loggedIn) {
        let user = JSON.parse(localStorage.getItem('user'));
        setLoggedIn(loggedIn);
        setUser(user);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    })();
  }, []);

  useEffect(() => {
    setSocket(io('http://localhost:5000'));
  }, []);

  useEffect(() => {
    if (user != null && socket) {
      setSocketId(socket.id);
    }
  }, [socket, user]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', loggedIn);
  }, [loggedIn, user]);

  const login = (user) => {
    user = { ...user, id: user.id + '' };
    setUser(user);
    setLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  };

  const values = {
    user,
    setUser,
    loggedIn,
    setLoggedIn,
    login,
    logout,
    socket,
    socketId,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
