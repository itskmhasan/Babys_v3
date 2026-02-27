import Image from "next/image";
import Link from "next/link";

//internal import
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getShowingCategory } from "@services/CategoryService";

const FeatureCategory = async () => {
  const { categories, error } = await getShowingCategory();
  const layoutPattern = [
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-2",
    "md:col-span-1 md:row-span-2",
    "md:col-span-1 md:row-span-2",
    "md:col-span-1 md:row-span-1",
  ];

  return (
    <>
      {error ? (
        <CMSkeletonTwo count={10} height={20} error={error} loading={false} />
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:auto-rows-[120px]">
          {categories[0]?.children?.map((category, i) => (
            <li
              className={`group ${layoutPattern[i % layoutPattern.length]}`}
              key={i + 1}
            >
              <Link
                href={`/search?category=${encodeURIComponent(category?.name?.en || category?.name)}&_id=${category._id}`}
                className="relative block w-full h-48 md:h-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white hover:shadow-xl transition-all duration-300 ease-out"
              >
                <Image
                  src={
                    category?.image ||
                    category?.icon ||
                    "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  }
                  alt={category?.name?.en || category?.name || "category"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-semibold text-lg md:text-2xl leading-tight line-clamp-2 drop-shadow-sm">
                    {category?.name?.en || category?.name}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default FeatureCategory;
