/**
 * CSV Parser & Smart Column Mapper Utility for Townraise
 * Handles RFC 4180 CSV parsing, delimiter auto-detection, and flexible header mapping.
 */

export interface CsvParseResult {
  headers: string[];
  rows: Record<string, string>[];
  errors: string[];
  delimiter: string;
}

/**
 * Parses raw CSV / TSV text into headers and an array of key-value row records.
 * Supports quoted fields, multiline cells, and auto-detects commas, tabs, or semicolons.
 */
export function parseCsvText(rawText: string): CsvParseResult {
  const errors: string[] = [];
  if (!rawText || !rawText.trim()) {
    return { headers: [], rows: [], errors: ['CSV content is empty'], delimiter: ',' };
  }

  // Detect delimiter based on first line
  const firstLine = rawText.split(/\r\n|\n|\r/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;

  let delimiter = ',';
  if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';
  else if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';

  // State-machine token parser
  const parsedRows: string[][] = [];
  let currentRow: string[] = [];
  let currentToken = '';
  let insideQuotes = false;

  for (let i = 0; i < rawText.length; i++) {
    const char = rawText[i];
    const nextChar = rawText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentToken += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      currentRow.push(currentToken.trim());
      currentToken = '';
      if (currentRow.some(cell => cell.length > 0)) {
        parsedRows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentToken += char;
    }
  }

  // Push remaining token
  if (currentToken.length > 0 || currentRow.length > 0) {
    currentRow.push(currentToken.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      parsedRows.push(currentRow);
    }
  }

  if (parsedRows.length === 0) {
    return { headers: [], rows: [], errors: ['No valid rows detected in CSV'], delimiter };
  }

  const rawHeaders = parsedRows[0].map(h => h.replace(/^["']|["']$/g, '').trim());
  const dataRows = parsedRows.slice(1);

  const rowObjects: Record<string, string>[] = [];

  dataRows.forEach((row, rowIndex) => {
    // Skip empty lines
    if (row.length === 1 && !row[0]) return;

    const rowObj: Record<string, string> = {};
    rawHeaders.forEach((header, colIndex) => {
      rowObj[header] = row[colIndex] || '';
    });
    rowObjects.push(rowObj);
  });

  return {
    headers: rawHeaders,
    rows: rowObjects,
    errors,
    delimiter,
  };
}

/**
 * Smart field mappings for Businesses & Restaurants
 */
export const BUSINESS_FIELD_SYNONYMS: Record<string, string[]> = {
  name: ['name', 'business name', 'restaurant', 'restaurant name', 'shop name', 'title', 'company', 'store name', 'place'],
  category: ['category', 'category label', 'type', 'industry', 'cuisine', 'business type', 'sector'],
  town: ['town', 'town node', 'city', 'municipality', 'village', 'location'],
  address: ['address', 'street', 'street address', 'location address', 'road'],
  phone: ['phone', 'telephone', 'phone number', 'tel', 'cell', 'mobile', 'dispatch phone'],
  website: ['website', 'url', 'web', 'link', 'site', 'website url'],
  googleRating: ['rating', 'google rating', 'stars', 'google stars', 'score'],
  reviewCount: ['reviews', 'review count', 'total reviews', 'reviews count', 'num reviews'],
  description: ['description', 'about', 'bio', 'summary', 'details', 'notes', 'tagline'],
  verified: ['verified', 'is verified', 'verified badge', 'claim status', 'claimed'],
};

/**
 * Smart field mappings for Menu & Storefront Products
 */
export const PRODUCT_FIELD_SYNONYMS: Record<string, string[]> = {
  name: ['name', 'item name', 'product name', 'dish', 'dish name', 'title', 'item'],
  price: ['price', 'cost', 'amount', 'item price', 'rate', 'retail price', 'fee'],
  category: ['category', 'section', 'menu category', 'type', 'group', 'tag'],
  description: ['description', 'details', 'ingredients', 'item description', 'summary', 'bio'],
  imageUrl: ['image', 'image url', 'photo', 'picture', 'photo url', 'thumbnail', 'pic'],
  badge: ['badge', 'tag', 'highlight', 'special', 'featured', 'promo', 'label'],
  calories: ['calories', 'cal', 'energy', 'kcal'],
  dietaryTags: ['dietary', 'dietary tags', 'allergens', 'diet', 'vegan/gf', 'tags'],
  inStock: ['in stock', 'stock', 'available', 'active', 'status', 'is available'],
};

/**
 * Smart field mappings for Marketplace Artisan Products
 */
export const MARKETPLACE_FIELD_SYNONYMS: Record<string, string[]> = {
  name: ['name', 'product name', 'title', 'item title', 'goods'],
  price: ['price', 'cost', 'retail price', 'amount', 'msrp'],
  category: ['category', 'department', 'type', 'product type'],
  subtitle: ['subtitle', 'short desc', 'brief', 'tagline'],
  description: ['description', 'story', 'details', 'material info'],
  town: ['town', 'town node', 'origin town', 'crafted in', 'city'],
  sellerName: ['seller', 'seller name', 'artisan', 'maker', 'vendor', 'shop'],
  imageUrl: ['image', 'image url', 'photo', 'picture'],
  badge: ['badge', 'ribbon', 'highlight', 'tag'],
  rating: ['rating', 'stars', 'score'],
  inStock: ['in stock', 'inventory', 'available'],
};

/**
 * Automatically suggests best header mappings
 */
export function autoMapHeaders(headers: string[], synonymsMap: Record<string, string[]>): Record<string, string> {
  const mapping: Record<string, string> = {};

  Object.keys(synonymsMap).forEach(targetKey => {
    const synonyms = synonymsMap[targetKey];
    const match = headers.find(h => {
      const cleanH = h.toLowerCase().trim().replace(/[_-]/g, ' ');
      return synonyms.some(syn => cleanH === syn || cleanH.includes(syn));
    });

    if (match) {
      mapping[targetKey] = match;
    }
  });

  return mapping;
}

/**
 * Converts an array of objects into a downloadable CSV string
 */
export function generateCsvString(data: Record<string, any>[]): string {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(row => {
    return headers.map(header => {
      const val = row[header] === undefined || row[header] === null ? '' : String(row[header]);
      // Escape quotes and wrap in quotes if contains comma, newline or quotes
      if (val.includes('"') || val.includes(',') || val.includes('\n') || val.includes('\r')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Triggers a direct browser file download for a CSV string
 */
export function downloadCsvFile(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
