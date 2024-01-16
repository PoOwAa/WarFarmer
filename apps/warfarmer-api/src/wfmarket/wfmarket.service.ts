import { Injectable } from '@nestjs/common';

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
}
