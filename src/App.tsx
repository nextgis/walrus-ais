import { useState } from 'react';
import './App.css';

import { MapContainer } from './Map';

function App() {
  const [showMap, setShowMap] = useState(false);

  const onShowMapClick = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="App">
      <button onClick={onShowMapClick}>ShowMap</button>
      {showMap && (
        <MapContainer
          id="map"
          qmsId={448}
          center={[104, 52]}
          zoom={3}
          baseUrl="https://demo.nextgis.com"
          resources={[{ resource: 4117, fit: true }]}
        />
      )}
    </div>
  );
}

export default App;
