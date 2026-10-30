import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShoppingBasket } from 'lucide-react';
import { addLine } from '@/lib/storefront/cart';
import { useToast } from '@/components/ui/use-toast';

export const INTAKE_BANNER =
  'This treatment requires a licensed provider review. Start your intake instead.';

export default function QuickAdd({ product, label = 'Add to basket', className = '' }) {
  const [added, setAdded] = useState(false);
  const { toast } = useToast();

  // Rail guard — prescription products are intake-only and never render an add-to-basket control.
  if (product.rail === 'prescription') {
    return (
      <Link
        to={`/intake/${product.category}?product=${product.slug}`}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-sf-ink px-4 py-2 text-[12px] font-semibold text-sf-ink transition-colors hover:bg-sf-ink hover:text-white ${className}`}
      >
        Start intake
      </Link>
    );
  }

  const handleAdd = () => {
    if (product.in_stock === false) return;

    addLine(product, {
      quantity: 1,
      purchaseType: product.subscription_price != null ? 'subscription' : 'one_time',
      cadenceDays: product.subscription_cadences?.[0] ?? 30,
      doseLabel: product.dose_options?.[0]?.label,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    toast({ title: 'Added to basket', description: product.display_name });
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={product.in_stock === false}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-sf-line disabled:text-sf-muted ${
        added ? 'bg-sf-accent text-white' : 'bg-sf-ink text-white hover:bg-sf-ink/90'
      } ${className}`}
    >
      {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBasket className="h-3.5 w-3.5" />}
      {product.in_stock === false ? 'Out of stock' : added ? 'Added' : label}
    </button>
  );
}