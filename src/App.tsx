import { useState } from 'react';
import './App.sass';

import { MapContainer } from './components/Map';
import { LoginContainer } from './components/Login';

function App() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="App">
      {showMap ? (
        <MapContainer id="map" qmsId={448} center={[104, 52]} zoom={3} />
      ) : (
        <LoginContainer onLogin={() => setShowMap(true)}></LoginContainer>
      )}
    </div>
  );
}

export default App;
