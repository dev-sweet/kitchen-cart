"use client";

import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  showValue = false,
  reviewCount,
  className = "",
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const roundUp = rating - fullStars >= 0.75;
  const adjustedFull = roundUp ? fullStars + 1 : fullStars;
  const emptyStars = maxRating - adjustedFull - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {/* Full stars */}
      {Array.from({ length: adjustedFull }).map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className="fill-amber-400 text-amber-400"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative" style={{ width: size, height: size }}>
          <Star
            size={size}
            className="absolute top-0 left-0 text-gray-300"
          />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: size / 2, height: size }}>
            <Star
              size={size}
              className="fill-amber-400 text-amber-400"
            />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: Math.max(0, emptyStars) }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className="text-gray-300"
        />
      ))}

      {/* Rating value */}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}

      {/* Review count */}
      {reviewCount !== undefined && (
        <span className="ml-1 text-sm text-muted-foreground">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
