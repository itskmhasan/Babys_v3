"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const FALLBACK =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const MiniOfferCarousel = ({ slider = {} }) => {
  const images = [
    slider?.mini_img_one || slider?.first_img,
    slider?.mini_img_two || slider?.second_img,
    slider?.mini_img_three || slider?.third_img,
  ].filter(Boolean);

  if (images.length === 0) return null;

  return (
    <div className="w-full group dark:bg-zinc-900">
      <div className="bg-gray-50 dark:bg-slate-600 h-full transition duration-150 ease-linear shadow overflow-hidden rounded-r-2xl">
        <Swiper
          spaceBetween={10}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`} className="h-auto">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={image || FALLBACK}
                  alt={`Mini carousel ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 34vw, 32vw"
                  quality={100}
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MiniOfferCarousel;
