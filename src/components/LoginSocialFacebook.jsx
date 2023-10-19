import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FacebookLoginButton } from "react-social-login-buttons";
/* eslint-disable camelcase */

const JS_SRC = "https://connect.facebook.net/en_US/sdk.js";
const SCRIPT_ID = "facebook-jssdk";

const _window = window;

const FACEBOOK_APP_ID = "650450503866561";

const LoginSocialFacebook = ({
  onReject = () => {},
  onResolve = () => {},
  isOnlyGetToken = false,
}) => {
  const scriptNodeRef = useRef();
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    !isSdkLoaded && load();
  }, [isSdkLoaded]);

  useEffect(
    () => () => {
      if (scriptNodeRef.current) scriptNodeRef.current.remove();
    },
    []
  );

  const checkIsExistsSDKScript = () => {
    return !!document.getElementById(SCRIPT_ID);
  };

  const insertScript = (d, s = "script", id, jsSrc, cb = () => {}) => {
    const scriptTag = d.createElement(s);
    scriptTag.id = id;
    scriptTag.src = jsSrc;
    scriptTag.async = true;
    scriptTag.defer = true;
    const scriptNode = document.getElementsByTagName("script")[0];
    scriptNode &&
      scriptNode.parentNode &&
      scriptNode.parentNode.insertBefore(scriptTag, scriptNode);
    scriptTag.onload = cb;
  };

  const handleResponse = (res) => {
    console.log("@@res", res);
    if (isOnlyGetToken) {
      onResolve(res?.authResponse?.accessToken);
    } else {
      _window.FB.api(
        "/me",
        {
          fields:
            "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender",
        },
        function (response) {
          onResolve({
            ...response,
            accessToken: res?.authResponse?.accessToken,
          });
        }
      );
    }
  };

  const initFbSDK = () => {
    const _window = window;
    _window.fbAsyncInit = function () {
      // <!-- Initialize the SDK with your app and the Graph API version for your app -->
      _window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: "v18.0",
      });

      let fbRoot = document.getElementById("fb-root");
      if (!fbRoot) {
        fbRoot = document.createElement("div");
        fbRoot.id = "fb-root";
        document.body.appendChild(fbRoot);
      }
      scriptNodeRef.current = fbRoot;
      setIsSdkLoaded(true);
    };
  };

  const load = () => {
    if (checkIsExistsSDKScript()) {
      setIsSdkLoaded(true);
    } else {
      insertScript(document, "script", SCRIPT_ID, JS_SRC, () => {
        initFbSDK();
      });
    }
  };

  const loginFB = () => {
    if (!isSdkLoaded || isProcessing) return;
    if (!_window.FB) {
      load();
      onReject("Fb isn't loaded!");
      setIsProcessing(false);
    } else {
      setIsProcessing(true);
      _window.FB.login(
        handleResponse
        // { scope: "public_profile, email" }
      );
    }
  };

  return <FacebookLoginButton onClick={loginFB} />;
};

LoginSocialFacebook.propTypes = {
  onReject: PropTypes.func,
  onResolve: PropTypes.func,
};

export default LoginSocialFacebook;
