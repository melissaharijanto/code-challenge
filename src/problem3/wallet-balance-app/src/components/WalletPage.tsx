import { useEffect, useMemo, useState } from 'react';
import { Blockchain } from '../compiler/types/Blockchain';
import { PriceData } from '../compiler/interfaces/PriceData';
import { Datasource } from '../compiler/classes/Datasource';
import { Props } from '../compiler/interfaces/Props';
import { FormattedWalletBalance } from '../compiler/interfaces/FormattedWalletBalance';
// import WalletRow from './MockWalletRow';

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  // const balances : FormattedWalletBalance[] = require('../data/wallet-balances.json')
  const [prices, setPrices] = useState({} as PriceData);

  useEffect(() => {
    const datasource = new Datasource(
      'https://interview.switcheo.com/prices.json'
    );
    datasource
      .getPrices()
      .then((prices) => {
        setPrices(prices);
      })
      .catch((error : Error) => {
        console.error(error);
      });
  }, []);

  const getPriority = (blockchain: Blockchain | string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: FormattedWalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: FormattedWalletBalance, rhs: FormattedWalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        } else {
          return 0;
        }
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map(
    (balance: FormattedWalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      };
    }
  );

  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
  // return <div>{rows}</div>
};

export default WalletPage;
