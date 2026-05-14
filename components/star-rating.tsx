'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  rating: number;
  max: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

export function StarRating({ rating, max, onChange, readOnly = false }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <motion.button
          key={i}
          whileTap={readOnly ? {} : { scale: 0.8 }}
          onClick={() => !readOnly && onChange?.(i + 1)}
          className={`transition-colors ${
            i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700'
          } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          type="button"
        >
          <Star size={16} />
        </motion.button>
      ))}
    </div>
  );
}
