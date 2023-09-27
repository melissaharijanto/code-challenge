import { useEffect, useState } from 'react';
import Close from '../resources/Close';
import Search from '../resources/Search';
import '../styles.css';
import CustomLoader from './CustomLoader';

export const imgLink = (currency) => {
  if (currency === 'STATOM') {
    currency = 'stATOM';
  } else if (currency === 'RATOM') {
    currency = 'rATOM';
  } else if (currency === 'STLUNA') {
    currency = 'stLUNA';
  } else if (currency === 'STOSMO') {
    currency = 'stOSMO';
  } else if (currency === 'STEVMOS') {
    currency = 'stEVMOS';
  }
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`;
};

const Label = ({ item, onClick }) => {
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

const CurrencyPicker = ({ closeFn, setTokenFn, setMultiplierFn }) => {
  let data = require('../data/data.json');

  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

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

  const selectToken = (currency, price) => {
    setTokenFn([currency, imgLink(currency)]);
    setMultiplierFn(price);
    closeFn();
  };

  useEffect(() => {
    filterData();
  }, [searchInput]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="blurred-background">
      <div className="modal">
        <div className="vertical-flex">
          <span className="header">Select a token</span>
          <div onClick={closeFn} className="clickable">
            <Close />
          </div>
        </div>
        <div>
          <div className="margin-10 search-bar-div">
            <div className="padding-5">
              <Search className="search-logo" />
            </div>
            <input
              className="search-bar"
              placeholder="Search for tokens here"
              onChange={handleChange}
            />
          </div>
          {loading ? (
            <CustomLoader mt={3} />
          ) : (
            <div className="horizontal-flex">
              {filterData(data).map((item) => (
                <Label
                  item={item}
                  key={item.id}
                  onClick={() => selectToken(item.currency, item.price)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyPicker;
