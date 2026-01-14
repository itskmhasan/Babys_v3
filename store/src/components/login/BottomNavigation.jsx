import Link from "next/link";
import { ImFacebook, ImGithub, ImGoogle } from "react-icons/im";
import { signIn } from "next-auth/react";
import { Button } from "@components/ui/button";

const BottomNavigation = ({ or, route, desc, pageName, loginTitle }) => {
  const buttonStyles = `
    text-sm cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center rounded-md focus:outline-none shadow-sm
    px-3 py-4 mb-6 mr-2
  `;

  return (
    <>
      {or && (
        <div className="my-4 text-center font-medium">
          <div className="after:bg-gray-100 before:bg-gray-100">OR</div>
        </div>
      )}

      <div className="flex flex-col mb-4">
        <Button
          onClick={() =>
            signIn("google", { callbackUrl: "/user/dashboard", redirect: true })
          }
          className={
            buttonStyles + "bg-green-600 text-white hover:bg-green-700"
          }
        >
          <ImGoogle className="text-2xl" />
          <span className="ml-2">{loginTitle} With Google</span>
        </Button>
        <Button
          onClick={() =>
            signIn("facebook", {
              callbackUrl: "/user/dashboard",
              redirect: true,
            })
          }
          className={buttonStyles + "bg-blue-500 text-white hover:bg-blue-600"}
        >
          <ImFacebook className="text-2xl" />
          <span className="ml-2">{loginTitle} With Facebook</span>
        </Button>
        <Button
          onClick={() =>
            signIn("github", { callbackUrl: "/user/dashboard", redirect: true })
          }
          className={buttonStyles + "bg-gray-700 text-white hover:bg-gray-900"}
        >
          <ImGithub className="text-2xl" />
          <span className="ml-2">{loginTitle} With Github</span>
        </Button>
      </div>

      <div className="text-center text-sm text-gray-900 mt-4">
        <div className="text-gray-500 mt-2.5">
          {desc ? "Already have an account?" : "Don't have an account?"}
          <Link
            href={route}
            className="text-gray-800 hover:text-cyan-500 font-bold mx-2"
          >
            <span className="capitalize">{pageName}</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BottomNavigation;
