import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash-es";

/* eslint-disable camelcase */

const JS_SRC = "https://connect.facebook.net/en_US/sdk.js";
const SCRIPT_ID = "facebook-jssdk";

// const FACEBOOK_APP_ID = '';

const FACEBOOK_APP_ID = "650450503866561";

export const FacebookIcon = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
    >
      <linearGradient
        id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
        x1="9.993"
        x2="40.615"
        y1="9.993"
        y2="40.615"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#2aa4f4"></stop>
        <stop offset="1" stopColor="#007ad9"></stop>
      </linearGradient>
      <path
        fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
        d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
      ></path>
      <path
        fill="#fff"
        d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
      ></path>
    </svg>
  );
};

FacebookIcon.propTypes = {
  className: PropTypes.any,
};

const LoginSocialFacebook = ({
  onReject = () => {},
  onResolve = () => {},
  // appId,
  children,
  className,
}) => {
  const scriptNodeRef = useRef();
  const [provider, setProvider] = useState();
  const [isLoadingProvider, setIsLoadingProvider] = useState(false);

  useEffect(
    () => () => {
      if (scriptNodeRef.current) scriptNodeRef.current.remove();
    },
    []
  );

  const checkIsExistsSDKScript = () => {
    return !!document.getElementById(SCRIPT_ID);
  };

  const insertScript = (cb = () => {}) => {
    const scriptTag = document.createElement("script");
    scriptTag.id = SCRIPT_ID;
    scriptTag.src = JS_SRC;
    scriptTag.async = true;
    scriptTag.defer = true;
    const scriptNode = document.getElementsByTagName("script")[0];
    scriptNode &&
      scriptNode.parentNode &&
      scriptNode.parentNode.insertBefore(scriptTag, scriptNode);
    scriptTag.onload = cb;
  };

  const handleResponse = (response) => {
    if (response.authResponse) {
      onResolve(response);
    } else {
      onReject(response);
    }
  };

  const initFbSDK = (appId, onLoaded) => {
    window.fbAsyncInit = function () {
      // <!-- Initialize the SDK with your app and the Graph API version for your app -->
      window.FB &&
        window.FB.init({
          appId,
          cookie: true, // Enable cookies to allow the server to access the session.
          xfbml: true, // Parse social plugins on this webpage.
          version: "v18.0",
        });
      onLoaded();
      let fbRoot = document.getElementById("fb-root");
      if (!fbRoot) {
        fbRoot = document.createElement("div");
        fbRoot.id = "fb-root";
        document.body.appendChild(fbRoot);
      }
      scriptNodeRef.current = fbRoot;
    };
  };

  const getProvider = async () => {
    setIsLoadingProvider(true);
    try {
      const result = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            clientId: FACEBOOK_APP_ID,
          });
        }, 1000);
      });
      setProvider(result);
      return result;
    } catch (error) {
      onReject("Can't get provider");
    } finally {
      setIsLoadingProvider(false);
    }
  };

  const load = (appId, onLoaded = () => {}) => {
    const isExistSDKScript = checkIsExistsSDKScript();
    if (!isExistSDKScript) {
      insertScript(() => initFbSDK(appId, onLoaded));
    }
  };

  const login = async () => {
    let newProvider = provider;
    if (isEmpty(provider)) {
      newProvider = await getProvider();
    }
    const appId = newProvider?.clientId;
    if (!window.FB) {
      load(appId, () => {
        window.FB.login(handleResponse, {
          scope: "email,public_profile",
          return_scopes: true,
        });
      });
    } else {
      window.FB.login(handleResponse, {
        scope: "email,public_profile",
        return_scopes: true,
      });
    }
  };

  const handleClick = () => {
    login();
  };

  return (
    <>
      <button className={className} type="button" onClick={handleClick}>
        {isLoadingProvider ? "Loading..." : children}
      </button>
    </>
  );
};

LoginSocialFacebook.propTypes = {
  appId: PropTypes.any,
  children: PropTypes.any,
  className: PropTypes.any,
  isOnlyGetToken: PropTypes.bool,
  onReject: PropTypes.func,
  onResolve: PropTypes.func,
  useConfirm: PropTypes.bool,
};

export default LoginSocialFacebook;
