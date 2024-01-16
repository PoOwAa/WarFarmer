export interface WFMarketOrder {
  order_type: string;
  last_update: string;
  platform: string;
  user: {
    reputation: number;
    locale: string;
    avatar: string;
    ingame_name: string;
    last_seen: string;
    id: string;
    region: string;
    status: string;
  };
  quantity: number;
  creation_date: string;
  visible: boolean;
  platinum: number;
  id: string;
  region: string;
  mod_rank: number;
  realQuantity?: number;
  platinumPerPiece?: number;
}
