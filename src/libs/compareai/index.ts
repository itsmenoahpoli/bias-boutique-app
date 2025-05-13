import { OPENAI_CONFIG } from "@/config/opanai.config";
import { type Product } from "@/services/products.service";

const { BASE_URL, API_KEY } = OPENAI_CONFIG;

type CompareProductsOptions = {
  product1: Product;
  product2: Product;
};

export async function getProductComparison({
  product1,
  product2,
}: CompareProductsOptions): Promise<string> {
  if (!API_KEY) {
    return generateBasicComparison(product1, product2);
  }

  return await fetchGptComparison(product1, product2);
}

function generateBasicComparison(product1: Product, product2: Product): string {
  const priceDiff = Math.abs(product1.price - product2.price);
  const priceComparison =
    product1.price < product2.price
      ? `${product1.name} is more affordable than ${product2.name}`
      : `${product2.name} is more affordable than ${product1.name}`;

  const categoryComparison =
    product1.category === product2.category
      ? `Both products are in the ${product1.category} category`
      : `${product1.name} is in ${product1.category} while ${product2.name} is in ${product2.category}`;

  const stockComparison =
    product1.stocks_qty > product2.stocks_qty
      ? `${product1.name} has better availability`
      : `${product2.name} has better availability`;

  return `${priceComparison}. ${categoryComparison}. ${stockComparison}. Price difference: ₱${priceDiff.toLocaleString()}`;
}

async function fetchGptComparison(
  product1: Product,
  product2: Product
): Promise<string> {
  const prompt = `Compare these two products and provide a detailed analysis:

Product 1:
- Name: ${product1.name}
- Category: ${product1.category}
- Price: ₱${product1.price.toLocaleString()}
- Description: ${product1.description}
- Stock: ${product1.stocks_qty}
${
  product1.is_discounted
    ? `- Discounted Price: ₱${product1.discounted_price.toLocaleString()}`
    : ""
}

Product 2:
- Name: ${product2.name}
- Category: ${product2.category}
- Price: ₱${product2.price.toLocaleString()}
- Description: ${product2.description}
- Stock: ${product2.stocks_qty}
${
  product2.is_discounted
    ? `- Discounted Price: ₱${product2.discounted_price.toLocaleString()}`
    : ""
}

Please provide a detailed comparison focusing on:
1. Price comparison and value for money
2. Category and product type analysis
3. Availability and stock status
4. Key differences and similarities
5. Recommendations based on different user preferences

Keep the response concise and easy to read.`;

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful product comparison assistant that provides clear, concise, and objective comparisons.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const json = await response.json();

  return (
    json?.choices?.[0]?.message?.content?.trim() ||
    generateBasicComparison(product1, product2)
  );
}
