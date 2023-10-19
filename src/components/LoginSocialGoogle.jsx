import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
/* eslint-disable camelcase */

const JS_SRC = "https://accounts.google.com/gsi/client";
const SCRIPT_ID = "google-login";
const _window = window;
const GOOGLE_CLIENT_ID =
  "508195426573-2pcodpcud5bfiugl2lsnl8ne4s1gl627.apps.googleusercontent.com"; // TODO
const GOOGLE_ELEMENT_ID = "GOOGLE_ELEMENT_ID";

const LoginSocialGoogle = ({
  // onReject = () => {},
  onResolve = () => {},
}) => {
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

  const insertScriptGoogle = (d, s = "script", id, jsSrc, cb = () => {}) => {
    const ggScriptTag = d.createElement(s);
    ggScriptTag.id = id;
    ggScriptTag.src = jsSrc;
    ggScriptTag.async = true;
    ggScriptTag.defer = true;
    const scriptNode = document.getElementsByTagName("script")[0];
    scriptNodeRef.current = ggScriptTag;
    scriptNode &&
      scriptNode.parentNode &&
      scriptNode.parentNode.insertBefore(ggScriptTag, scriptNode);
    ggScriptTag.onload = cb;
  };

  const handleResponse = (res) => {
    onResolve(res);
  };

  const load = () => {
    if (checkIsExistsSDKScript()) {
      setIsSdkLoaded(true);
    } else {
      insertScriptGoogle(document, "script", SCRIPT_ID, JS_SRC, () => {
        _window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleResponse,
        });
        _window.google.accounts.id.renderButton(
          document.getElementById(GOOGLE_ELEMENT_ID),
          {
            theme: "outline",
            size: "large",
            // text: "continue_with",
            locale: "vi",
          } // customization attributes
        );
        setIsSdkLoaded(true);
      });
    }
  };
  return <div id={GOOGLE_ELEMENT_ID}></div>;
};

LoginSocialGoogle.propTypes = {
  onReject: PropTypes.func,
  onResolve: PropTypes.func,
};

export default LoginSocialGoogle;
