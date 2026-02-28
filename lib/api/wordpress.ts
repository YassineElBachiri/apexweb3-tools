const WP_GRAPHQL_URL = 'https://apexweb3.com/graphql';

export interface WPPost {
  title: string;
  slug: string;
  date: string;
  content: string;
  excerpt: string;
  author: {
    node: {
      name: string;
      avatar: {
        url: string;
      }
    }
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    }
  };
  categories: {
    nodes: Array<{
      name: string;
      slug: string;
    }>
  };
}

async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
      next: { tags: ['wordpress'] }, // Next.js 14/15/16 caching tag
    });

    const json = await res.json();
    if (json.errors) {
      console.error(json.errors);
      throw new Error('Failed to fetch API');
    }
    return json.data;
  } catch (error) {
    console.error('WP API Error:', error);
    return {};
  }
}

export async function getLatestPosts(first = 10): Promise<WPPost[]> {
  const data = await fetchAPI(`
    query AllPosts($first: Int!) {
      posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          slug
          excerpt
          date
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `, {
    variables: { first }
  });

  return data?.posts?.nodes || [];
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const data = await fetchAPI(`
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        slug
        content
        date
        excerpt
        author {
            node {
                name
                avatar {
                    url
                }
            }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
            nodes {
                name
                slug
            }
        }
      }
    }
  `, {
    variables: { slug }
  });

  return data?.post || null;
}

export async function getPostsByCategory(categorySlug: string, first = 10): Promise<WPPost[]> {
  const data = await fetchAPI(`
    query PostsByCategory($categorySlug: String!, $first: Int!) {
      posts(first: $first, where: { categoryName: $categorySlug, orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          slug
          excerpt
          date
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `, {
    variables: { categorySlug, first }
  });

  return data?.posts?.nodes || [];
}

export async function getCategories(): Promise<Array<{ name: string; slug: string; count: number }>> {
  const data = await fetchAPI(`
    query AllCategories {
      categories(where: { hideEmpty: true, orderby: COUNT, order: DESC }) {
        nodes {
          name
          slug
          count
        }
      }
    }
  `);

  return data?.categories?.nodes || [];
}
