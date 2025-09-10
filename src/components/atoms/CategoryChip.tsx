import React, { memo } from "react";
import { Chip, ChipProps } from "react-native-paper";
import { StyleSheet } from "react-native";
import { CATEGORY_COLORS } from "../../constants/categories";

interface CategoryChipProps extends Omit<ChipProps, "children"> {
  category: string;
  selected?: boolean;
}

const CategoryChip: React.FC<CategoryChipProps> = memo(
  ({ category, selected = false, style, ...props }) => {
    const categoryColor =
      CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "#95A5A6";

    return (
      <Chip
        style={[
          styles.chip,
          selected && { backgroundColor: categoryColor + "20" },
          style,
        ]}
        textStyle={[
          styles.text,
          selected && { color: categoryColor, fontWeight: "600" },
        ]}
        {...props}
      >
        {category}
      </Chip>
    );
  }
);

const styles = StyleSheet.create({
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
  },
});

CategoryChip.displayName = "CategoryChip";

export default CategoryChip;
