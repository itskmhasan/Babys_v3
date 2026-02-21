"use client";

import { Input } from "@components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { baseURL, handleResponse } from "@services/CommonService";

const SearchInput = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState({ products: [], categories: [], brands: [] });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const categoriesRef = useRef([]);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    // Fetch categories once and keep locally for fast filtering
    (async () => {
      try {
        const res = await fetch(`${baseURL}/categories/all`);
        if (res.ok) {
          const data = await res.json();
          categoriesRef.current = data || [];
        }
      } catch (err) {
        // ignore
      }
    })();

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchText || searchText.trim().length < 2) {
      setSuggestions({ products: [], categories: [], brands: [] });
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        // products
        const q = encodeURIComponent(searchText.trim());
        const prodRes = await fetch(`${baseURL}/products?title=${q}&page=1&limit=6`);
        let products = [];
        if (prodRes.ok) products = (await prodRes.json()).products || [];

        // categories (filter locally)
        const catMatches = categoriesRef.current
          .filter((c) => {
            const name = c?.name?.en || c?.name || "";
            return name.toLowerCase().includes(searchText.toLowerCase());
          })
          .slice(0, 6);

        // brands: collect unique tags from product suggestions
        const brandsSet = new Set();
        products.forEach((p) => {
          if (Array.isArray(p.tag)) {
            p.tag.forEach((tg) => {
              if (typeof tg === "string" && tg.trim()) brandsSet.add(tg.trim());
            });
          }
        });

        const brands = Array.from(brandsSet).slice(0, 6);

        setSuggestions({ products, categories: catMatches, brands });
        setOpen(true);
      } catch (err) {
        setSuggestions({ products: [], categories: [], brands: [] });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchText]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText) {
      router.push(`/search?query=${encodeURIComponent(searchText)}`);
      setSearchText("");
      setOpen(false);
    } else {
      router.push(`/`);
      setSearchText("");
      setOpen(false);
    }
  };

  const handleProductClick = (product) => {
    router.push(`/product/${product.slug}`);
    setOpen(false);
    setSearchText("");
  };

  const handleCategoryClick = (category) => {
    const name = category?.name?.en || category?.name || "";
    router.push(`/search?category=${encodeURIComponent(name)}&_id=${category._id}`);
    setOpen(false);
    setSearchText("");
  };

  const handleBrandClick = (brand) => {
    router.push(`/search?query=${encodeURIComponent(brand)}`);
    setOpen(false);
    setSearchText("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <form
        onSubmit={handleSearch}
        className="relative pr-12 md:pr-14 bg-white overflow-hidden shadow-sm rounded-md w-full"
      >
        <label className="flex items-center py-0.5">
          <Input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            className="form-input w-full pl-5 appearance-none transition ease-in-out text-sm text-gray-700 font-sans rounded-md h-9 duration-200 bg-white focus:ring-0 outline-none border-none focus:outline-none"
            placeholder="Search for products (e.g. shirt, pant)"
            onFocus={() => {
              if (searchText && searchText.length >= 2 && suggestions.products.length) setOpen(true);
            }}
          />
        </label>
        <button
          aria-label="Search"
          type="submit"
          className="outline-none text-xl text-gray-400 absolute top-0 right-0 end-0 w-12 md:w-14 h-full flex items-center justify-center transition duration-200 ease-in-out hover:text-heading focus:outline-none"
        >
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg z-50 max-h-80 overflow-auto">
          <div className="p-2">
            {loading && <div className="text-sm text-gray-500">Loading...</div>}

            {suggestions.products.length > 0 && (
              <div className="mb-2">
                <h6 className="px-2 text-xs text-gray-500 uppercase">Products</h6>
                <ul>
                  {suggestions.products.map((p) => (
                    <li
                      key={p._id}
                      onClick={() => handleProductClick(p)}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={p.image?.[0] || "/no-image.png"}
                        alt={p?.title?.en || p?.title || "product"}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">{p?.title?.en || p?.title}</div>
                        <div className="text-xs text-gray-500">{p?.category?.name?.en || p?.category?.name}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.categories.length > 0 && (
              <div className="mb-2">
                <h6 className="px-2 text-xs text-gray-500 uppercase">Categories</h6>
                <ul>
                  {suggestions.categories.map((c) => (
                    <li
                      key={c._id}
                      onClick={() => handleCategoryClick(c)}
                      className="p-2 rounded hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                    >
                      {c?.name?.en || c?.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.brands.length > 0 && (
              <div>
                <h6 className="px-2 text-xs text-gray-500 uppercase">Brands</h6>
                <ul className="flex flex-wrap gap-2 p-2">
                  {suggestions.brands.map((b) => (
                    <li
                      key={b}
                      onClick={() => handleBrandClick(b)}
                      className="px-3 py-1 rounded bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.products.length === 0 &&
              suggestions.categories.length === 0 &&
              suggestions.brands.length === 0 && !loading && (
                <div className="p-2 text-sm text-gray-500">No suggestions</div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
