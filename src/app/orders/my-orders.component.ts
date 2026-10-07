import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../core/services/order.service';
import { Order } from '../core/models/admin.model';
import { TndCurrencyPipe } from '../shared/pipes/tnd-currency.pipe';
@Component({standalone:true,selector:'app-my-orders',imports:[CommonModule,RouterLink,TndCurrencyPipe],template:`
<main class="mx-auto max-w-5xl p-6">
  <h1 class="text-3xl font-bold mb-6">My Orders</h1>
  <p *ngIf="loading">Loading your orders...</p>
  <p *ngIf="error" role="alert" class="text-red-600">{{ error }}</p>
  <p *ngIf="!loading && !error && !orders.length">No orders yet. <a routerLink="/" class="text-yellow-600 underline">Browse products</a></p>
  <article *ngFor="let order of orders" class="rounded-lg border p-5 mb-4">
    <div class="flex justify-between flex-wrap gap-2"><h2 class="font-semibold">Order #{{order.id}}</h2><span>{{order.status}}</span></div>
    <p class="text-sm text-gray-500">{{order.createdAt | date:'medium'}} · Payment on delivery</p>
    <ul class="my-3"><li *ngFor="let item of order.items">{{item.product?.name}} × {{item.quantity}} — {{item.unitPrice | tndCurrency}}</li></ul>
    <p class="font-semibold">Total: {{order.totalAmount | tndCurrency}}</p>
  </article>
</main>`})
export class MyOrdersComponent implements OnInit {
 private service=inject(OrderService);
 orders:Order[]=[];loading=true;error='';
 ngOnInit():void{this.service.getAll().subscribe({next:rows=>{this.orders=rows;this.loading=false;},error:()=>{this.loading=false;this.error='Unable to load your orders. Please sign in again or retry later.';}});}
}
