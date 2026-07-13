export interface ProductPriceFields {
  price: number;
  priceType?: "standard" | "range" | "contact";
  priceRangeMin?: number;
  priceRangeMax?: number;
}

export function formatProductPrice(product: ProductPriceFields): string {
  if (product.priceType === "contact") {
    return "Contact for Price";
  }
  if (product.priceType === "range") {
    const min = product.priceRangeMin || 0;
    const max = product.priceRangeMax || 0;
    if (min > 0 && max > 0) {
      return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
    } else if (min > 0) {
      return `From ₹${min.toLocaleString("en-IN")}`;
    } else {
      return "Contact for Price";
    }
  }
  // Default to standard price
  return product.price > 0 ? `₹${product.price.toLocaleString("en-IN")}` : "Contact for Price";
}
