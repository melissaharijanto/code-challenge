import { Blockchain } from "../types/Blockchain";

export interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}
