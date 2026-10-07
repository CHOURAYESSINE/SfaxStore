import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map, throwError } from 'rxjs';
import {
  GiftCard,
  PurchasedGiftCard,
  GiftCardPurchaseForm,
  GiftCardCategory,
} from '../../shared/models/gift-card';

@Injectable({
  providedIn: 'root',
})
export class GiftCardService {
  private purchasedCardsSubject = new BehaviorSubject<PurchasedGiftCard[]>([]);
  purchasedCards$ = this.purchasedCardsSubject.asObservable();

  private readonly giftCards: GiftCard[] = [
    {
      id: 'gc-general-1',
      name: 'Classic Gift Card',
      description: 'The perfect gift for any occasion. Let them choose what they love!',
      image: '/svg/gift-card-classic.svg',
      category: 'general',
      availableAmounts: [25, 50, 100, 150, 200],
      customAmountRange: { min: 10, max: 500 },
      backgroundColor: 'from-amber-400 to-orange-500',
      accentColor: 'amber',
    },
    {
      id: 'gc-birthday-1',
      name: 'Birthday Celebration',
      description: 'Make their birthday extra special with a gift they can use however they want.',
      image: '/svg/gift-card-birthday.svg',
      category: 'birthday',
      availableAmounts: [25, 50, 100, 200],
      backgroundColor: 'from-pink-400 to-purple-500',
      accentColor: 'pink',
    },
    {
      id: 'gc-holiday-1',
      name: 'Holiday Cheer',
      description: 'Spread holiday joy with a gift card perfect for the festive season.',
      image: '/svg/gift-card-holiday.svg',
      category: 'holiday',
      availableAmounts: [50, 100, 150, 250],
      backgroundColor: 'from-red-500 to-green-600',
      accentColor: 'red',
    },
    {
      id: 'gc-thankyou-1',
      name: 'Thank You',
      description: 'Show your appreciation with a thoughtful gift card.',
      image: '/svg/gift-card-thankyou.svg',
      category: 'thank-you',
      availableAmounts: [25, 50, 75, 100],
      backgroundColor: 'from-teal-400 to-cyan-500',
      accentColor: 'teal',
    },
    {
      id: 'gc-congrats-1',
      name: 'Congratulations!',
      description: 'Celebrate their achievements with a special gift.',
      image: '/svg/gift-card-congrats.svg',
      category: 'congratulations',
      availableAmounts: [50, 100, 200, 300],
      backgroundColor: 'from-yellow-400 to-amber-500',
      accentColor: 'yellow',
    },
    {
      id: 'gc-gaming-1',
      name: 'Gamer\'s Choice',
      description: 'For the gaming enthusiast. Level up their experience!',
      image: '/svg/gift-card-gaming.svg',
      category: 'gaming',
      availableAmounts: [25, 50, 100, 150],
      backgroundColor: 'from-violet-500 to-purple-600',
      accentColor: 'violet',
    },
  ];

  constructor() {
    this.loadPurchasedCards();
  }

  getGiftCards(): Observable<GiftCard[]> {
    return of(this.giftCards);
  }

  getGiftCardsByCategory(category: GiftCardCategory): Observable<GiftCard[]> {
    return of(this.giftCards.filter((gc) => gc.category === category));
  }

  getGiftCardById(id: string): Observable<GiftCard | undefined> {
    return of(this.giftCards.find((gc) => gc.id === id));
  }

  purchaseGiftCard(form: GiftCardPurchaseForm): Observable<PurchasedGiftCard> {
    return throwError(() => new Error('Gift cards are unavailable until an online payment provider is connected.'));
  }

  redeemGiftCard(code: string): Observable<{success: boolean; message: string; amount?: number}> {
    return of({success: false, message: 'Online gift cards are currently unavailable.'});
  }

  getMyGiftCards(): Observable<PurchasedGiftCard[]> {
    return this.purchasedCards$;
  }

  private generateGiftCardCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private generateId(): string {
    return 'pgc-' + Math.random().toString(36).substring(2, 11);
  }

  private getExpiryDate(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }

  private savePurchasedCards(): void {
    localStorage.setItem(
      'purchased-gift-cards',
      JSON.stringify(this.purchasedCardsSubject.value)
    );
  }

  private loadPurchasedCards(): void {
    const stored = localStorage.getItem('purchased-gift-cards');
    if (stored) {
      try {
        const cards = JSON.parse(stored).map((card: any) => ({
          ...card,
          purchaseDate: new Date(card.purchaseDate),
          expiryDate: new Date(card.expiryDate),
          redeemedDate: card.redeemedDate ? new Date(card.redeemedDate) : undefined,
        }));
        this.purchasedCardsSubject.next(cards);
      } catch {
        this.purchasedCardsSubject.next([]);
      }
    }
  }
}
