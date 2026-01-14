//internal import
import UpdateProfile from "./UpdateProfile";
import { getStoreCustomizationSetting } from "@services/SettingServices";

const UpdateProfileRoot = async () => {
  const { storeCustomizationSetting } = await getStoreCustomizationSetting({
    key: "dashboard",
  });

  return (
    <>
      <UpdateProfile storeCustomizationSetting={storeCustomizationSetting} />
    </>
  );
};

export default UpdateProfileRoot;
