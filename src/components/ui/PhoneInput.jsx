import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Formats a raw digit string into (XXX) XXX-XXXX as the user types.
 */
function formatDisplay(digits) {
  const d = digits.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * Converts any US phone number format to E.164 (+1XXXXXXXXXX).
 * Returns null if not a valid 10-digit US number.
 */
export function toE164(raw) {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) digits = digits.slice(1);
  if (digits.length !== 10) return null;
  return `+1${digits}`;
}

/**
 * PhoneInput — US phone input with +1 prefix and auto-formatting.
 * Stores the raw E.164 value (+1XXXXXXXXXX) in state via onChange.
 * 
 * Props:
 *   value        - current value (can be E.164, raw digits, or formatted)
 *   onChange     - called with E.164 string (e.g. "+15302006352") or '' if empty
 *   className    - extra classes for the outer wrapper
 *   inputClass   - extra classes for the <input>
 *   placeholder  - defaults to "(530) 200-6352"
 *   required     - passed to <input>
 *   id           - for label association
 */
export default function PhoneInput({ value = '', onChange, className, inputClass, placeholder = '(530) 200-6352', required, id }) {
  // Derive display value from whatever is stored
  const getDigits = (v) => {
    if (!v) return '';
    let d = v.replace(/\D/g, '');
    if (d.startsWith('1') && d.length === 11) d = d.slice(1);
    return d.slice(0, 10);
  };

  const displayValue = formatDisplay(getDigits(value));

  const handleChange = (e) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    const e164 = digits.length === 10 ? `+1${digits}` : digits.length > 0 ? digits : '';
    onChange(e164);
  };

  return (
    <div className={cn('flex items-center border border-[#E8E0D5] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#4A6741] focus-within:border-[#4A6741] bg-white transition-all', className)}>
      <span className="flex items-center gap-1.5 pl-3 pr-2 text-sm font-medium text-[#5A6B5A] select-none border-r border-[#E8E0D5] h-full py-2.5 bg-[#F5F0E8]/60 shrink-0">
        🇺🇸 <span className="text-[#2D3A2D]">+1</span>
      </span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={cn(
          'flex-1 h-11 px-3 text-sm bg-transparent outline-none text-[#2D3A2D] placeholder:text-[#9A8B7A]',
          inputClass
        )}
      />
    </div>
  );
}