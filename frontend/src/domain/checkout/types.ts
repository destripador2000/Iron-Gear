export interface ShippingData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface CardData {
  number: string;
  expiry: string;
  cvv: string;
}

export type PaymentMethod = 'tarjeta' | 'paypal';

export interface CheckoutState {
  shipping: ShippingData;
  paymentMethod: PaymentMethod;
  cardData: CardData;
}

export const initialShippingData: ShippingData = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
};

export const initialCardData: CardData = {
  number: '',
  expiry: '',
  cvv: '',
};

export const initialCheckoutState: CheckoutState = {
  shipping: initialShippingData,
  paymentMethod: 'tarjeta',
  cardData: initialCardData,
};