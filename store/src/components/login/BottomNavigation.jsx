import Link from "next/link";
import { ImFacebook, ImGithub, ImGoogle } from "react-icons/im";
import { Button } from "@components/ui/button";
import { useSetting } from "@context/SettingContext";

const BottomNavigation = ({ or, route, desc, pageName, loginTitle }) => {
  const { storeSetting } = useSetting() || {};

  const isEnabled = (value) =>
    value === true || value === 1 || value === "1" || value === "true";

  const showGoogle = isEnabled(storeSetting?.google_login_status);
  const showFacebook = isEnabled(storeSetting?.facebook_login_status);
  const showGithub = isEnabled(storeSetting?.github_login_status);
  const hasSocialLogin = showGoogle || showFacebook || showGithub;

  const buttonStyles = `
    text-sm cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center rounded-md focus:outline-none shadow-sm
    px-3 py-4 mb-6 mr-2
  `;

  const startOauthLogin = async (provider) => {
    const callbackUrl = "/user/dashboard";

    try {
      const csrfRes = await fetch("/api/auth/csrf");
      const csrfData = await csrfRes.json();

      if (!csrfData?.csrfToken) return;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/api/auth/signin/${provider}`;

      const csrfTokenInput = document.createElement("input");
      csrfTokenInput.type = "hidden";
      csrfTokenInput.name = "csrfToken";
      csrfTokenInput.value = csrfData.csrfToken;

      const callbackUrlInput = document.createElement("input");
      callbackUrlInput.type = "hidden";
      callbackUrlInput.name = "callbackUrl";
      callbackUrlInput.value = callbackUrl;

      form.appendChild(csrfTokenInput);
      form.appendChild(callbackUrlInput);
      document.body.appendChild(form);
      form.submit();
    } catch {
      // Fallback keeps login functional even if csrf prefetch fails.
      window.location.href = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    }
  };

  return (
    <>
      {or && hasSocialLogin && (
        <div className="my-4 text-center font-medium">
          <div className="after:bg-gray-100 before:bg-gray-100">OR</div>
        </div>
      )}

      {hasSocialLogin && (
        <div className="flex flex-col mb-4">
          {showGoogle && (
            <Button
              onClick={() => startOauthLogin("google")}
              className={buttonStyles + "bg-green-600 text-white hover:bg-green-700"}
            >
              <ImGoogle className="text-2xl" />
              <span className="ml-2">{loginTitle} With Google</span>
            </Button>
          )}

          {showFacebook && (
            <Button
              onClick={() => startOauthLogin("facebook")}
              className={buttonStyles + "bg-blue-500 text-white hover:bg-blue-600"}
            >
              <ImFacebook className="text-2xl" />
              <span className="ml-2">{loginTitle} With Facebook</span>
            </Button>
          )}

          {showGithub && (
            <Button
              onClick={() => startOauthLogin("github")}
              className={buttonStyles + "bg-gray-700 text-white hover:bg-gray-900"}
            >
              <ImGithub className="text-2xl" />
              <span className="ml-2">{loginTitle} With Github</span>
            </Button>
          )}
        </div>
      )}

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
