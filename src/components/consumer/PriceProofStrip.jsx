import React from 'react';
import { Link } from 'react-router-dom';

const TILES = [
  { label: 'Compounded semaglutide', price: '$149', cadence: '/mo', to: '/product/compounded-semaglutide' },
  { label: 'Compounded tirzepatide', price: '$249', cadence: '/mo', to: '/product/compounded-tirzepatide' },
  { label: 'Brand GLP-1s from', price: '$349', cadence: '/mo', note: 'with insurance check', to: '/shop/weight-loss' },
];

export default function PriceProofStrip() {
  return (
    <section className="border-y border-site-line bg-site-surface">
      <div className="mx-auto grid max-w-7xl divide-y divide-site-line px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0">
        {TILES.map((tile) => (
          <Link
            key={tile.label}
            to={tile.to}
            className="group px-1 py-8 transition-colors duration-200 md:px-10"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">
              {tile.label}
            </p>
            <p className="mt-2 font-display text-[34px] leading-none text-site-moss">
              {tile.price}
              <span className="ml-1 font-body text-[13px] font-medium text-site-greige">{tile.cadence}</span>
            </p>
            {tile.note && (
              <p className="mt-2 text-[11px] text-site-greige">{tile.note}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}