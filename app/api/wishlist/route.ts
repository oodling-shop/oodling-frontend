import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromCookie } from '@/lib/shopify/customer';
import {
  getWishlistProductIds,
  getWishlistProducts,
  updateWishlist,
} from '@/lib/shopify/wishlist';
import { ShopifyError } from '@/lib/shopify/client';

function unauthorizedResponse(request: NextRequest) {
  const acceptsHtml = request.headers.get('accept')?.includes('text/html');

  if (acceptsHtml) {
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl.origin));
  }

  return NextResponse.json(
    {
      error: 'Unauthorized',
    },
    { status: 401 }
  );
}

function getLanguageFromRequest(request: NextRequest) {
  const locale = request.cookies.get('shopify_locale')?.value ?? 'EN';
  return locale.toUpperCase();
}

export async function GET(request: NextRequest) {
  const token = await getTokenFromCookie();

  if (!token) {
    return unauthorizedResponse(request);
  }

  try {
    const productIds = await getWishlistProductIds(token);
    const includeProducts = request.nextUrl.searchParams.get('includeProducts') === 'true';
    const language = getLanguageFromRequest(request);
    const products = includeProducts ? await getWishlistProducts(productIds, language) : undefined;

    return NextResponse.json({ productIds, products });
  } catch (error) {
    if (error instanceof ShopifyError) {
      const status = error.type === 'network' ? 500 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({ error: 'Failed to load wishlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getTokenFromCookie();

  if (!token) {
    return unauthorizedResponse(request);
  }

  try {
    const body = (await request.json()) as {
      productId?: string;
      action?: 'add' | 'remove' | 'toggle';
    };

    if (!body.productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    const result = await updateWishlist(token, body.productId, body.action ?? 'toggle');
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ShopifyError) {
      const status = error.type === 'network' ? 500 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}
