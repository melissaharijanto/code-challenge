import { useEffect, useState } from 'react';
import Close from '../resources/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BuyModal = ({ token, closeFn, clearToken }) => {
  const [tokenAmount, setTokenAmount] = useState(0);
  const [priceInUsd, setPriceInUsd] = useState(0);
  const [purchased, setPurchased] = useState(false);
  const [noTokensPurchasedMessage, setNoTokensPurchasedMessage] =
    useState(false);

  const cancel = () => {
    clearToken();
    closeFn(false);
  };

  const purchase = () => {
    if (tokenAmount > 0) {
      setPurchased(true);
      setTimeout(() => clearToken(), 1500);
      setTimeout(() => closeFn(false), 1500);
    } else {
      setNoTokensPurchasedMessage(true);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setTokenAmount(e.target.value);
    calculatePriceInUsd(e.target.value);
  };

  const calculatePriceInUsd = (amount) => {
    setPriceInUsd(amount * token[2]);
  };

  useEffect(() => {
    if (tokenAmount > 0) {
      setNoTokensPurchasedMessage(false);
    }
  }, [tokenAmount]);

  return (
    <div className="blurred-background">
      <div className="modal horizontal-flex flex-centered">
        <div className="column-flex">
          <div className="space-between-flex">
            <div />
            <div className="clickable" onClick={cancel}>
              <Close />
            </div>
          </div>
          <div className="margin-top-20" />
          <div className="header horizontal-flex flex-centered">
            <span>You have selected</span>
            <img src={token[1]} className="logo margin-left-5" alt={token[0]} />
            <span>{token[0]} tokens.</span>
          </div>
          <div className="column-flex flex-centered margin-top-20">
            <span className="text-90">Tokens to buy: </span>
            <input
              className="input margin-top-10"
              type="number"
              onChange={handleChange}
              value={tokenAmount}
              min="0"
            />

            <span className="text-90 margin-top-10">
              Price (in USD): ${priceInUsd}
            </span>
            <span className="text-90 margin-top-5">
              1 {token[0]} = {token[2]} USD
            </span>

            <div className="margin-top-20 column-flex">
              {purchased ? (
                <button className="connected-button connected-wallet horizontal-flex">
                  <CheckCircleIcon sx={{ mr: 0.75, width: '20px' }} />
                  Purchase Successful
                </button>
              ) : (
                <button
                  className="connected-button unconnected-wallet"
                  onClick={purchase}>
                  Buy
                </button>
              )}
              {noTokensPurchasedMessage ? (
                <span className="text-90 margin-top-10">
                  Tokens to buy must be more than 0.
                </span>
              ) : null}
              <div className="padding-5" />
              <div className="padding-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
