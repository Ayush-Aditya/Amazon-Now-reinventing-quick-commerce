import { useState } from 'react';

/**
 * Smart product image: tries the primary URL, falls back to SVG if it errors.
 * Always displays SOMETHING — never a broken image icon.
 */
export default function ProductImage({ product, className = '', style = {} }) {
  const [errored, setErrored] = useState(false);
  const src = errored ? product.fallback : product.image;

  return (
    <img
      src={src}
      alt={product.name}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}
