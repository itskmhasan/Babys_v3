import Image from "next/image";
import Link from "next/link";

//internal import
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getShowingCategory } from "@services/CategoryService";

const FeatureCategory = async () => {
  const { categories, error } = await getShowingCategory();

  // Vibrant color palette for categories
  const colorGradients = [
    "from-pink-400 to-rose-500",
    "from-violet-400 to-purple-500",
    "from-blue-400 to-cyan-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-500",
  ];

  return (
    <>
      {error ? (
        <CMSkeletonTwo count={10} height={20} error={error} loading={false} />
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories[0]?.children?.map((category, i) => (
            <li className="group" key={i + 1}>
              <Link
                href={`/search?category=${encodeURIComponent(category?.name?.en || category?.name)}&_id=${category._id}`}
                className={`relative flex flex-col items-center justify-center w-full h-40 md:h-44 bg-gradient-to-br ${colorGradients[i % colorGradients.length]} rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-2 border border-white/30 overflow-hidden cursor-pointer block`}
              >
                {/* Animated background blur effect */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-all duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-3">
                  <div className="mb-3">
                    {category.icon ? (
                      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-all">
                        <Image
                          src={category?.icon}
                          alt="category"
                          width={45}
                          height={45}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-all">
                        <Image
                          src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                          alt="category"
                          width={45}
                          height={45}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-white font-semibold text-sm md:text-base line-clamp-2">
                      {category?.name?.en || category?.name}
                    </p>
                  </div>
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
