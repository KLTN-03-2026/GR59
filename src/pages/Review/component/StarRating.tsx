import React, { useState } from "react";
import { Star } from "@phosphor-icons/react"; // Import component Star

interface StarRatingProps {
  maxStars?: number;
  initialRating?: number;
  isEditable?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  maxStars = 5,
  initialRating = 0,
  isEditable = true,
  onChange,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(initialRating);

  const currentRating = hoverRating || selectedRating;

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= currentRating;

        return (
          <Star
            key={index}
            size={20} // Bạn có thể chỉnh size ở đây
            weight={isFilled ? "fill" : "regular"} // "fill" tương đương ph-fill
            color={isFilled ? "yellow" : "#cbd5e1"} // Màu sắc trực tiếp hoặc qua CSS
            style={{
              cursor: isEditable ? "pointer" : "default",
              transition: "transform 0.2s",
            }}
            onClick={() => {
              if (isEditable) {
                setSelectedRating(starValue);
                if (onChange) onChange(starValue);
              }
            }}
            onMouseEnter={() => isEditable && setHoverRating(starValue)}
            onMouseLeave={() => isEditable && setHoverRating(0)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
