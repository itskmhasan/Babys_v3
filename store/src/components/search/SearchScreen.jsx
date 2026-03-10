"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";

//internal import
import useFilter from "@hooks/useFilter";
import Card from "@components/cta-card/Card";
import ProductCard from "@components/product/ProductCard";
import CategoryCarousel from "@components/carousel/CategoryCarousel";
import { Button } from "@components/ui/button";

const SearchScreen = ({
  products,
  attributes,
  categories,
  currency,
  showAll = false,
  pagination,
}) => {
  const [visibleProduct, setVisibleProduct] = useState(18);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { setSortedField, productData } = useFilter(products);
  const safeProducts = Array.isArray(productData) ? productData : [];
  const paginationEnabled = Boolean(pagination?.enabled);
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = paginationEnabled
    ? pagination?.totalItems || 0
    : safeProducts.length;

  const productList = paginationEnabled
    ? safeProducts
    : showAll
      ? safeProducts
      : safeProducts.slice(0, visibleProduct);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter((page) => Math.abs(page - currentPage) <= 2);

  const buildPageLink = (page) => `${pagination?.basePath || "/shop"}?page=${page}`;

  if (!mounted) return null; // or a skeleton loader

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <div className="flex py-10 lg:py-12">
        <div className="flex w-full">
          <div className="w-full">
            <div className="w-full grid grid-col gap-4 grid-cols-1 2xl:gap-6 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2">
              <Card />
            </div>
            <div className="relative">
              <CategoryCarousel categories={categories} />
            </div>
            {safeProducts.length === 0 ? (
              <div className="mx-auto p-5 my-5">
                <Image
                  className="my-4 mx-auto"
                  src="/no-result.svg"
                  alt="no-result"
                  width={400}
                  height={380}
                />
                <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-center mt-2 font-medium text-gray-600">
                  Sorry, we can not find this product 😞
                </h2>
              </div>
            ) : (
              <div className="flex justify-between my-3 bg-orange-100 border border-gray-100 rounded p-3">
                <h6 className="text-sm">
                  Total <span className="font-bold">{totalItems}</span>{" "}
                  Items Found
                </h6>
                <span className="text-sm">
                  <select
                    onChange={(e) => setSortedField(e.target.value)}
                    className="py-0 text-sm font-medium block w-full rounded border-0 bg-white pr-10 cursor-pointer focus:ring-0"
                  >
                    <option className="px-3" value="All" defaultValue hidden>
                      Sort By Price
                    </option>
                    <option className="px-3" value="Low">
                      Low to High
                    </option>
                    <option className="px-3" value="High">
                      High to Low
                    </option>
                  </select>
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
              {productList.map((product, i) => (
                <ProductCard
                  key={i + 1}
                  product={product}
                  attributes={attributes}
                  currency={currency}
                />
              ))}
            </div>

            {!showAll && !paginationEnabled && safeProducts.length > visibleProduct && (
              <Button
                onClick={() => setVisibleProduct((pre) => pre + 10)}
                variant="create"
                className="w-auto mx-auto md:text-sm leading-5 flex items-center transition ease-in-out duration-300 font-medium text-center justify-center px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 mt-6"
              >
                Load More
              </Button>
            )}

            {paginationEnabled && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                <Link
                  href={buildPageLink(Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage === 1}
                  className={`px-3 py-2 rounded border text-sm ${
                    currentPage === 1
                      ? "pointer-events-none opacity-50 border-gray-200 text-gray-400"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Prev
                </Link>

                {pageNumbers.map((page) => (
                  <Link
                    key={page}
                    href={buildPageLink(page)}
                    className={`px-3 py-2 rounded border text-sm ${
                      page === currentPage
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </Link>
                ))}

                <Link
                  href={buildPageLink(Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded border text-sm ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50 border-gray-200 text-gray-400"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SearchScreen), { ssr: false });
