import { useEffect, useState } from 'react';
import { readRuoCart, subscribeToRuoCart } from '@/lib/ruo/cart';

export default function useRuoCart() {
  const [cart, setCart] = useState(() => readRuoCart());

  useEffect(() => {
    setCart(readRuoCart());
    return subscribeToRuoCart(() => setCart(readRuoCart()));
  }, []);

  return cart;
}