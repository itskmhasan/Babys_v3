import { useFormStatus } from "react-dom";

const SubmitButton = ({ title }) => {
  const { pending } = useFormStatus();
  // console.log("pending", pending);
  return (
    <>
      {pending ? (
        <button
          disabled={pending}
          type="submit"
          className={`cursor-progress md:text-sm leading-5 inline-flex items-center transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-cyan-500 text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-cyan-600 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto`}
        >
          <img src="/loader/spinner.gif" alt="Loading" width={20} height={10} />
          <span className=" ml-2 font-light">Processing</span>
        </button>
      ) : (
        <button
          disabled={pending}
          type="submit"
          className="w-full cursor-pointer text-center py-3 rounded bg-cyan-600 text-white hover:bg-cyan-700 transition-all focus:outline-none my-1"
        >
          {title}
        </button>
      )}
    </>
  );
};

export default SubmitButton;
