"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GoogleTagPageView({ tagId }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!tagId || typeof window === "undefined" || !window.gtag) return;

    const query = window.location.search?.replace(/^\?/, "");
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag("config", tagId, {
      page_path: pagePath,
    });
  }, [pathname, tagId]);

  return null;
}
