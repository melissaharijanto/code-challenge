# Submission Details

This is made in regard to the assessment on this <a href="https://switcheo.notion.site/Problem-3-Messy-React-a6a8acd4eed744df8cc9b9d044478fba">link</a>.

### TOC

1. [Implementing the Datasource class](#implementing-the-datasource-class)
2. [Antipatterns, Computational Inefficiencies, Problems](#antipatterns-computational-inefficiencies-problems)

### Implementing the Datasource Class

From the root directory, (i.e. `code-challenge`), head over to []`src/problem3/wallet-balance-app/src/compiler/classes/Datasource.ts`](https://github.com/melissaharijanto/code-challenge/blob/master/src/problem3/wallet-balance-app/src/compiler/classes/Datasource.ts). From this directory (i.e. `wallet-balancing-app`), head over to []`src/compiler/classes/Datasource.ts`](https://github.com/melissaharijanto/code-challenge/blob/master/src/problem3/wallet-balance-app/src/compiler/classes/Datasource.ts).

Short explanation: 

* `getPrices()` returns a `Promise<PriceData>` instead of just `PriceData` to guarantee that the fetching and processing of the datasource is done before it is set to the variable `prices`.
* The constructor expects a link to fetch the data from the API, hence it takes in an `apiLink` string and fetches the json data from the link.

[Back to TOC](#toc)

### Antipatterns, Computational Inefficiencies, Problems

#### Assumptions

Note: These are made post-refactoring process.
1. `Props` interface is empty, but they should be representing the custom CSS to override properties of `BoxProps` from the MUI library.
2. Implementation for `useWalletBalances()` is not given, but it is a function that is omitted when the code is tested later on. Otherwise, I have tried testing it with mock data, i.e. `const balances = require('../data/wallet-balances.json')`. Because the implementation and return type for useWalletBalances() is omitted, the implementation for `sortedBalances`, `formattedBalances` are also omitted.
3. `WalletRow` component is not given for the same reason as 2. 
4. `classes` CSS class name is omitted from the skeleton.

#### Testing

1. Small testing has been conducted with mock data (`wallet-balances.json`) and mock components (`MockWalletRow.tsx`). 

#### Summary 

Please click on the hyperlinks to see the details/explanations of the problems.

1. [Original skeleton code omits types or uses `any` to bypass Typescript checks.](#1-original-skeleton-code-omits-types-or-uses-any-to-bypass-typescript-checks)
2. [`FormattedWalletBalance` is essentially the same as `WalletBalance`, with an extra `formatted` attribute.](#2-formattedwalletbalance-is-essentially-the-same-as-walletbalance-with-an-extra-formatted-attribute)
3. [The given `WalletBalance` expects a `blockchain` attribute, but it is not given in the skeleton code.](#3-the-given-walletbalance-expects-a-blockchain-attribute-but-it-is-not-given-in-the-skeleton-code)
4. [`formattedBalances` is never used in the skeleton code. ](#4-formattedbalances-is-never-used-in-the-skeleton-code)
5. [`rows` assumes that each balance `sortedBalances` is of type `FormattedWalletBalance`, when the implementation suggests that it is a sorted and filtered `WalletBalance` array.
](#5-rows-assumes-that-each-balance-sortedbalances-is-of-type-formattedwalletbalance-when-the-implementation-suggests-that-it-is-a-sorted-and-filtered-walletbalance-array)
6. [Minor bugs](#6-minor-bugs)

#### 1. **Original skeleton code omits types or uses `any` to bypass Typescript checks.**

This is considered bad practice because it is essentially mixing JavaScript and TypeScript together. Putting `any` in Typescript essentially tells the compiler to ignore the type checks, and makes the purpose of using Typescript pointless. Examples of this is shown in the code block below: 
```
    // should also state types in useState, 
    // e.g. useState<PriceData>({} as PriceData)
    const [prices, setPrices] = useState({}); 
    
    // the parameter blockchain is of type any
    const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

```

Solution: To overcome this problem, I have implemented a few custom types, the interface `PriceData` for `prices` and the union type `Blockchain | string` for `blockchain`. While union types may not have been the best practice, the `| string` is to account for the currencies that do not have a corresponding blockchain linked to it. The types can be seen in `src/compiler/interfaces/PriceData.ts` and `src/compiler/types/Blockchain.ts` and changes have been made in the `WalletPage component`.
    
[Back to Summary](#summary)

#### 2. **`FormattedWalletBalance` is essentially the same as `WalletBalance`, with an extra `formatted` attribute.**

This is more of a design issue, but we can make the interface `FormattedWalletBalance` extend `WalletBalance`. As such, all instances of `WalletBalance` in `WalletPage` can be replaced with `FormattedWalletBalance` instead, because we are displaying the formatted prices. We will be keeping the interface `WalletBalance` in case there are specific needs for this, when the `formatted` attribute is not needed and we only need to perform computational maths on the raw values of prices.

[Back to Summary](#summary)

#### 3. **The given `WalletBalance` expects a `blockchain` attribute, but it is not given in the skeleton code.**

Can be seen from the following block of code: 
```
const sortedBalances = useMemo(() => { ...
    return balances.filter((balance: WalletBalance) => {...})

        // here we see lhs and rhs is of type WalletBalance
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {

            // now it's calling lhs.blockchain and rhs.blockchain,
            // which does not exist in the WalletBalance skeleton code
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);

            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {                      
                return 1;
            }
        });
    }, [balances, prices]);
```

Solution: Added a `blockchain` attribute of type `Blockchain` to the `WalletBalance` interface.

[Back to Summary](#summary)

#### 4. `formattedBalances` is never used in the skeleton code. 

`formattedBalances` was not used in the skeleton code at all. This does not seem to align with the behavior of the code, and this problem seems to be connected with problem number 5. The variable `rows` seems like it should be using `formattedBalances.map(...)` instead of `sortedBalances.map(...)`.

In my solution, I have changed the behavior of `rows` to use `formattedBalances` instead of `sortedBalances`.

[Back to Summary](#summary)

#### 5. `rows` assumes that each balance `sortedBalances` is of type `FormattedWalletBalance`, when the implementation suggests that it is a sorted and filtered `WalletBalance` array.

`sortedBalances` in the skeleton code deals with `WalletBalance`, but it immediately assumes that the each balance in `sortedBalances` is a `FormattedWalletBalance` when declaring the const `rows`. The fix for this is the same as number 4.

If we want to keep `rows` to use `sortedBalances`, here is an alternative implementation that can be considered: 

```

// combine sortedBalances and formattedBalances into variable
const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (balancePriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  } else {
        return 0
      }
    }).map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  });
  }, [balances, prices]);

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
```

[Back to Summary](#summary)

#### 6. Minor bugs

- `console.err` in the `useEffect` hook should be `console.error`

```
useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices().then(prices => {
      setPrices(prices);
    }).catch(error => {

      // this line, should be console.error(error)
      console.err(error);
    });
  }, []);
```

- Comparator for `sort` returns `null` if `leftPriority === rightPriority`

```
const sortedBalances = useMemo(() => {
    return balances.filter(...)
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
	    const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);

                    
	    if (leftPriority > rightPriority) {
		return -1;
	    } else if (rightPriority > leftPriority) {
		return 1;
		}

        // no case for rightPriority === leftPriority. To solve
        // can just add an else case, i.e. else { return 0 }
    });
  }, [balances, prices]);
```

- `sortedBalances` introduces variables that have not been declared before in the same scope, i.e. `lhsPriority`

```
const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);

      // here, should be balancePriority instead
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}) ...
```

[Back to Summary](#summary)

