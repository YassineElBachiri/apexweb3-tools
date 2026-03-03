const WP_REST_URL = 'https://wp.apexweb3.com/wp-json/wp/v2';
// Ensure the Node fetch API doesn't fail on local development TLS issues with this WP domain
if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
  // Already set via env
} else {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

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

// Helper to map REST post to WPPost interface
function mapRestPostToWPPost(post: any): WPPost {
  const author = post._embedded?.author?.[0];
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

  // Find categories in terms mapping
  const terms = post._embedded?.['wp:term'] || [];
  // Categories are taxonomy 'category'
  const categoriesObj = terms.find((termArray: any[]) => termArray.length > 0 && termArray[0].taxonomy === 'category') || [];
  const categories = categoriesObj.map((cat: any) => ({
    name: cat.name,
    slug: cat.slug
  }));

  return {
    title: post.title?.rendered || '',
    slug: post.slug,
    date: post.date,
    content: post.content?.rendered || '',
    excerpt: post.excerpt?.rendered || '',
    author: {
      node: {
        name: author?.name || 'Unknown',
        avatar: {
          url: author?.avatar_urls?.['96'] || ''
        }
      }
    },
    featuredImage: featuredMedia ? {
      node: {
        sourceUrl: featuredMedia.source_url || '',
        altText: featuredMedia.alt_text || ''
      }
    } : undefined,
    categories: {
      nodes: categories
    }
  };
}

export async function getLatestPosts(first = 10, page = 1): Promise<WPPost[]> {
  try {
    const res = await fetch(`${WP_REST_URL}/posts?_embed=1&per_page=${first}&page=${page}`, {
      next: { tags: ['wordpress'], revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch posts');
    const data = await res.json();
    return data.map(mapRestPostToWPPost);
  } catch (error) {
    console.error('WP API Error (getLatestPosts):', error);
    return [];
  }
}

export async function getPaginatedPosts(first = 10, page = 1): Promise<{ posts: WPPost[], totalPages: number }> {
  try {
    const res = await fetch(`${WP_REST_URL}/posts?_embed=1&per_page=${first}&page=${page}`, {
      next: { tags: ['wordpress'], revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch posts');
    const data = await res.json();
    const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
    return { posts: data.map(mapRestPostToWPPost), totalPages };
  } catch (error) {
    console.error('WP API Error (getPaginatedPosts):', error);
    return { posts: [], totalPages: 0 };
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(`${WP_REST_URL}/posts?_embed=1&slug=${slug}`, {
      next: { tags: ['wordpress'], revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch post');
    const data = await res.json();
    if (data.length === 0) return null;
    return mapRestPostToWPPost(data[0]);
  } catch (error) {
    console.error('WP API Error (getPostBySlug):', error);
    return null;
  }
}

export async function getPostsByCategory(categorySlug: string, first = 10, page = 1): Promise<WPPost[]> {
  try {
    // First need to resolve category slug to ID in REST API
    const catRes = await fetch(`${WP_REST_URL}/categories?slug=${categorySlug}`);
    if (!catRes.ok) throw new Error('Failed to fetch category');
    const catData = await catRes.json();
    if (catData.length === 0) return [];

    const categoryId = catData[0].id;

    const res = await fetch(`${WP_REST_URL}/posts?_embed=1&categories=${categoryId}&per_page=${first}&page=${page}`, {
      next: { tags: ['wordpress'], revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch posts by category');
    const data = await res.json();
    return data.map(mapRestPostToWPPost);
  } catch (error) {
    console.error('WP API Error (getPostsByCategory):', error);
    return [];
  }
}

export async function getPaginatedPostsByCategory(categorySlug: string, first = 10, page = 1): Promise<{ posts: WPPost[], totalPages: number, categoryName: string }> {
  try {
    const catRes = await fetch(`${WP_REST_URL}/categories?slug=${categorySlug}`);
    if (!catRes.ok) throw new Error('Failed to fetch category');
    const catData = await catRes.json();
    if (catData.length === 0) return { posts: [], totalPages: 0, categoryName: '' };

    const categoryId = catData[0].id;
    const categoryName = catData[0].name;

    const res = await fetch(`${WP_REST_URL}/posts?_embed=1&categories=${categoryId}&per_page=${first}&page=${page}`, {
      next: { tags: ['wordpress'] },
    });
    if (!res.ok) throw new Error('Failed to fetch posts by category');
    const data = await res.json();
    const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
    return { posts: data.map(mapRestPostToWPPost), totalPages, categoryName };
  } catch (error) {
    console.error('WP API Error (getPaginatedPostsByCategory):', error);
    return { posts: [], totalPages: 0, categoryName: '' };
  }
}

export async function getCategories(): Promise<Array<{ name: string; slug: string; count: number }>> {
  try {
    const res = await fetch(`${WP_REST_URL}/categories?hide_empty=true&orderby=count&order=desc`, {
      next: { tags: ['wordpress'] },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.map((cat: any) => ({
      name: cat.name,
      slug: cat.slug,
      count: cat.count
    }));
  } catch (error) {
    console.error('WP API Error (getCategories):', error);
    return [];
  }
}
