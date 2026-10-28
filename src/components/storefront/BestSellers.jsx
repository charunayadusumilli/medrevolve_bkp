import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductTile from './ProductTile';

export default function BestSellers({ products }) {
  const railRef = useRef(null);
  const list = (products || []).filter((p) => p.badge === 'bestseller');

  const scrollBy = (direction) => {
    const node = railRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * (node.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section className="border-y border-sf-line bg-sf-surface">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sf-muted">Members' favorites</p>
            <h2 className="mt-2 font-display text-[30px] tracking-tight sm:text-[38px]">Best sellers</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-sf-line text-sf-ink hover:bg-sf-paper"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-sf-line text-sf-ink hover:bg-sf-paper"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {products === null ? (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-sf-paper" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <p className="mt-8 text-[13px] text-sf-muted">Best sellers are being restocked.</p>
        ) : (
          <div
            ref={railRef}
            className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {list.map((product) => (
              <div key={product.id} className="w-[74%] flex-none snap-start sm:w-[46%] lg:w-[23.5%]">
                <ProductTile product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}