import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
/* eslint-disable camelcase */

const JS_SRC =
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
const SCRIPT_ID = "apple-login-script";

const _window = window;

const CLIENT_ID = "";

const LoginSocialApple = ({ onReject = () => {}, onResolve = () => {} }) => {
  const scriptNodeRef = useRef();
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

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
    scriptNode.current = scriptTag;
    scriptNode &&
      scriptNode.parentNode &&
      scriptNode.parentNode.insertBefore(scriptTag, scriptNode);
    scriptTag.onload = cb;
  };

  const handleResponse = (res) => {
    console.log("@@res", res);
    onResolve({
      provider: "apple",
      res,
    });
  };

  const load = () => {
    if (checkIsExistsSDKScript()) {
      setIsSdkLoaded(true);
    } else {
      insertScript(document, "script", SCRIPT_ID, JS_SRC, () => {
        const options = {
          clientId: CLIENT_ID, // This is the service ID we created.
          scope: "name email", // To tell apple we want the user name and emails fields in the response it sends us.
          redirectURI: "redirect_uri", // As registered along with our service ID
          state: "origin:web", // Any string of your choice that you may use for some logic. It's optional and you may omit it.
          usePopup: true, // Important if we want to capture the data apple sends on the client side.
        };
        _window.AppleID.auth.init(options);
        setIsSdkLoaded(true);
      });
    }
  };

  const loginApple = async () => {
    if (!isSdkLoaded) return;
    if (!_window.AppleID) {
      load();
      onReject("Apple SDK isn't loaded!");
    } else {
      try {
        const response = await _window.AppleID.auth.signIn();
        handleResponse(response);
      } catch (err) {
        onReject({ err });
      }
    }
  };

  return null;
  // return <button onClick={loginApple}>Login With Apple</button>;
};

LoginSocialApple.propTypes = {
  onReject: PropTypes.func,
  onResolve: PropTypes.func,
};

export default LoginSocialApple;
