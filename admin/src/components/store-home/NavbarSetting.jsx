import { FiSettings } from "react-icons/fi";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import Uploader from "@/components/image-uploader/Uploader";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import { Button } from "../ui/button";

const NavbarSetting = ({
  register,
  errors,
  footerLogo,
  setFooterLogo,
  footerTopImageOne,
  setFooterTopImageOne,
  footerTopImageTwo,
  setFooterTopImageTwo,
  footerTopImageThree,
  setFooterTopImageThree,
  paymentImage,
  setPaymentImage,
  footerBlock1,
  setFooterBlock1,
  footerBlock2,
  setFooterBlock2,
  footerBlock3,
  setFooterBlock3,
  footerBlock4,
  setFooterBlock4,
  footerSocialLinks,
  setFooterSocialLinks,
  footerPaymentMethod,
  setFooterPaymentMethod,
  footerBottomContact,
  setFooterBottomContact,
  isSave,
  isSubmitting,
}) => {
  const { t } = useTranslation();

  const renderField = (label, name, placeholder) => (
    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <div className="sm:col-span-4">
        <InputAreaTwo
          register={register}
          label="Title"
          name={name}
          type="text"
          placeholder={placeholder}
        />
        <Error errorName={errors[name]} />
      </div>
    </div>
  );

  const renderToggle = (setState, value) => (
    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
        EnableThisBlock
      </label>
      <div className="sm:col-span-4">
        <SwitchToggle title="" handleProcess={setState} processOption={value} name={value} />
      </div>
    </div>
  );

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-12 md:mt-0 mt-10">
      <div className="sticky top-0 z-20 flex justify-end">
        {isSubmitting ? (
          <Button disabled={true} type="button" className="h-10 px-6">
            <img
              src={spinnerLoadingImage}
              alt="Loading"
              width={20}
              height={10}
            />{" "}
            <span className="font-serif ml-2 font-light">{t("Processing")}</span>
          </Button>
        ) : (
          <Button type="submit" className="h-10 px-6 ">
            {isSave ? t("SaveBtn") : t("UpdateBtn")}
          </Button>
        )}
      </div>

      <div className="inline-flex md:text-lg text-base text-gray-800 font-semibold dark:text-gray-400 mb-3">
        <FiSettings className="mt-1 mr-2" /> Footer Settings
      </div>

      <hr className="md:mb-12 mb-3" />

      <div className="xl:px-10 flex-grow scrollbar-hide w-full max-h-full pb-0">
        <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative">
          <strong>Block 1</strong>
        </div>
        <hr className="md:mb-12 mb-3" />
        {renderToggle(setFooterBlock1, footerBlock1)}
        <div
          style={{
            height: footerBlock1 ? "auto" : 0,
            transition: "all 0.5s",
            visibility: !footerBlock1 ? "hidden" : "visible",
            opacity: !footerBlock1 ? "0" : "1",
          }}
        >
          {renderField("Title", "footer_block_one_title", "Company")}
          {renderField("Link 1", "footer_block_one_link_one_title", "About Us")}
          {renderField("Link 1 URL", "footer_block_one_link_one", "Link")}
          {renderField("Link 2", "footer_block_one_link_two_title", "Contact Us")}
          {renderField("Link 2 URL", "footer_block_one_link_two", "Link")}
          {renderField("Link 3", "footer_block_one_link_three_title", "Careers")}
          {renderField("Link 3 URL", "footer_block_one_link_three", "Link")}
          {renderField("Link 4", "footer_block_one_link_four_title", "Latest News")}
          {renderField("Link 4 URL", "footer_block_one_link_four", "Link")}
          {renderField("Link 5", "footer_block_one_link_five_title", "Sitemap")}
          {renderField("Link 5 URL", "footer_block_one_link_five", "Link")}
        </div>

        <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative md:mt-0 mt-24">
          <strong>Block 2</strong>
        </div>
        <hr className="md:mb-12 mb-3" />
        {renderToggle(setFooterBlock2, footerBlock2)}
        <div
          style={{
            height: footerBlock2 ? "auto" : 0,
            transition: "all 0.5s",
            visibility: !footerBlock2 ? "hidden" : "visible",
            opacity: !footerBlock2 ? "0" : "1",
          }}
        >
          {renderField("Title", "footer_block_two_title", "Top Category")}
          {renderField("Link 1", "footer_block_two_link_one_title", "Fish And Meat")}
          {renderField("Link 1 URL", "footer_block_two_link_one", "Link")}
          {renderField("Link 2", "footer_block_two_link_two_title", "Soft Drinks")}
          {renderField("Link 2 URL", "footer_block_two_link_two", "Link")}
          {renderField("Link 3", "footer_block_two_link_three_title", "Baby Care")}
          {renderField("Link 3 URL", "footer_block_two_link_three", "Link")}
          {renderField("Link 4", "footer_block_two_link_four_title", "Beauty And Health")}
          {renderField("Link 4 URL", "footer_block_two_link_four", "Link")}
        </div>

        <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative md:mt-0 mt-24">
          <strong>Block 3</strong>
        </div>
        <hr className="md:mb-12 mb-3" />
        {renderToggle(setFooterBlock3, footerBlock3)}
        <div
          style={{
            height: footerBlock3 ? "auto" : 0,
            transition: "all 0.5s",
            visibility: !footerBlock3 ? "hidden" : "visible",
            opacity: !footerBlock3 ? "0" : "1",
          }}
        >
          {renderField("Title", "footer_block_three_title", "My Account")}
          {renderField("Link 1", "footer_block_three_link_one_title", "Dashboard")}
          {renderField("Link 1 URL", "footer_block_three_link_one", "Link")}
          {renderField("Link 2", "footer_block_three_link_two_title", "My Orders")}
          {renderField("Link 2 URL", "footer_block_three_link_two", "Link")}
          {renderField("Link 3", "footer_block_three_link_three_title", "Recent Orders")}
          {renderField("Link 3 URL", "footer_block_three_link_three", "Link")}
          {renderField("Link 4", "footer_block_three_link_four_title", "Updated Profile")}
          {renderField("Link 4 URL", "footer_block_three_link_four", "Link")}
        </div>

        <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative md:mt-0 mt-24">
          <strong>Block 4</strong>
        </div>
        <hr className="md:mb-12 mb-3" />
        {renderToggle(setFooterBlock4, footerBlock4)}
        <div
          style={{
            height: footerBlock4 ? "auto" : 0,
            transition: "all 0.5s",
            visibility: !footerBlock4 ? "hidden" : "visible",
            opacity: !footerBlock4 ? "0" : "1",
          }}
        >
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              FooterLogo
            </label>
            <div className="sm:col-span-4">
              <Uploader imageUrl={footerLogo} setImageUrl={setFooterLogo} />
            </div>
          </div>

          {renderField("FooterAddress", "footer_block_four_address", "Address")}
          {renderField("Footer About Title", "footer_about_title", "ABOUT US")}

          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Footer Top Image 1
            </label>
            <div className="sm:col-span-4">
              <Uploader
                imageUrl={footerTopImageOne}
                setImageUrl={setFooterTopImageOne}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Footer Top Image 2
            </label>
            <div className="sm:col-span-4">
              <Uploader
                imageUrl={footerTopImageTwo}
                setImageUrl={setFooterTopImageTwo}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Footer Top Image 3
            </label>
            <div className="sm:col-span-4">
              <Uploader
                imageUrl={footerTopImageThree}
                setImageUrl={setFooterTopImageThree}
              />
            </div>
          </div>

          {renderField("FooterPhone", "footer_block_four_phone", "Phone")}
          {renderField("FooterEmail", "footer_block_four_email", "Email")}
          {renderField("Footer Contact Title", "footer_contact_title", "Get in touch")}
          {renderField("Footer Follow Title", "footer_follow_title", "Follow us")}
          {renderField("Footer Payment Title", "footer_payment_title", "We accept")}
        </div>

        <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative mt-24 md:mt-0">
          <strong>SocialLinks</strong>
        </div>
        <hr className="md:mb-12 mb-3" />
        {renderToggle(setFooterSocialLinks, footerSocialLinks)}
        <div
          style={{
            height: footerSocialLinks ? "auto" : 0,
            transition: "all 0.5s",
            visibility: !footerSocialLinks ? "hidden" : "visible",
            opacity: !footerSocialLinks ? "0" : "1",
          }}
        >
          {renderField("Facebook", "social_facebook", "Facebook link")}
          {renderField("Twitter", "social_twitter", "Twitter Link")}
          {renderField("Pinterest", "social_pinterest", "Pinterest Link")}
          {renderField("Linkedin", "social_linkedin", "Linkedin Link")}
          {renderField("WhatsApp", "social_whatsapp", "WhatsApp Link")}
        </div>

        <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative mt-24 md:mt-0">
          <strong>PaymentMethod</strong>
        </div>
        <hr className="md:mb-12 mb-3" />
        {renderToggle(setFooterPaymentMethod, footerPaymentMethod)}
        <div
          style={{
            height: footerPaymentMethod ? "auto" : 0,
            transition: "all 0.5s",
            visibility: !footerPaymentMethod ? "hidden" : "visible",
            opacity: !footerPaymentMethod ? "0" : "1",
          }}
        >
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              PaymentMethod
            </label>
            <div className="sm:col-span-4">
              <Uploader imageUrl={paymentImage} setImageUrl={setPaymentImage} />
            </div>
          </div>
        </div>

        <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative mt-16 md:mt-0">
          <strong>FooterBottomContact</strong>
        </div>
        <hr className="md:mb-12 mb-3" />
        {renderToggle(setFooterBottomContact, footerBottomContact)}
        <div
          style={{
            height: footerBottomContact ? "auto" : 0,
            transition: "all 0.5s",
            visibility: !footerBottomContact ? "hidden" : "visible",
            opacity: !footerBottomContact ? "0" : "1",
          }}
          className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3"
        >
          <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            FooterBottomContact
          </label>
          <div className="sm:col-span-4 mb-20 md:mb-0">
            <InputAreaTwo
              register={register}
              label="Title"
              name="footer_Bottom_Contact"
              type="text"
              placeholder="FooterBottomContact"
            />
            <Error errorName={errors.footer_Bottom_Contact} />
          </div>
        </div>

        {renderField("Footer Copyright Text", "footer_copyright_text", "Copyright {{year}} @")}
        {renderField("Footer Copyright Label", "footer_copyright_label", "Baby's")}
        {renderField("Footer Copyright Link", "footer_copyright_link", "https://babys.com.bd")}
      </div>
    </div>
  );
};

export default NavbarSetting;
