"use client";
import { useActionState } from "react";

//internal import

import Error from "@components/form/Error";
import { getUserSession } from "@lib/auth-client";
import ErrorTwo from "@components/form/ErrorTwo";
import useCustomToast from "@hooks/useCustomToast";
import useUtilsFunction from "@hooks/useUtilsFunction";
import InputAreaTwo from "@components/form/InputAreaTwo";
import SubmitButton from "@components/user-dashboard/SubmitButton";
import { changePassword } from "@services/ServerActionServices";

const initialState = {
  error: null,
  success: null,
};

const ChangePassword = ({ storeCustomizationSetting }) => {
  const userInfo = getUserSession();
  const { showingTranslateValue } = useUtilsFunction();
  const dashboard = storeCustomizationSetting?.dashboard;

  const [state, formAction] = useActionState(
    changePassword.bind(null, userInfo),
    initialState
  );

  const { formRef } = useCustomToast(state);

  return (
    <>
      <form ref={formRef} action={formAction}>
        <div className="bg-white shadow sm:rounded-lg py-4 px-2">
          <div className="md:grid-cols-6 md:gap-6">
            <div className="md:mt-0 md:col-span-2">
              <div className="lg:mt-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-6">
                    <InputAreaTwo
                      label={showingTranslateValue(dashboard?.user_email)}
                      defaultValue={userInfo?.email}
                      name="email"
                      type="email"
                      placeholder={showingTranslateValue(dashboard?.user_email)}
                      readOnly={true}
                    />
                    <Error errorName={state?.errors?.email?.join(" ")} />
                  </div>
                  <div className="col-span-6 sm:col-span-6">
                    <InputAreaTwo
                      label={showingTranslateValue(dashboard?.current_password)}
                      name="currentPassword"
                      type="password"
                      autocomplete="new-password"
                      placeholder={showingTranslateValue(
                        dashboard?.current_password
                      )}
                    />
                    <Error
                      errorName={state?.errors?.currentPassword?.join(" ")}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-6">
                    <InputAreaTwo
                      label={showingTranslateValue(dashboard?.new_password)}
                      name="newPassword"
                      type="password"
                      autocomplete="new-password"
                      placeholder={showingTranslateValue(
                        dashboard?.new_password
                      )}
                    />
                    <ErrorTwo errors={state?.errors?.newPassword} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 text-right">
            <SubmitButton
              title={showingTranslateValue(dashboard?.change_password)}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
