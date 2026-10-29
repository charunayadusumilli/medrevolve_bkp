import { useEffect, useState } from 'react';
import { readCaseCart, subscribeToCaseCart } from '@/lib/ruo/storeCart';

export default function useCaseCart() {
  const [cart, setCart] = useState(() => readCaseCart());

  useEffect(() => {
    setCart(readCaseCart());
    return subscribeToCaseCart(() => setCart(readCaseCart()));
  }, []);

  return cart;
}