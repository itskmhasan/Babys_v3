import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//internal import
import Label from "@/components/form/label/Label";
import Error from "@/components/form/others/Error";
import PageTitle from "@/components/Typography/PageTitle";
import useSettingSubmit from "@/hooks/useSettingSubmit";
import InputArea from "@/components/form/input/InputArea";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import AnimatedContent from "@/components/common/AnimatedContent";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import SettingContainer from "@/components/settings/SettingContainer";
import SelectTimeZone from "@/components/form/selectOption/SelectTimeZone";
import SelectCurrency from "@/components/form/selectOption/SelectCurrency";
import SelectReceiptSize from "@/components/form/selectOption/SelectPrintSize";
import SelectLanguageThree from "@/components/form/selectOption/SelectLanguageThree";
import { Controller } from "react-hook-form";

const Setting = () => {
  const {
    watch,
    errors,
    control,
    register,
    isSave,
    setValue,
    isSubmitting,
    onSubmit,
    handleSubmit,
    enableInvoice,
    setEnableInvoice,
    enableGuestOrder,
    setEnableGuestOrder,
    isAllowAutoTranslation,
    setIsAllowAutoTranslation,
  } = useSettingSubmit();

  const { t } = useTranslation();

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between py-8 gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("GlobalSetting")}</PageTitle>
        </div>
      </div>

      <AnimatedContent>
        <div className="sm:container mb-6 w-full md:p-6 p-4 mx-auto shadow bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <SettingContainer
              isSave={isSave}
              title={t("GlobalSetting")}
              isSubmitting={isSubmitting}
            >
              <div className="flex-grow scrollbar-hide w-full max-h-full">
                {/* General Settings Section */}
                <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg md:p-6">
                  <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                    General Settings
                  </h2>
                  <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    Configure your basic application settings and preferences.
                  </p>

                  <div className="mt-6 space-y-8">
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("NumberOfImagesPerProduct")} />

                      <div className="mt-2 md:mt-0 md:flex-1 sm:col-span-4">
                        <InputAreaTwo
                          required={true}
                          register={register}
                          label={t("NumberOfImagesPerProduct")}
                          name="number_of_image_per_product"
                          type="number"
                          placeholder={t("NumberOfImagesPerProduct")}
                        />
                        <Error errorName={errors.number_of_image_per_product} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("AllowAutoTranslation")} />
                      <div className="mt-2 sm:col-span-4">
                        <SwitchToggle
                          title={""}
                          handleProcess={setIsAllowAutoTranslation}
                          processOption={isAllowAutoTranslation}
                        />
                      </div>
                    </div>

                    <div
                      className={`grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 transition-all duration-600 ${
                        isAllowAutoTranslation
                          ? "opacity-100 visible h-auto"
                          : "opacity-0 invisible h-0 overflow-hidden"
                      }`}
                    >
                      <div>
                        <Label label={t("TranslationSecretKey")} />

                        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                          You can create key from{" "}
                          <a
                            href="https://mymemory.translated.net/doc/keygen.php"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 underline hover:text-indigo-500"
                          >
                            here
                          </a>
                        </p>
                      </div>
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label={t("TranslationSecretKey")}
                          name="translation_key"
                          type="password"
                          placeholder={t("TranslationSecretKey")}
                          autoComplete="new-password"
                          required={isAllowAutoTranslation}
                        />
                        <Error errorName={errors.translation_key} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("DefaultLanguage")} />
                      <div className="mt-2 sm:col-span-4">
                        <SelectLanguageThree
                          required
                          control={control}
                          setValue={setValue}
                          register={register}
                          name="default_language"
                          label={t("DefaultLanguage")}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("DefaultCurrency")} />
                      <div className="mt-2 sm:col-span-4">
                        <SelectCurrency
                          control={control}
                          name="default_currency"
                          label="Currency"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("TimeZone")} />
                      <div className="mt-2 sm:col-span-4">
                        <SelectTimeZone
                          name="default_time_zone"
                          label="Time Zone"
                          control={control}
                        />
                        <Error errorName={errors.default_time_zone} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("DefaultDateFormat")} />
                      <div className="mt-2 sm:col-span-4">
                        <Controller
                          name="default_date_format"
                          control={control}
                          rules={{
                            required: "Default date format is required",
                          }}
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("DefaultDateFormat")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem key="mmddyyyy" value="MM/DD/YYYY">
                                  MM/DD/YYYY
                                </SelectItem>
                                <SelectItem key="dmmyyyy" value="D MMM, YYYY">
                                  D MMM, YYYY
                                </SelectItem>
                                <SelectItem key="mmmdyyyy" value="MMM D, YYYY">
                                  MMM D, YYYY
                                </SelectItem>
                                <SelectItem key="mdyyyy" value="M/D/YYYY">
                                  M/D/YYYY
                                </SelectItem>
                                <SelectItem
                                  key="mmmmdyyyy"
                                  value="MMMM D, YYYY"
                                >
                                  MMMM D, YYYY
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <Error errorName={errors.default_date_format} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("ReceiptSize")} />
                      <div className="mt-2 sm:col-span-4">
                        <SelectReceiptSize
                          label="Receipt Size"
                          control={control}
                          name="receipt_size"
                          required={true}
                        />

                        <Error errorName={errors.receipt_size} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Settings Section */}
                <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg md:p-6 ">
                  <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                    Invoice Settings
                  </h2>
                  <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    Configure invoice generation and email sending preferences.
                  </p>

                  <div className="mt-6 space-y-8">
                    <div className="flex items-center gap-x-3">
                      <SwitchToggle
                        id="enable-invoice"
                        processOption={enableInvoice}
                        handleProcess={setEnableInvoice}
                      />
                      <label className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                        Enable Invoice Send to Customer by email
                      </label>
                    </div>

                    <div
                      className={`transition-all duration-600 ${
                        enableInvoice
                          ? "opacity-100 visible h-auto"
                          : "opacity-0 invisible h-0 overflow-hidden"
                      }`}
                    >
                      <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                        <Label label="From Email" />

                        <div className="mt-2 sm:col-span-4">
                          <InputArea
                            required={enableInvoice}
                            register={register}
                            label="From Email"
                            name="from_email"
                            type="email"
                            placeholder="Enter from email on custom invoice"
                          />
                          <Error errorName={errors.from_email} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information Section */}
                <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg md:p-6 ">
                  <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                    Company Information
                  </h2>
                  <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    Enter your company details that will appear on invoices and
                    receipts.
                  </p>

                  <div className="mt-6 space-y-8">
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label="From Email" />

                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          required={true}
                          register={register}
                          label={t("ShopName")}
                          name="shop_name"
                          type="text"
                          placeholder={t("ShopName")}
                        />
                        <Error errorName={errors.shop_name} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("InvoiceCompanyName")} />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          required={true}
                          register={register}
                          label={t("InvoiceCompanyName")}
                          name="company_name"
                          type="text"
                          placeholder={t("InvoiceCompanyName")}
                        />
                        <Error errorName={errors.company_name} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <label
                        htmlFor="vat_number"
                        className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                      >
                        {t("VatNumber")}
                      </label>
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="VAT Number"
                          name="vat_number"
                          type="text"
                          placeholder="VAT Number"
                        />
                        <Error errorName={errors.vat_number} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("AddressLine")} />

                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          required={true}
                          register={register}
                          label="Address"
                          name="address"
                          type="text"
                          placeholder="Address"
                        />
                        <Error errorName={errors.address} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("PostCode")} />

                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Post Code"
                          name="post_code"
                          type="text"
                          placeholder="Post Code"
                        />
                        <Error errorName={errors.post_code} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg p-6 ">
                  <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                    Contact Information
                  </h2>
                  <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    Provide contact details for customer communication and
                    support.
                  </p>

                  <div className="mt-6 space-y-8">
                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("GlobalContactNumber")} />
                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          required={true}
                          register={register}
                          label="Phone"
                          name="contact"
                          type="text"
                          placeholder="Contact Number"
                        />
                        <Error errorName={errors.contact} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("FooterEmail")} />

                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          required={true}
                          register={register}
                          label="Email"
                          name="email"
                          type="text"
                          placeholder="Email"
                        />
                        <Error errorName={errors.email} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                      <Label label={t("WebSite")} />

                      <div className="mt-2 sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Website"
                          name="website"
                          type="text"
                          placeholder="Web Site"
                        />
                        <Error errorName={errors.website} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SettingContainer>
          </form>
        </div>
      </AnimatedContent>
    </>
  );
};
export default Setting;
