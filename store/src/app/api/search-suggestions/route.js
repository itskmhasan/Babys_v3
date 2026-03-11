import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();

    if (query.length < 2) {
      return NextResponse.json({ products: [], categories: [], brands: [] });
    }

    if (!API_BASE_URL) {
      return NextResponse.json({ products: [], categories: [], brands: [] });
    }

    const encodedQuery = encodeURIComponent(query);
    const normalizedQuery = query.toLowerCase();

    const [productResult, categoryResult] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/products?title=${encodedQuery}&page=1&limit=6`, {
        cache: "no-store",
      }),
      fetch(`${API_BASE_URL}/categories/all`, {
        cache: "no-store",
      }),
    ]);

    let products = [];
    let categories = [];

    if (productResult.status === "fulfilled" && productResult.value.ok) {
      const productData = await productResult.value.json();
      products = productData?.products || [];
    }

    if (categoryResult.status === "fulfilled" && categoryResult.value.ok) {
      const categoryData = await categoryResult.value.json();
      categories = (categoryData || [])
        .filter((category) => {
          const name = category?.name?.en || category?.name || "";
          return name.toLowerCase().includes(normalizedQuery);
        })
        .slice(0, 6);
    }

    const brandSet = new Set();
    for (const product of products) {
      if (!Array.isArray(product?.tag)) continue;
      for (const tag of product.tag) {
        if (typeof tag === "string" && tag.trim()) {
          brandSet.add(tag.trim());
        }
      }
    }

    const brands = Array.from(brandSet).slice(0, 6);

    return NextResponse.json({ products, categories, brands });
  } catch {
    return NextResponse.json({ products: [], categories: [], brands: [] });
  }
}
