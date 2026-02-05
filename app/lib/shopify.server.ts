/**
 * Shopify Storefront API統合
 * カート機能とチェックアウト機能を提供
 */

// ステップ1: Shopify設定を環境変数から取得
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

// ステップ2: GraphQL APIのエンドポイント
const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

/**
 * ステップ3: Shopify Storefront APIへのリクエストを送信
 */
async function shopifyFetch({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, any>;
}) {
  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API Error: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(`GraphQL Errors: ${JSON.stringify(json.errors)}`);
    }

    return json.data;
  } catch (error) {
    console.error("Shopify API Error:", error);
    throw error;
  }
}

/**
 * ステップ4: カートを作成する
 */
export async function createCart(lineItems: Array<{
  variantId: string;
  quantity: number;
  customAttributes?: Array<{ key: string; value: string }>;
}>) {
  const mutation = `
    mutation createCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          estimatedCost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: lineItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
        attributes: item.customAttributes,
      })),
    },
  };

  const data = await shopifyFetch({ query: mutation, variables });
  return data.cartCreate;
}

/**
 * ステップ5: カスタムTシャツをカートに追加
 * @param designImageUrl - デザイン画像のURL
 * @param productVariantId - TシャツのバリアントID
 */
export async function addCustomTshirtToCart(
  designImageUrl: string,
  designImageUrlHD: string,
  productVariantId: string = "gid://shopify/ProductVariant/48602131661024"
) {
  return await createCart([
    {
      variantId: productVariantId,
      quantity: 1,
      customAttributes: [
        { key: "design_image", value: designImageUrl },
        { key: "design_image_hd", value: designImageUrlHD },
      ],
    },
  ]);
}

/**
 * ステップ6: AI生成画像でカスタムTシャツをカートに追加
 */
export async function addAIGeneratedTshirtToCart(
  designImageUrl: string,
  designImageUrlHD: string,
  prompt: string,
  productVariantId: string = "gid://shopify/ProductVariant/48602131661024"
) {
  return await createCart([
    {
      variantId: productVariantId,
      quantity: 1,
      customAttributes: [
        { key: "design_image", value: designImageUrl },
        { key: "design_image_hd", value: designImageUrlHD },
        { key: "ai_prompt", value: prompt },
      ],
    },
  ]);
}

/**
 * ステップ7: 商品一覧を取得
 */
export async function getProducts(first: number = 10) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query, variables: { first } });
  return data.products;
}

/**
 * ステップ8: コレクションから商品を取得
 */
export async function getCollectionProducts(
  collectionHandle: string,
  first: number = 10,
  after?: string | null
) {
  const query = `
    query getCollectionProducts($handle: String!, $first: Int!, $after: String) {
      collectionByHandle(handle: $handle) {
        id
        title
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              description
              handle
              options {
                name
                values
              }
              metafield(namespace: "custom", key: "color") {
                type
                value
                references(first: 20) {
                  nodes {
                    ... on Metaobject {
                      id
                      handle
                      type
                      fields {
                        key
                        value
                      }
                    }
                  }
                }
              }
              variants(first: 50) {
                edges {
                  node {
                    id
                    title
                    selectedOptions {
                      name
                      value
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables: any = { handle: collectionHandle, first };
  if (after) {
    variables.after = after;
  }

  const data = await shopifyFetch({ query, variables });
  return data.collectionByHandle;
}

/**
 * メタオブジェクトをID一覧から取得
 */
export async function getMetaobjectsByIds(ids: string[]) {
  if (ids.length === 0) return [];

  const query = `
    query getMetaobjectsByIds($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Metaobject {
          id
          handle
          type
          fields {
            key
            value
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query, variables: { ids } });
  return data.nodes || [];
}
