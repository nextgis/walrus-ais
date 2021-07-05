import './App.sass';

import { useState } from 'react';
import { useCookies } from 'react-cookie';

import { MapContainer } from './NgwMap/Map';
import { LoginContainer } from './components/Login';
import { RMBR_KEY } from './constants';
import { LogoutMapBtnControl } from './components/LogoutMapBtnControl';
import { useEffect } from 'react';

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
        <MapContainer id="map" qmsId={448} center={[104, 52]} zoom={3}>
          <LogoutMapBtnControl onClick={logout} />
        </MapContainer>
      ) : (
        <LoginContainer onLogin={() => setShowMap(true)}></LoginContainer>
      )}
    </div>
  );
}

export default App;
