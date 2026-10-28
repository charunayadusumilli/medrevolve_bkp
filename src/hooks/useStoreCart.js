import { useEffect, useState } from 'react';
import { readCart, subscribeToCart } from '@/lib/storefront/cart';

export default function useStoreCart() {
  const [cart, setCart] = useState(() => readCart());

  useEffect(() => {
    setCart(readCart());
    return subscribeToCart(() => setCart(readCart()));
  }, []);

  return cart;
}