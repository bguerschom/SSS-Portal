import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLoginSuccess = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <WelcomePage username={username} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;