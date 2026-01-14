import useUtilsFunction from "@/hooks/useUtilsFunction";

const SelectLanguageTwo = ({ handleSelectLanguage, register, language }) => {
  const { languages } = useUtilsFunction();

  return (
    <>
      <select
        name="language"
        {...register(`language`, {
          required: `language is required!`,
        })}
        onChange={(e) => handleSelectLanguage(e.target.value)}
        className="block w-20 h-8 border border-emerald-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:bg-white dark:focus:bg-gray-700"
      >
        {/* If language is an object */}
        <option value={language?.code} defaultChecked hidden>
          {language?.name || language?.code}
        </option>

        {/* Map over languages array */}
        {languages?.map((lang) => (
          <option key={lang._id} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectLanguageTwo;
