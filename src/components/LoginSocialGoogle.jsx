import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash-es";

/* eslint-disable camelcase */

const JS_SRC = "https://accounts.google.com/gsi/client";
const SCRIPT_ID = "google-login";
// const GOOGLE_CLIENT_ID = ''; // TODO
// const GOOGLE_ELEMENT_ID = 'GOOGLE_ELEMENT_ID';
const GOOGLE_CLIENT_ID =
  "508195426573-2pcodpcud5bfiugl2lsnl8ne4s1gl627.apps.googleusercontent.com"; // TODO

export const GoogleIcon = ({ className = "" }) => {
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
      <path
        fill="#fbc02d"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#e53935"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4caf50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1565c0"
        d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  );
};

GoogleIcon.propTypes = {
  className: PropTypes.string,
};

const LoginSocialGoogle = ({
  onReject = () => {},
  onResolve = () => {},
  children,
  className,
}) => {
  const scriptNodeRef = useRef();
  const [instance, setInstance] = useState(null);
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

  const insertScriptGoogle = (cb = () => {}) => {
    const ggScriptTag = document.createElement("script");
    ggScriptTag.id = SCRIPT_ID;
    ggScriptTag.src = JS_SRC;
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

  const handleError = (res) => {
    onReject(res);
  };

  const load = (clientId, onLoaded = () => {}) => {
    const isExistSDKScript = checkIsExistsSDKScript();
    if (!isExistSDKScript) {
      insertScriptGoogle(() => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          callback: handleResponse,
          native_callback: handleResponse,
          error_callback: handleError,
          response_type: "token",
          scope:
            "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        });
        onLoaded(client);
        setInstance(client);
      });
    }
  };

  const getProvider = async () => {
    setIsLoadingProvider(true);
    try {
      const result = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            clientId: GOOGLE_CLIENT_ID,
          });
        }, 1000);
      });
      setProvider(result);
      return result;
    } catch (error) {
      handleError("Can't get provider");
    } finally {
      setIsLoadingProvider(false);
    }
  };
  const login = async () => {
    let newProvider = provider;
    if (isEmpty(provider)) {
      newProvider = await getProvider();
    }
    const clientId = newProvider?.clientId;
    if (!window.google) {
      load(clientId, (client) => {
        client.requestAccessToken();
      });
    } else {
      if (instance) {
        instance.requestAccessToken();
      } else {
        onReject("Google instance not found");
      }
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

LoginSocialGoogle.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
  clientId: PropTypes.any,
  onReject: PropTypes.func,
  onResolve: PropTypes.func,
};

export default LoginSocialGoogle;
