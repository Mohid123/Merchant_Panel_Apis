export class CardInterface {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: number;
}
export interface StripeInterface {
  card: CardInterface;
  payment: string;
  description: string;
  userId: string;
  stripe: object;
}
