import './App.sass';

import { useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { LoginContainer } from './views/Login';
import { RMBR_KEY } from './constants';
import { useEffect } from 'react';
import { WalrusMap } from './views/WalrusMap';

function App() {
  const [showMap, setShowMap] = useState(false);
  const [cookies, setCookies] = useCookies([RMBR_KEY]);

  useEffect(() => {
    if (!cookies[RMBR_KEY]) {
      setShowMap(false);
    }
  }, [cookies]);

  const logout = useCallback(() => {
    setCookies(RMBR_KEY, '');
  }, []);

  return (
    <div className="App">
      {showMap ? (
        <WalrusMap onLogout={logout}></WalrusMap>
      ) : (
        <LoginContainer onLogin={() => setShowMap(true)}></LoginContainer>
      )}
    </div>
  );
}

export default App;
