export type SearchableProduct = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryName: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function searchProducts<T extends SearchableProduct>(products: T[], query: string) {
  const terms = normalize(query).split(" ").filter(Boolean);

  if (!terms.length) return products;

  return products.filter((product) => {
    const haystack = normalize(
      [
        product.name,
        product.slug,
        product.shortDescription,
        product.description,
        product.categoryName,
      ].join(" "),
    );

    return terms.every((term) => haystack.includes(term));
  });
}

