import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Search } from 'lucide-react';

const COUNTRIES = [
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸', maxDigits: 10 },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦', maxDigits: 10 },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧', maxDigits: 10 },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', maxDigits: 9 },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽', maxDigits: 10 },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪', maxDigits: 11 },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷', maxDigits: 9 },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳', maxDigits: 10 },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷', maxDigits: 11 },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵', maxDigits: 10 },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳', maxDigits: 11 },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦', maxDigits: 9 },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬', maxDigits: 10 },
  { code: 'AE', name: 'UAE', dial: '+971', flag: '🇦🇪', maxDigits: 9 },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦', maxDigits: 9 },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬', maxDigits: 8 },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿', maxDigits: 9 },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹', maxDigits: 10 },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸', maxDigits: 9 },
  { code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷', maxDigits: 10 },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭', maxDigits: 10 },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰', maxDigits: 10 },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩', maxDigits: 10 },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭', maxDigits: 9 },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪', maxDigits: 9 },
];

/**
 * Converts value to E.164 based on selected country.
 */
export function toE164(raw, dialCode = '+1') {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  return `${dialCode}${digits}`;
}

/**
 * PhoneInput — International phone input with country code selector.
 * onChange is called with the full number string (e.g. "+12025550123").
 */
export default function PhoneInput({
  value = '',
  onChange,
  className,
  inputClass,
  placeholder,
  required,
  id,
  error,
}) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [localNumber, setLocalNumber] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Parse incoming value to set country and local number
  useEffect(() => {
    if (!value) return;
    const digits = value.replace(/\D/g, '');
    if (!digits) return;
    // Try to match dial code
    const match = COUNTRIES.find(c => value.startsWith(c.dial));
    if (match) {
      setSelectedCountry(match);
      setLocalNumber(value.slice(match.dial.length).replace(/\D/g, ''));
    } else {
      setLocalNumber(digits);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, selectedCountry.maxDigits);
    setLocalNumber(digits);
    onChange(digits ? `${selectedCountry.dial}${digits}` : '');
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    setSearch('');
    onChange(localNumber ? `${country.dial}${localNumber}` : '');
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  const defaultPlaceholder = '0'.repeat(selectedCountry.maxDigits);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div className={cn(
        'flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#4A6741] focus-within:border-[#4A6741] bg-white transition-all',
        error ? 'border-red-400' : 'border-[#E8E0D5]'
      )}>
        {/* Country selector button */}
        <button
          type="button"
          onClick={() => setDropdownOpen(v => !v)}
          className="flex items-center gap-1 pl-3 pr-2 text-sm font-medium text-[#2D3A2D] select-none border-r border-[#E8E0D5] h-full py-2.5 bg-[#F5F0E8]/60 shrink-0 hover:bg-[#F0EBE0] transition-colors"
        >
          <span>{selectedCountry.flag}</span>
          <span className="text-[#5A6B5A]">{selectedCountry.dial}</span>
          <ChevronDown className={`w-3 h-3 text-[#9A8B7A] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Number input */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={localNumber}
          onChange={handleNumberChange}
          placeholder={placeholder || defaultPlaceholder}
          required={required}
          className={cn(
            'flex-1 h-11 px-3 text-sm bg-transparent outline-none text-[#2D3A2D] placeholder:text-[#9A8B7A]',
            inputClass
          )}
        />
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-[#E8E0D5] rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-[#E8E0D5]">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F0E8] rounded-xl">
              <Search className="w-3.5 h-3.5 text-[#9A8B7A] flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country..."
                className="flex-1 bg-transparent text-sm outline-none text-[#2D3A2D] placeholder:text-[#9A8B7A]"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filteredCountries.map(country => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#F5F0E8] transition-colors text-left',
                  selectedCountry.code === country.code && 'bg-[#4A6741]/10 font-medium'
                )}
              >
                <span className="text-base">{country.flag}</span>
                <span className="flex-1 text-[#2D3A2D]">{country.name}</span>
                <span className="text-[#9A8B7A] text-xs">{country.dial}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <p className="text-center text-sm text-[#9A8B7A] py-4">No countries found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}