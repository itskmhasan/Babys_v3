import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import ReactFlagsSelect from "react-flags-select";
import { useTranslation } from "react-i18next";

//internal import
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import useLanguageSubmit from "@/hooks/useLanguageSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import { SelectDropdown } from "../form/selectOption/SelectDropdown";
import { languageList } from "@/utils/data";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

//internal import

const LanguageDrawer = ({ id }) => {
  const {
    form,
    control,
    onSubmit,
    register,
    errors,
    setValue,
    handleSubmit,
    isSubmitting,
  } = useLanguageSubmit(id);

  const { t } = useTranslation();

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title={t("UpdateLanguage")}
            description={t("UpdateLanguageText")}
          />
        ) : (
          <Title title={t("AddLanguage")} description={t("AddLanguageText")} />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Form {...form}>
          <form
            id="language-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                <LabelArea label="Select Language" />
                <div className="col-span-8 sm:col-span-4">
                  {/* Language Code Dropdown */}
                  <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <SelectDropdown
                              items={languageList.map((lang) => ({
                                label: `${lang.flag} ${lang.name} (${lang.code})`,
                                value: lang.code,
                              }))}
                              value={field.value}
                              defaultValue={field.value}
                              onValueChange={(val) => {
                                const selected = languageList.find(
                                  (l) => l.code === val
                                );
                                if (selected) {
                                  setValue("code", selected.code);
                                  setValue("name", selected.name);
                                  setValue("flag", selected.flag);
                                }
                              }}
                              placeholder="Select language"
                              className="w-full"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="ml-[130px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("AddLanguageName")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    name="name"
                    type="text"
                    required={true}
                    register={register}
                    label="Language name"
                    placeholder="Language name"
                  />
                  <Error errorName={errors.name} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                {/* Flag Field */}
                <LabelArea label="Flag" />
                <div className="col-span-8 sm:col-span-4">
                  <FormField
                    control={control}
                    name="flag"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input placeholder="Emoji or URL" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage className="ml-[130px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                {/* Published Switch */}
                <LabelArea label="Published" />
                <div className="col-span-8 sm:col-span-4">
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <SwitchToggle
                              title={""}
                              handleProcess={field.onChange}
                              processOption={field?.value}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="ml-[130px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DrawerButton
              id={id}
              title="Language"
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      </Scrollbars>
    </>
  );
};

export default LanguageDrawer;
