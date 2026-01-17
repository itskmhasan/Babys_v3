import React from "react";
import Image from "next/image";
import { FiMail, FiMapPin, FiBell } from "react-icons/fi";

//internal import

import Label from "@components/form/Label";
import { notifySuccess } from "@utils/toast";
import { showingTranslateValue } from "@lib/translate";
import PageHeader from "@components/header/PageHeader";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getStoreCustomizationSetting } from "@services/SettingServices";

export const metadata = {
  title: "Contact Us | Kachabazar",
  description:
    "Get in touch with us! Find our contact information and fill out our contact form.",
  keywords: ["contact", "email", "phone", "location"],
  // You can also add more advanced metadata here
  openGraph: {
    title: "Contact Us | Kachabazar",
    description:
      "Get in touch with us! Find our contact information and fill out our contact form.",
    url: "https://kachabazar-store-nine.vercel.app/contact-us",
    images: [
      {
        url: "https://kachabazar-store-nine.vercel.app/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Contact Us Page",
      },
    ],
  },
};

const ContactUs = async () => {
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();

  const contact_us = storeCustomizationSetting?.contact_us;

  const submitHandler = async () => {
    notifySuccess(
      "your message sent successfully. We will contact you shortly."
    );
  };

  return (
    <div className="">
      <PageHeader headerBg={contact_us?.header_bg} title={contact_us?.title} />

      <div className="bg-white dark:bg-zinc-900">
        <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
          {/* contact promo */}
          <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-3 xl:gap-8 ">
            {error ? (
              <CMSkeletonTwo
                count={10}
                height={20}
                error={error}
                loading={false}
              />
            ) : (
              <div className="border p-10 rounded-lg text-center">
                <span className="flex justify-center text-4xl text-emerald-500 mb-4">
                  <FiMail />
                </span>
                <h5 className="text-xl mb-2 font-bold">
                  {showingTranslateValue(contact_us?.email_box_title)}
                </h5>
                <p className="mb-0 text-base opacity-90 leading-7">
                  <a
                    href={`mailto:${contact_us?.email_box_email}`}
                    className="text-emerald-500"
                  >
                    {showingTranslateValue(contact_us?.email_box_email)}
                  </a>{" "}
                  {showingTranslateValue(contact_us?.email_box_text)}
                </p>
              </div>
            )}

            {error ? (
              <CMSkeletonTwo
                count={10}
                height={20}
                error={error}
                loading={false}
              />
            ) : (
              <div className="border p-10 rounded-lg text-center">
                <span className="flex justify-center text-4xl text-emerald-500 mb-4">
                  <FiBell />
                </span>
                <h5 className="text-xl mb-2 font-bold">
                  {showingTranslateValue(contact_us?.call_box_title)}
                </h5>
                <p className="mb-0 text-base opacity-90 leading-7">
                  <a
                    href={`mailto:${contact_us?.call_box_phone}`}
                    className="text-emerald-500"
                  >
                    {showingTranslateValue(contact_us?.call_box_phone)}
                  </a>{" "}
                  {showingTranslateValue(contact_us?.call_box_text)}
                </p>
              </div>
            )}
            {error ? (
              <CMSkeletonTwo
                count={10}
                height={20}
                error={error}
                loading={false}
              />
            ) : (
              <div className="border p-10 rounded-lg text-center">
                <span className="flex justify-center text-4xl text-emerald-500 mb-4">
                  <FiMapPin />
                </span>
                <h5 className="text-xl mb-2 font-bold">
                  {showingTranslateValue(contact_us?.address_box_title)}
                </h5>
                <p className="mb-0 text-base opacity-90 leading-7">
                  <span>
                    {showingTranslateValue(
                      storeCustomizationSetting?.contact_us
                        ?.address_box_address_one
                    )}
                  </span>{" "}
                  <br />
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us
                      ?.address_box_address_two
                  )}{" "}
                  <br />
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us
                      ?.address_box_address_three
                  )}
                </p>
              </div>
            )}
          </div>

          {/* contact form */}
          <div className="px-0 pt-24 mx-auto items-center flex flex-col md:flex-row w-full justify-between">
            <div className="hidden md:w-full lg:w-5/12 lg:flex flex-col h-full">
              <Image
                width={874}
                height={874}
                src={contact_us?.midLeft_col_img || "/contact-us.png"}
                alt="logo"
                className="block w-auto"
              />
            </div>
            <div className="px-0 pb-2 lg:w-5/12 flex flex-col md:flex-row">
              <form
                // onSubmit={handleSubmit(submitHandler)}
                className="w-full mx-auto flex flex-col justify-center"
              >
                <div className="mb-12">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold  mb-3">
                    <CMSkeletonTwo
                      count={1}
                      height={50}
                      error={error}
                      loading={false}
                      data={contact_us?.form_title}
                    />
                  </h3>
                  <p className="text-base opacity-90 leading-7">
                    <CMSkeletonTwo
                      count={2}
                      height={20}
                      error={error}
                      loading={false}
                      data={contact_us?.form_description}
                    />
                  </p>
                </div>

                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
                    <div className="w-full md:w-1/2 ">
                      <input
                        label="Your Name"
                        name="name"
                        type="text"
                        placeholder="Enter Your Name"
                        className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
                      />
                      {/* <Error errorName={errors.name} /> */}
                    </div>
                    <div className="w-full md:w-1/2 md:ml-2.5 lg:ml-5 mt-2 md:mt-0">
                      <input
                        label="Your Email"
                        name="email"
                        type="email"
                        placeholder="Enter Your Email"
                        className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
                      />
                      {/* <Error errorName={errors.email} /> */}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      label="Subject"
                      name="subject"
                      type="text"
                      placeholder="Enter Your Subject"
                      className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
                    />
                    {/* <Error errorName={errors.subject} /> */}
                  </div>
                  <div className="relative mb-4">
                    <Label label="Message" />
                    <textarea
                      // {...register("message", {
                      //   required: `Message is required!`,
                      // })}
                      name="message"
                      className="px-4 py-3 flex items-center w-full rounded appearance-none opacity-75 transition duration-300 ease-in-out text-sm focus:ring-0 bg-white border border-gray-300 focus:shadow-none focus:outline-none focus:border-gray-500 placeholder-body"
                      autoComplete="off"
                      spellCheck="false"
                      rows="4"
                      placeholder="Write your message here"
                    ></textarea>
                    {/* <Error errorName={errors.message} /> */}
                  </div>
                  <div className="relative">
                    <button
                      data-variant="flat"
                      className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-emerald-500 text-white px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 hover:text-white hover:bg-emerald-600 h-12 mt-1 text-sm lg:text-base w-full sm:w-auto"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
