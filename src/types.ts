/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'burgers' | 'pizza' | 'drinks' | 'snacks' | 'rolls' | 'chicken' | 'shawarma';
}

export interface CartItem extends FoodItem {
  quantity: number;
}
