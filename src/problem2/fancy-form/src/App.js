import './styles.css';
import Swap from './component/Swap';
import { useState } from 'react';
import Buy from './component/Buy';

function App() {
  const [showSwap, setShowSwap] = useState(true);
  const [connected, setConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState({
    name: "",
    image: ""
  });

  return (
    <div className="root">
      {showSwap ? (
        <Swap isSwapShown={showSwap} setIsSwapShown={setShowSwap} />
      ) : (
        <Buy
          connected={connected}
          setConnected={setConnected}
          isSwapShown={showSwap}
          setIsSwapShown={setShowSwap}
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
        />
      )}
    </div>
  );
}

export default App;
