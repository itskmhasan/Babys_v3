import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const SettingContainer = ({ isSave, title, children, isSubmitting }) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-12 font-sans">
      <div className="col-span-12 md:col-span-12 lg:col-span-12">
        <div className="sticky z-20 flex justify-end align-items-center">
          <Button
            type="submit"
            variant="create"
            className="h-10 px-6"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting
              ? "Progressing"
              : isSave
              ? t("SaveBtn")
              : t("UpdateBtn")}
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default SettingContainer;
