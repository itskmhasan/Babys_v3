//internal imports

import ChangePassword from "./ChangePassword";
import { getStoreCustomizationSetting } from "@services/SettingServices";

const ChangePasswordRoot = async () => {
  const { storeCustomizationSetting } = await getStoreCustomizationSetting();

  return (
    <>
      <ChangePassword storeCustomizationSetting={storeCustomizationSetting} />
    </>
  );
};

export default ChangePasswordRoot;
