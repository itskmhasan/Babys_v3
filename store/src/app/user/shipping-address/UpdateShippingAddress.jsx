"use client";

import { useActionState, useEffect, useState } from "react";

//internal imports

import Error from "@components/form/Error";
import { countries } from "@utils/countries";
import ErrorTwo from "@components/form/ErrorTwo";
import { getUserSession } from "@lib/auth-client";
import useCustomToast from "@hooks/useCustomToast";
import InputAreaTwo from "@components/form/InputAreaTwo";
import SelectOption from "@components/form/SelectOption";
import SubmitButton from "@components/user-dashboard/SubmitButton";
import { addShippingAddress } from "@services/ServerActionServices";

const UpdateShippingAddress = ({ shippingAddress, error }) => {
  const userInfo = getUserSession();
  const [state, formAction] = useActionState(
    addShippingAddress.bind(null, userInfo),
    undefined
  );

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedValue, setSelectedValue] = useState({
    country: shippingAddress?.country || "",
    city: shippingAddress?.city || "",
    area: shippingAddress?.area || "",
  });

  //   console.log("shippingAddress", shippingAddress);

  const handleInputChange = (name, value) => {
    setSelectedValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "country") {
      const result = countries?.find(
        (country) => country?.name === value
      ).cities;
      setCities(result);
      setAreas([]);
    }
    if (name === "city") {
      const result = cities?.find((city) => city?.name === value).areas;
      setAreas(result);
    }
  };

  const { formRef } = useCustomToast(state);

  useEffect(() => {
    if (shippingAddress) {
      const element = countries?.find(
        (country) => country?.name === shippingAddress?.country
      )?.cities;
      setCities(element);
      const result = element?.find(
        (city) => city?.name === shippingAddress?.city
      )?.areas;
      setAreas(result);
    }
  }, [shippingAddress]);

  // console.log("selectedValue", selectedValue, "state", state);

  return (
    <div className="max-w-screen-2xl">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h2 className="text-xl font-semibold mb-5">
              Update Shipping Address
            </h2>
          </div>
        </div>
      </div>
      <form ref={formRef} action={formAction}>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="bg-white shadow sm:rounded-lg py-4 px-2">
            <div className="mt-10 sm:mt-0">
              <div className="md:grid-cols-6 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="lg:mt-6 mt-4">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <InputAreaTwo
                          // register={register}
                          label="Full Name"
                          name="name"
                          type="text"
                          defaultValue={shippingAddress?.name}
                          placeholder="Input your full name"
                        />

                        <Error errorName={state?.errors?.name?.join(" ")} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputAreaTwo
                          // register={register}
                          label="Full Address"
                          name="address"
                          type="text"
                          defaultValue={shippingAddress?.address}
                          placeholder="Input your full address"
                        />

                        <Error errorName={state?.errors?.address?.join(" ")} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputAreaTwo
                          // register={register}
                          label="Contact"
                          name="contact"
                          type="tel"
                          defaultValue={shippingAddress?.contact}
                          placeholder="Phone/Mobile"
                        />

                        <ErrorTwo errors={state?.errors?.contact} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <SelectOption
                          name="country"
                          label="Country"
                          options={countries?.map((country) => country?.name)}
                          onChange={handleInputChange}
                          value={selectedValue?.country || ""}
                        />
                        <Error errorName={state?.errors?.country?.join(" ")} />

                        {/* passing country value */}
                        <div className="form-group hidden">
                          <InputAreaTwo
                            label="country"
                            name="country"
                            type="text"
                            defaultValue={selectedValue.country}
                            placeholder="country"
                            readOnly={true}
                          />
                        </div>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <SelectOption
                          name="city"
                          label="City"
                          options={cities?.map((city) => city?.name)}
                          onChange={handleInputChange}
                          value={selectedValue?.city || ""}
                        />
                        <Error errorName={state?.errors?.city?.join(" ")} />

                        {/* passing city value */}
                        <div className="form-group hidden">
                          <InputAreaTwo
                            label="city"
                            name="city"
                            type="text"
                            defaultValue={selectedValue.country}
                            placeholder="city"
                            readOnly={true}
                          />
                        </div>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <SelectOption
                          name="area"
                          label="Area"
                          options={areas}
                          onChange={handleInputChange}
                          value={selectedValue?.area || ""}
                        />
                        <Error errorName={state?.errors?.area?.join(" ")} />

                        {/* passing area value */}
                        <div className="form-group hidden">
                          <InputAreaTwo
                            label="area"
                            name="area"
                            type="text"
                            defaultValue={selectedValue.country}
                            placeholder="area"
                            readOnly={true}
                          />
                        </div>
                      </div>
                    </div>
                    {/* passing update shipping id value */}
                    <div className="form-group hidden">
                      <InputAreaTwo
                        label="shippingAddressId"
                        name="shippingAddressId"
                        type="text"
                        defaultValue={shippingAddress?._id || ""}
                        placeholder="area"
                        readOnly={true}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3 mt-5 text-right">
                      <SubmitButton title="Update Shipping Address" />
                    </div>
                  </div>
                </div>
              </div>
              {/* passing user _id  */}
              <div className="form-group hidden">
                <InputAreaTwo
                  label="userId"
                  name="userId"
                  type="text"
                  defaultValue={userInfo?._id}
                  placeholder="userId"
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateShippingAddress;
