import React, { useState } from 'react';

// Editorial image with graceful fallback to a neutral tone if the photo fails to load.
export default function EditorialImage({ src, alt, className, imgClass, bgClass = 'bg-stone-200' }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`relative overflow-hidden ${bgClass} ${className || ''}`}>
      {!err && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setErr(true)}
          className={`absolute inset-0 w-full h-full object-cover ${imgClass || ''}`}
        />
      )}
    </div>
  );
}