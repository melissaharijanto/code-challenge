// import { Currency } from '../interfaces/Currency';
// import { PriceData } from '../interfaces/PriceData';

import { Currency } from '../interfaces/Currency';
import { PriceData } from '../interfaces/PriceData';

export class Datasource {
  datasource: Currency[] = [];
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getPrices(): Promise<PriceData> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const data = await response.json();

    this.datasource = data;

    // Convert the data into a dictionary with currency codes as keys and prices as values
    const prices: PriceData = {};
    data.forEach((item: Currency) => {
      prices[item.currency] = item.price;
    });

    return prices;
  }
}
