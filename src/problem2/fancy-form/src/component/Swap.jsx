import '../styles.css';
import { useEffect, useState } from 'react';
import CurrencyPicker from './CurrencyPicker';
import Header from './Header';

const Swap = ({ isSwapShown, setIsSwapShown }) => {
  const [selectedPaidToken, setSelectedPaidToken] = useState([
    'Select Token',
    null,
  ]);
  const [selectedReceivedToken, setSelectedReceivedToken] = useState([
    'Select Token',
    null,
  ]);

  const [paidMultiplier, setPaidMultiplier] = useState(-1);
  const [receivedMultiplier, setReceivedMultiplier] = useState(-1);

  const [showPaidTokenList, setShowPaidTokenList] = useState(false);
  const [showReceivedTokenList, setShowReceivedTokenList] = useState(false);

  const [paidValue, setPaidValue] = useState(-1);
  const [receivedValue, setReceivedValue] = useState(-1);
  const [percentage, setPercentage] = useState(-1);
  const [exchangeRate, setExchangeRate] = useState(-1);

  const SwitchCurrencies = () => {
    return (
      <div className="horizontal-flex">
        <hr width="30%" className="divider"></hr>
        <button className="rounded" onClick={swap}>
          <span className="white-text">&#129045;&#129047;</span>
        </button>
        <hr width="30%" className="divider"></hr>
      </div>
    );
  };

  const swap = () => {
    let currPaidToken = selectedPaidToken;
    let currReceivedToken = selectedReceivedToken;
    let currPaidMultiplier = paidMultiplier;
    let currReceivedMultiplier = receivedMultiplier;
    let currPaidValue = paidValue;
    let currReceivedValue = receivedValue;

    setSelectedPaidToken(currReceivedToken);
    setSelectedReceivedToken(currPaidToken);
    setPaidMultiplier(currReceivedMultiplier);
    setReceivedMultiplier(currPaidMultiplier);
    setPaidValue(currReceivedValue);
    setReceivedValue(currPaidValue);
    setExchangeRate(calculateExchangeRate());
  };

  const handlePaidValueChange = (e) => {
    e.preventDefault();
    setPaidValue(e.target.value);
    convertPaidToken(e.target.value);
  };

  const convertPaidToken = (paidValue) => {
    if (
      selectedReceivedToken[0] !== 'SelectToken' &&
      receivedMultiplier !== -1
    ) {
      let receivedTokens = (paidValue * paidMultiplier) / receivedMultiplier;
      setReceivedValue(receivedTokens);
      setPercentage(
        calculatePercentage(
          paidValue * paidMultiplier,
          receivedTokens * receivedMultiplier
        )
      );
    }
  };

  const handleReceivedValueChange = (e) => {
    e.preventDefault();
    setReceivedValue(e.target.value);
    convertReceivedToken(e.target.value);
  };

  const convertReceivedToken = (receivedValue) => {
    if (selectedPaidToken[0] !== 'Select Token' && paidMultiplier !== -1) {
      let paidTokens = (receivedValue * receivedMultiplier) / paidMultiplier;
      console.log(paidTokens);
      setPaidValue(paidTokens);
      setPercentage(
        calculatePercentage(
          paidTokens * paidMultiplier,
          receivedValue * receivedMultiplier
        )
      );
    }
  };

  const closePaidModal = () => {
    setShowPaidTokenList(false);
  };

  const closeReceivedModal = () => {
    setShowReceivedTokenList(false);
  };

  const calculatePercentage = (paid, received) => {
    return (((received - paid) / paid) * 100).toFixed(5);
  };

  const calculateExchangeRate = () => {
    return receivedMultiplier / paidMultiplier;
  };

  useEffect(() => {
    if (paidValue !== -1) {
      convertPaidToken(paidValue);
    }
  }, [selectedPaidToken]);

  useEffect(() => {
    if (receivedValue !== -1) {
      convertReceivedToken(receivedValue);
    }
  }, [selectedReceivedToken]);

  useEffect(() => {
    setExchangeRate(calculateExchangeRate());
  }, [receivedMultiplier, paidMultiplier]);

  return (
    <>
      {showPaidTokenList ? (
        <CurrencyPicker
          closeFn={closePaidModal}
          setMultiplierFn={setPaidMultiplier}
          setTokenFn={setSelectedPaidToken}
        />
      ) : null}
      {showReceivedTokenList ? (
        <CurrencyPicker
          closeFn={closeReceivedModal}
          setMultiplierFn={setReceivedMultiplier}
          setTokenFn={setSelectedReceivedToken}
        />
      ) : null}

      <div className="form">
        <Header isSwapShown={isSwapShown} setIsSwapShown={setIsSwapShown} />
        <div className="content-container">
          <div className="padded-container">
            <span className="text-90 subheading">You pay</span>
            <div className="input-container">
              <button
                className="currency"
                onClick={() => setShowPaidTokenList(true)}>
                <img
                  src={selectedPaidToken[1]}
                  className={selectedPaidToken[1] ? 'logo' : null}></img>
                {selectedPaidToken[0]}
              </button>
              <input
                className="input"
                placeholder="Enter a value here"
                value={paidValue === -1 ? '' : paidValue}
                onChange={handlePaidValueChange}
                type="number"
              />
            </div>
            <span className="text-90">
              {paidMultiplier === -1
                ? 'No token has been selected. Please select a token.'
                : paidValue === -1
                ? 'No value entered. Please enter a value.'
                : `Equivalent to $${paidValue * paidMultiplier}`}
            </span>
          </div>

          <SwitchCurrencies />
          <div className="padded-container last">
            <span className="text-90 subheading">You receive</span>
            <div className="input-container">
              <button
                className="currency"
                onClick={() => setShowReceivedTokenList(true)}>
                <img
                  src={selectedReceivedToken[1]}
                  className={selectedReceivedToken[1] ? 'logo' : null}></img>
                {selectedReceivedToken[0]}
              </button>
              <input
                className="input"
                type="number"
                placeholder="Enter a value here"
                value={receivedValue === -1 ? '' : receivedValue}
                onChange={handleReceivedValueChange}
              />
            </div>
            <span className="text-90">
              {receivedMultiplier === -1
                ? 'No token has been selected. Please select a token.'
                : receivedValue === -1
                ? 'No value entered. Please enter a value.'
                : `Equivalent to $${
                    receivedMultiplier * receivedValue
                  } (${percentage}%)`}
            </span>
          </div>
        </div>
        {selectedPaidToken[0] !== 'Select Token' &&
        selectedReceivedToken[0] !== 'Select Token' ? (
          <div className="exchange-rate-container exchange-rate">
            <span>Exchange Rate: 1</span>
            <img src={selectedPaidToken[1]} className="logo-exchange" />
            <span>
              {selectedPaidToken[0]} = {exchangeRate.toFixed(5)}{' '}
            </span>
            <img src={selectedReceivedToken[1]} className="logo-exchange" />
            <span>{selectedReceivedToken[0]}</span>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Swap;
