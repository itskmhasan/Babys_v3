import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTelegramPlane,
  FaX,
  FaXTwitter,
  FaPinterestP,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

//internal imports

import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getUserServerSession } from "@lib/auth-server";

const linkClass = "block text-sm text-neutral-600 hover:text-neutral-900 transition-colors";

const Footer = async ({ error, storeCustomizationSetting }) => {
  
  const footer = storeCustomizationSetting?.footer;
  const isEnabled = (value) => value === true || value === "true";

  const showBlock1 = isEnabled(footer?.block1_status);
  const showBlock2 = isEnabled(footer?.block2_status);
  const showBlock3 = isEnabled(footer?.block3_status);
  const showBlock4 = isEnabled(footer?.block4_status);
  const showPaymentMethod = isEnabled(footer?.payment_method_status);
  const showSocialLinks = isEnabled(footer?.social_links_status);
  const showBottomContact = isEnabled(footer?.bottom_contact_status);

  const userInfo = await getUserServerSession();
  const cookieStore = await cookies();
  const lang = cookieStore.get("_lang")?.value || "en";

  // Helper: safely pull a plain string out of a possible {en, de} object.
  // Use this ANYWHERE you need a raw string (href, mailto:, alt text) —
  // never render an object like this directly in JSX.
  const getText = (value, fallback = "") => {
    if (!value) return fallback;
    if (typeof value === "string") return value;
    if (typeof value === "object") return value[lang] || value.en || fallback;
    return fallback;
  };

  const copyrightYear = new Date().getFullYear();
  const copyrightTextRaw =
    footer?.copyright_text?.[lang] ||
    footer?.copyright_text?.en ||
    "Copyright {{year}} @";
  const copyrightTextTemplate = copyrightTextRaw.replace(
    "{{year}}",
    String(copyrightYear)
  );

  const blockOneLinks = [
    { title: footer?.block1_sub_title1, href: footer?.block1_sub_link1 },
    { title: footer?.block1_sub_title2, href: footer?.block1_sub_link2 },
    { title: footer?.block1_sub_title3, href: footer?.block1_sub_link3 },
    { title: footer?.block1_sub_title4, href: footer?.block1_sub_link4 },
    { title: footer?.block1_sub_title5, href: footer?.block1_sub_link5 },
  ].filter((item) => item?.title && item?.href);

  const blockTwoLinks = [
    { title: footer?.block2_sub_title1, href: footer?.block2_sub_link1 },
    { title: footer?.block2_sub_title2, href: footer?.block2_sub_link2 },
    { title: footer?.block2_sub_title3, href: footer?.block2_sub_link3 },
    { title: footer?.block2_sub_title4, href: footer?.block2_sub_link4 },
  ].filter((item) => item?.title && item?.href);

  const blockThreeLinks = [
    { title: footer?.block3_sub_title1, href: footer?.block3_sub_link1 },
    { title: footer?.block3_sub_title2, href: footer?.block3_sub_link2 },
    { title: footer?.block3_sub_title3, href: footer?.block3_sub_link3 },
    { title: footer?.block3_sub_title4, href: footer?.block3_sub_link4 },
  ].filter((item) => item?.title && item?.href);

  return (
    <div className="bg-[#e9edf2]">
      <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 py-10 lg:py-14">

        {/* ---------- Payment title + image (dynamic) ---------- */}
        {showPaymentMethod && (
          <div className="text-center mb-5">
            <h3 className="text-xl font-semibold text-neutral-900">
              <CMSkeletonTwo
                count={1}
                height={16}
                loading={false}
                data={footer?.payment_title || { en: "We Accept EMI" }}
              />
            </h3>
          </div>
        )}

        {showPaymentMethod && (
          <div className="mb-6">
            <div className="relative mx-auto w-full max-w-[1055px] aspect-[1055/140]">
              <Image
                fill
                className="object-contain"
                src={footer?.payment_method_img || "/payment-method/payment-logo.png"}
                alt="payment method"
              />
            </div>
          </div>
        )}

        {/* ---------- 3-image grid (dynamic) ---------- */}
        {showBlock4 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="relative w-full aspect-square min-h-[180px] sm:min-h-[220px] lg:min-h-[240px]">
                <Image
                  fill
                  className="object-contain p-2"
                  src={footer?.top_image_one || footer?.block4_logo || "/logo/logo-color.svg"}
                  alt="footer support"
                />
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="relative w-full aspect-square min-h-[180px] sm:min-h-[220px] lg:min-h-[240px]">
                <Image
                  fill
                  className="object-contain p-2"
                  src={footer?.top_image_two || footer?.payment_method_img || "/payment-method/payment-logo.png"}
                  alt="footer payment"
                />
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="relative w-full aspect-square min-h-[180px] sm:min-h-[220px] lg:min-h-[240px]">
                <Image
                  fill
                  className="object-contain p-2"
                  src={footer?.top_image_three || footer?.block4_logo || "/logo/logo-color.svg"}
                  alt="footer contact"
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------- Main footer grid ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-8">

          {/* ---------- Brand ---------- */}
          <div className="lg:col-span-3 lg:pr-6 lg:border-r lg:border-neutral-300">
            <div className="relative w-32 h-32 mb-6">
              <Image
                fill
                className="object-contain object-left"
                src="/logo/Babys_3D_Bright.png"
                alt="Baby's logo"
              />
            </div>
            <p className="text-sm leading-7 text-neutral-600 mb-4">
              Baby's brings you the best of authentic baby and mother care
              essentials, carefully curated for families across Bangladesh.
            </p>
            <p className="text-sm font-semibold text-neutral-800 mb-4">
              @babys.com.bd
            </p>
            <div className="flex items-center gap-4 text-neutral-800">
              <Link href="#" aria-label="Facebook" className="hover:text-neutral-500">
                <FaFacebookF size={16} />
              </Link>
              <Link href="#" aria-label="Instagram" className="hover:text-neutral-500">
                <FaInstagram size={16} />
              </Link>
              <Link href="#" aria-label="TikTok" className="hover:text-neutral-500">
                <FaTiktok size={16} />
              </Link>
            </div>
          </div>

          {/* ---------- About us + Help & info (stacked) ---------- */}
          <div className="lg:col-span-3 lg:px-6 lg:border-r lg:border-neutral-300">
            <div className="mb-8">
              <h5 className="font-serif text-xl text-neutral-900 mb-5">About us</h5>
              <div className="space-y-3">
                <Link href="/about-us" className={linkClass}>Our story</Link>
                <Link href="/corporate-gifting" className={linkClass}>Corporate gifting</Link>
                <Link href="/loyalty-programme" className={linkClass}>Loyalty programme</Link>
                <Link href="/bulk-order" className={linkClass}>Bulk order</Link>
                <Link href="/contact-us" className={linkClass}>Contact us</Link>
                <Link href="/complaints" className={linkClass}>Complaints</Link>
              </div>
            </div>

          </div>

          {/* ---------- Policies ---------- */}
          <div className="lg:col-span-3 lg:px-6 lg:border-r lg:border-neutral-300">
            <h5 className="font-serif text-xl text-neutral-900 mb-5">Policies</h5>
            <div className="space-y-3 mb-6">
              <Link href="/disclaimer" className={linkClass}>Disclaimer</Link>
              <Link href="/terms-and-conditions" className={linkClass}>Terms and conditions</Link>
              <Link href="/privacy-policy" className={linkClass}>Privacy policy</Link>
              <Link href="/legal-notice" className={linkClass}>Legal notice</Link>
              <Link href="/faq" className={linkClass}>FAQs</Link>
              <Link href="/refund-policy" className={linkClass}>Refunds</Link>
              <Link href="/shipping-policy" className={linkClass}>Shipping</Link>
            </div>
                     </div>

          {/* ---------- Newsletter ---------- */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-neutral-200/60 p-8 text-center">
              <h5 className="font-serif text-2xl text-neutral-900 mb-3">Welcome!</h5>
              <p className="text-sm text-neutral-600 mb-5">
                Sign up for baby care tips and offers in your inbox and get
                10% off your first order.
              </p>
              <form className="relative">
                <input
                  type="email"
                  required
                  value=""
                  placeholder="Enter your email address"
                  className="w-full rounded-full bg-white px-5 py-3 pr-12 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
                >
                  →
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className="border-t border-neutral-300 bg-[#669bd1] text-white">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 py-6">
          <p className="text-sm text-neutral-600 text-center text-white">
            © {new Date().getFullYear()} Baby's. All rights reserved.
          </p>
          <p className="text-xs text-neutral-500 text-center mt-1 text-white">
            Trademark no. BD-H-1-248273 | Copyright No. CRA-21243
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;