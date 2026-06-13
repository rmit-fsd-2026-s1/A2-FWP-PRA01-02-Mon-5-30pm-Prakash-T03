/**
 * VENUE VENDORS ADMIN CONSOLE UI - GRAPHQL.TS
 * 
 * Purpose: Source code for Venue Vendors Admin Console UI.
 * 
 * Command lines to execute/build/test this project:
 * - Start Vite Admin Dev Server: npm run dev
 * - Build Admin Frontend bundle: npm run build
 * - Preview production build: npm run preview
 */

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:5001/graphql';

export async function graphqlFetch<T = any>(query: string, variables: any = {}): Promise<T> {
  const token = localStorage.getItem('admin_token');
  
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
    });

    const body = await res.json();

    if (body.errors) {
      const errorMsg = body.errors[0]?.message || 'GraphQL Operation Error';
      throw new Error(errorMsg);
    }

    return body.data as T;
  } catch (err: any) {
    console.error('Admin GraphQL request failure:', err);
    throw err;
  }
}
