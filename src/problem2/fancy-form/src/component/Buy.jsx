import Header from './Header';
import { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Search from '../resources/Search';
import { imgLink } from './CurrencyPicker';
import BuyModal from './BuyModal';

const Buy = ({
  connected,
  setConnected,
  isSwapShown,
  setIsSwapShown,
  selectedWallet,
  setSelectedWallet,
}) => {
  let wallet = require('../data/wallet.json');

  const [showChooseWalletMessage, setShowChooseWalletMessage] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyToken, setBuyToken] = useState(['', '', '']);

  const clearToken = () => {
    setBuyToken(['', '', '']);
  };

  const UnconnectedComponent = () => {
    return (
      <div className="main-purchase-layout unconnected">
        <span className="header margin-right-0 margin-bottom-20 text-center">
          Select your wallet and click 'Connect Wallet' to start purchasing.
        </span>
        <div className="icon-grid">
          {wallet.map((item) => (
            <Icon item={item} />
          ))}
        </div>
        <ConnectWalletButton />
        <span className="text-90 margin-top-10">
          {showChooseWalletMessage
            ? 'Please choose a wallet to connect to.'
            : null}
        </span>
      </div>
    );
  };

  const Icon = ({ item }) => {
    return (
      <div className="icon-div" onClick={() => setSelectedWallet(item)}>
        <img
          src={item.image}
          className={`icon clickable ${
            item.name === selectedWallet.name ? 'border-icon' : ''
          }`}
          alt={item.name}
        />
        <span className="icon-text">{item.name}</span>
      </div>
    );
  };

  const Cart = () => {
    let data = require('../data/data.json');
    const [searchInput, setSearchInput] = useState('');

    const Token = ({ item, onClick }) => {
      return (
        <button className="label" onClick={onClick}>
          <div className="space-between-flex">
            <div className="vertical-center-flex">
              <img
                src={imgLink(item.currency)}
                className="logo"
                alt={item.currency}
              />
              <span className="currency-label">{item.currency}</span>
            </div>
            <div>
              <span className="currency-label">${item.price}</span>
            </div>
          </div>
        </button>
      );
    };

    const buy = (name, image, price) => {
      setBuyToken([name, image, price]);
    };

    const handleChange = (e) => {
      e.preventDefault();
      setSearchInput(e.target.value);
    };

    const filterData = () => {
      if (searchInput.length > 0) {
        return data.filter((data) => {
          return data.currency.toLowerCase().match(searchInput.toLowerCase());
        });
      } else {
        return data;
      }
    };

    useEffect(() => {
      filterData();
    }, [searchInput]);

    useEffect(() => {
      if (buyToken[0] !== '' && buyToken[1] !== '') {
        setShowBuyModal(true);
      }
    }, [buyToken]);

    return (
      <>
        <div className="margin-top-20 search-bar-div">
          <div className="padding-5">
            <Search className="search-logo" />
          </div>
          <input
            className="search-bar"
            placeholder="Search for tokens here"
            onChange={handleChange}
          />
        </div>
        <div className="horizontal-flex margin-top-10">
          {filterData(data).map((item) => (
            <Token
              item={item}
              onClick={() =>
                buy(item.currency, imgLink(item.currency), item.price)
              }
            />
          ))}
        </div>
      </>
    );
  };

  const disconnect = () => {
    setConnected(false);
    setSelectedWallet({
      name: '',
      image: '',
    });
  };

  const ConnectedComponent = () => {
    return (
      <div className="horizontal-flex margin-top-10">
        <img
          src={selectedWallet.image}
          className="icon-connected"
          alt={selectedWallet.name}></img>
        <div className="column-flex">
          <div className="horizontal-flex margin-top-10-mobile">
            <CheckCircleIcon
              sx={{ width: '1em', mr: 1, ml: 2, color: '#dbbffe' }}
            />
            <span className="regular-text">
              You are connected to{' '}
              <span className="purple-bold">{selectedWallet.name}</span>.
            </span>
          </div>
          <button
            className="disconnect-hover disconnect-button margin-top-10"
            onClick={disconnect}>
            Disconnect
          </button>
        </div>
      </div>
    );
  };

  const connectButtonFunction = () => {
    let walletNotSelected = selectedWallet.name === '';
    if (walletNotSelected) {
      setShowChooseWalletMessage(true);
    } else {
      setConnected(true);
    }
  };

  const ConnectWalletButton = () => {
    return (
      <>
        <button
          className="unconnected-wallet connected-button"
          onClick={connectButtonFunction}>
          Connect Wallet
        </button>
      </>
    );
  };

  return (
    <>
      {showBuyModal ? (
        <BuyModal
          token={buyToken}
          closeFn={setShowBuyModal}
          clearToken={clearToken}
        />
      ) : null}
      <div className="form">
        <Header isSwapShown={isSwapShown} setIsSwapShown={setIsSwapShown} />
        {connected ? <ConnectedComponent /> : <UnconnectedComponent />}
        {connected ? <Cart /> : null}
      </div>
    </>
  );
};

export default Buy;
