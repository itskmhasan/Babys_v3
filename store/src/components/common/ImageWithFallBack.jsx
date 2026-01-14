"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const fallbackImage =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const ImageWithFallback = ({
  src,
  img,
  fallback = fallbackImage,
  alt = "image",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <>
      {img ? (
        <img
          src={imgSrc}
          onError={() => setImgSrc(fallback)}
          alt={alt}
          {...props}
          className={`object-contain transition duration-150 ease-linear transform group-hover:scale-105 p-2 ${
            props.className || ""
          }`}
          style={{
            objectFit: "contain",
            ...props.style,
          }}
        />
      ) : (
        <Image
          src={imgSrc}
          onError={() => setImgSrc(fallback)}
          alt={alt}
          {...props}
          className={`object-contain transition duration-150 ease-linear transform group-hover:scale-105 p-2 ${
            props.className || ""
          }`}
          style={{
            objectFit: "contain",
            ...props.style,
          }}
        />
      )}
    </>
  );
};

export default ImageWithFallback;
