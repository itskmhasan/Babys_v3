"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

//internal import

import Label from "@components/form/Label";
import Error from "@components/form/Error";
import useCustomToast from "@hooks/useCustomToast";
import ErrorTwo from "@components/form/ErrorTwo";
import { getUserSession } from "@lib/auth-client";
import InputAreaTwo from "@components/form/InputAreaTwo";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Uploader from "@components/image-uploader/Uploader";
import SubmitButton from "@components/user-dashboard/SubmitButton";
import { updateCustomer } from "@services/ServerActionServices";

const UpdateProfile = ({ storeCustomizationSetting }) => {
  const [imageUrl, setImageUrl] = useState("");
  const { showingTranslateValue } = useUtilsFunction();
  const userInfo = getUserSession();
  const { data: session, update } = useSession();

  const [state, formAction] = useActionState(
    updateCustomer.bind(null, userInfo),
    undefined
  );

  // console.log("userInfo", userInfo);

  const defaultImg = imageUrl ? imageUrl : userInfo?.image;

  // console.log("data", session);

  useEffect(() => {
    if (state?.user) {
      // console.log("update session");
      update({
        ...session,
        user: {
          ...session.user,
          name: state.user.name,
          address: state.user.address,
          phone: state.user.phone,
          image: state.user.image,
        },
      });
      formRef?.current?.reset();
    }
  }, [state?.user]);

  const { formRef } = useCustomToast(state);

  return (
    <>
      <div className="max-w-screen-2xl">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h2 className="text-xl font-semibold mb-5">
                {showingTranslateValue(
                  storeCustomizationSetting?.dashboard?.update_profile
                )}
              </h2>
            </div>
          </div>
        </div>
        <form ref={formRef} action={formAction}>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="bg-white shadow sm:rounded-lg py-4 px-2">
              <div className="space-y-6">
                <div>
                  <Label label="Photo" />
                  <div>
                    <div className="mt-1 flex items-center">
                      <Uploader
                        imageUrl={defaultImg}
                        setImageUrl={setImageUrl}
                      />
                    </div>
                    <ErrorTwo errors={state?.errors?.image} />
                  </div>

                  {/* passing image url to submit form */}
                  <div className="form-group hidden">
                    <InputAreaTwo
                      label="imageUrl"
                      name="imageUrl"
                      type="text"
                      defaultValue={defaultImg}
                      placeholder="imageUrl"
                      readOnly={true}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 sm:mt-0">
                <div className="md:grid-cols-6 md:gap-6">
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="lg:mt-6 mt-4">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <InputAreaTwo
                            // register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.full_name
                            )}
                            name="name"
                            type="text"
                            placeholder={showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.full_name
                            )}
                            defaultValue={userInfo?.name || ""}
                          />

                          <Error errorName={state?.errors?.name?.join(" ")} />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <InputAreaTwo
                            // register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.address
                            )}
                            name="address"
                            type="text"
                            placeholder={showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.address
                            )}
                            defaultValue={userInfo?.address || ""}
                          />

                          <Error
                            errorName={state?.errors?.address?.join(" ")}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <InputAreaTwo
                            // register={register}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.user_phone
                            )}
                            name="phone"
                            type="tel"
                            placeholder={showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.user_phone
                            )}
                            defaultValue={userInfo?.phone || ""}
                          />

                          <ErrorTwo errors={state?.errors?.phone} />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <InputAreaTwo
                            // register={register}
                            readOnly={true}
                            name="email"
                            type="email"
                            defaultValue={userInfo?.email}
                            label={showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.user_email
                            )}
                            placeholder={showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.user_email
                            )}
                          />
                          {/* <Error errorName={errors.email} /> */}
                          <Error errorName={state?.errors?.email?.join(" ")} />
                        </div>
                      </div>

                      <div className="col-span-6 sm:col-span-3 mt-5 text-right">
                        <SubmitButton
                          title={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.update_button
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProfile;
