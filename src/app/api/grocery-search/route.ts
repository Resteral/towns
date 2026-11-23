import { NextRequest, NextResponse } from 'next/server';

export interface GrocerySearchProduct {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  quantity: string;
  imageUrl: string;
  category: string;
  estimatedPrice: number;
}

// Deterministic realistic local grocery price estimate based on category & barcode
function estimatePrice(name: string, category: string, barcode: string): number {
  const lower = `${name} ${category}`.toLowerCase();
  const hash = barcode
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const cents = [0.29, 0.49, 0.79, 0.89, 0.99][hash % 5];

  if (lower.includes('case') || lower.includes('12 pack') || lower.includes('24 pack') || lower.includes('coffee')) {
    return Number((7 + (hash % 6) + cents).toFixed(2));
  }
  if (lower.includes('pizza') || lower.includes('chicken') || lower.includes('beef') || lower.includes('steak') || lower.includes('cheese')) {
    return Number((5 + (hash % 5) + cents).toFixed(2));
  }
  if (lower.includes('milk') || lower.includes('eggs') || lower.includes('cereal') || lower.includes('juice') || lower.includes('oil')) {
    return Number((3 + (hash % 4) + cents).toFixed(2));
  }
  if (lower.includes('bread') || lower.includes('chips') || lower.includes('cookies') || lower.includes('crackers') || lower.includes('pasta')) {
    return Number((2 + (hash % 4) + cents).toFixed(2));
  }
  return Number((3 + (hash % 4) + cents).toFixed(2));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();

  if (!query) {
    return NextResponse.json({ products: [], source: 'empty' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    // Check if query is a numeric UPC/EAN barcode
    const isBarcode = /^\d{8,14}$/.test(query);

    if (isBarcode) {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(query)}.json?fields=code,product_name,brands,quantity,image_front_small_url,image_url,categories_tags_en`,
        {
          headers: { 'User-Agent': 'TownraiseLocalShop/1.0 (https://townraise.com)' },
          signal: controller.signal,
          next: { revalidate: 3600 },
        }
      );
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data?.status === 1 && data?.product?.product_name) {
          const p = data.product;
          const cat =
            Array.isArray(p.categories_tags_en) && p.categories_tags_en.length > 0
              ? String(p.categories_tags_en[0]).replace(/^en:/, '').replace(/-/g, ' ')
              : 'Grocery';
          const item: GrocerySearchProduct = {
            id: `off-${p.code || query}`,
            barcode: String(p.code || query),
            name: String(p.product_name).trim(),
            brand: p.brands ? String(p.brands).split(',')[0].trim() : 'Local Grocery',
            quantity: p.quantity ? String(p.quantity).trim() : 'Standard Size',
            imageUrl: p.image_front_small_url || p.image_url || '',
            category: cat,
            estimatedPrice: estimatePrice(String(p.product_name), cat, String(p.code || query)),
          };
          return NextResponse.json({ products: [item], source: 'openfoodfacts-barcode' });
        }
      }
      return NextResponse.json({ products: [], source: 'openfoodfacts-barcode-miss' });
    }

    // Standard keyword search against Open Food Facts (US prioritized)
    const apiUrl = `https://us.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      query
    )}&search_simple=1&action=process&json=1&page_size=24&fields=code,product_name,brands,quantity,image_front_small_url,image_url,categories_tags_en`;

    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'TownraiseLocalShop/1.0 (https://townraise.com)' },
      signal: controller.signal,
      next: { revalidate: 1800 },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ products: [], source: 'upstream-error' }, { status: 200 });
    }

    const data = await res.json();
    const rawProducts = Array.isArray(data?.products) ? data.products : [];

    const seenNames = new Set<string>();
    const products: GrocerySearchProduct[] = [];

    for (const p of rawProducts) {
      const name = typeof p.product_name === 'string' ? p.product_name.trim() : '';
      const imageUrl = p.image_front_small_url || p.image_url || '';
      if (!name || name.length < 2) continue;

      const brand = p.brands ? String(p.brands).split(',')[0].trim() : 'Grocery Brand';
      const dedupeKey = `${brand.toLowerCase()}-${name.toLowerCase()}`;
      if (seenNames.has(dedupeKey)) continue;
      seenNames.add(dedupeKey);

      const cat =
        Array.isArray(p.categories_tags_en) && p.categories_tags_en.length > 0
          ? String(p.categories_tags_en[0]).replace(/^en:/, '').replace(/-/g, ' ')
          : 'Grocery';

      const code = String(p.code || `${products.length}-${name.length}`);
      products.push({
        id: `off-${code}`,
        barcode: code,
        name,
        brand,
        quantity: p.quantity ? String(p.quantity).trim() : '',
        imageUrl,
        category: cat,
        estimatedPrice: estimatePrice(name, cat, code),
      });

      if (products.length >= 18) break;
    }

    return NextResponse.json({
      products,
      source: 'openfoodfacts',
    });
  } catch {
    clearTimeout(timeout);
    return NextResponse.json({ products: [], source: 'timeout' }, { status: 200 });
  }
}
