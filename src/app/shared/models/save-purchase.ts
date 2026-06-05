export interface SavePurchaseDto {
  total: number;
  products: { id: string; quantity: number }[];
  userId?: number;
  giftCardDiscount?: number;
}
