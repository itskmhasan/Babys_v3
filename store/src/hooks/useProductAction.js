import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { SidebarContext } from "@context/SidebarContext";
import useAddToCart from "@hooks/useAddToCart";
import { notifyError } from "@utils/toast";
import useUtilsFunction from "@hooks/useUtilsFunction";

export default function useProductAction({
  product,
  attributes,
  globalSetting,
  onCloseModal, // optional for modal flow
  withRouter = false, // if true, enable handleMoreInfo
}) {
  const router = withRouter ? useRouter() : null;
  const { setIsLoading, isLoading } = useContext(SidebarContext) || {};
  const { handleAddItem } = useAddToCart();
  const { getNumber, showingTranslateValue } = useUtilsFunction();

  // States
  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectVariant, setSelectVariant] = useState({});
  const [selectVa, setSelectVa] = useState({});
  const [variantTitle, setVariantTitle] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isReadMore, setIsReadMore] = useState(false);

  const currency = globalSetting?.default_currency || "$";

  // Handle variant & price updates
  useEffect(() => {
    // console.log('value', value, product);
    if (value) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      const res = result?.map(
        ({
          originalPrice,
          price,
          discount,
          quantity,
          barcode,
          sku,
          productId,
          image,
          ...rest
        }) => ({
          ...rest,
        })
      );

      const filterKey = Object.keys(Object.assign({}, ...res));
      const selectVar = filterKey?.reduce(
        (obj, key) => ({ ...obj, [key]: selectVariant[key] }),
        {}
      );
      const newObj = Object.entries(selectVar).reduce(
        (a, [k, v]) => (v ? ((a[k] = v), a) : a),
        {}
      );

      const result2 = result?.find((v) =>
        Object.keys(newObj).every((k) => newObj[k] === v[k])
      );

      // console.log("result2", result2);

      if (result.length <= 0 || result2 === undefined) return setStock(0);

      setVariants(result);
      setSelectVariant(result2);
      setSelectVa(result2);
      setSelectedImage(result2?.image);
      setStock(result2?.quantity);
      const price = getNumber(result2?.price);
      const originalPrice = getNumber(result2?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    } else if (product?.variants?.length > 0) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      setVariants(result);
      setStock(product.variants[0]?.quantity);
      setSelectVariant(product.variants[0]);
      setSelectVa(product.variants[0]);
      setSelectedImage(product.variants[0]?.image);
      const price = getNumber(product.variants[0]?.price);
      const originalPrice = getNumber(product.variants[0]?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    } else {
      setStock(product?.stock);
      setSelectedImage(product?.image[0]);
      const price = getNumber(product?.prices?.price);
      const originalPrice = getNumber(product?.prices?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    }
  }, [
    product?.prices?.discount,
    product?.prices?.originalPrice,
    product?.prices?.price,
    product?.stock,
    product?.variants,
    selectVa,
    selectVariant,
    value,
  ]);

  // Handle variant title mapping
  useEffect(() => {
    if (!product?.variants || !attributes) return;
    const res = Object.keys(Object.assign({}, ...product?.variants));
    const varTitle = attributes?.filter((att) => res.includes(att?._id));
    setVariantTitle(varTitle?.sort());
  }, [variants, attributes, product?.variants]);

  // Add to cart
  const handleAddToCart = () => {
    if (product?.variants?.length === 1 && product?.variants[0].quantity < 1)
      return notifyError("Insufficient stock");
    if (stock <= 0) return notifyError("Insufficient stock");

    const selectedVariantName = variantTitle
      ?.map((att) =>
        att?.variants?.find((v) => v._id === selectVariant[att._id])
      )
      .map((el) => showingTranslateValue(el?.name));

    if (
      product?.variants.map(
        (variant) =>
          Object.entries(variant).sort().toString() ===
          Object.entries(selectVariant).sort().toString()
      )
    ) {
      const { variants, categories, description, ...updatedProduct } = product;
      const newItem = {
        ...updatedProduct,
        id:
          product?.variants.length <= 0
            ? product._id
            : product._id +
              "-" +
              variantTitle?.map((att) => selectVariant[att._id]).join("-"),
        title:
          product?.variants.length <= 0
            ? showingTranslateValue(product.title)
            : showingTranslateValue(product.title) + "-" + selectedVariantName,
        image: selectedImage,
        variant: selectVariant || {},
        price:
          product.variants.length === 0
            ? getNumber(product.prices.price)
            : getNumber(price),
        originalPrice:
          product.variants.length === 0
            ? getNumber(product.prices.originalPrice)
            : getNumber(originalPrice),
      };

      handleAddItem(newItem);
    } else {
      return notifyError("Please select all variant first!");
    }
  };

  // Optional for modal/product detail routing
  const handleMoreInfo = (slug) => {
    if (!withRouter) return;
    if (onCloseModal) onCloseModal();
    router.push(`/product/${slug}`);
    setIsLoading?.(!isLoading);
  };

  const category_name = showingTranslateValue(product?.category?.name)
    ?.toLowerCase()
    ?.replace(/[^A-Z0-9]+/gi, "-");

  return {
    // state
    value,
    setValue,
    price,
    stock,
    discount,
    isReadMore,
    setIsReadMore,
    selectedImage,
    originalPrice,
    setSelectedImage,
    selectVariant,
    setSelectVariant,
    selectVa,
    setSelectVa,
    variantTitle,
    variants,
    currency,
    category_name,

    // actions
    handleAddToCart,
    handleMoreInfo,
  };
}
