import './App.sass';

import { useState } from 'react';
import { useCookies } from 'react-cookie';

import { LoginContainer } from './components/Login';
import { RMBR_KEY } from './constants';
import { useEffect } from 'react';
import { WalrusMap } from './components/WalrusMap';

function App() {
  const [showMap, setShowMap] = useState(false);
  const [cookies, setCookies] = useCookies([RMBR_KEY]);

  const logout = () => {
    setCookies(RMBR_KEY, '');
  };
  useEffect(() => {
    if (!cookies[RMBR_KEY]) {
      setShowMap(false);
    }
  }, [cookies]);

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
