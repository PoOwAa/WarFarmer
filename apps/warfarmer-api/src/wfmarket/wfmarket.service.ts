import { Injectable } from '@nestjs/common';
import { WFMarketOrder } from './wfmarket.types';

@Injectable()
export class WfmarketService {
  private readonly baseUrl: string = 'https://api.warframe.market/v1';
  private readonly token: string = 'WarFarmerToken'; // Can use literally any string here

  async items() {
    const response = await fetch(`${this.baseUrl}/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${this.token}`,
      },
    });

    const data = await response.json();

    return data.payload.items;
  }

  async item(item: string) {
    const response = await fetch(`${this.baseUrl}/items/${item}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${this.token}`,
      },
    });

    const data = await response.json();

    return data;
  }

  async orders(
    item: string,
    includeItem: boolean = false,
    platform: string = 'pc'
  ): Promise<WFMarketOrder[]> {
    const apiEndpoint = `${this.baseUrl}/items/${item}/orders`;
    const urlWithItem = `${apiEndpoint}?include=item`;

    const url = includeItem ? urlWithItem : apiEndpoint;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${this.token}`,
        Platform: platform,
      },
    });

    const data = await response.json();

    if (!data.payload) {
      return [];
    }

    return data.payload.orders;
  }
}
