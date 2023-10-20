import { useState } from "react";
import LoginSocialGoogle from "./components/LoginSocialGoogle";
import LoginSocialFacebook from "./components/LoginSocialFacebook";
import LoginSocialApple from "./components/LoginSocialApple";
import jwt_decode from "jwt-decode";

function customDecode(token) {
  try {
    const info = jwt_decode(token);
    return info;
  } catch (error) {
    console.error(error);
    return {};
  }
}

function App() {
  const [tab, setTab] = useState(0);

  const [googleToken, setGoogleToken] = useState();
  const [fbInfo, setFbInfo] = useState();

  const handleChangeTab = (tabIndex) => setTab(tabIndex);

  const decodeGoogleToken = customDecode(googleToken);

  const handleLogoutFacebook = () => {
    if (window.FB) {
      window.FB.logout(function (response) {
        // Person is now logged out
      });
    }
  };
  console.log("@@fbInfo", fbInfo);
  return (
    <div className="p-[20px]">
      <div className="flex">
        <div
          onClick={() => handleChangeTab(0)}
          className="text-blue-400 cursor-pointer hover:underline"
        >
          Demo Sign in Google
        </div>
        <span className="mx-[12px]">|</span>
        <div
          onClick={() => handleChangeTab(1)}
          className="text-blue-400 cursor-pointer  hover:underline"
        >
          Demo Sign in Facebook
        </div>
        <span className="mx-[12px]">|</span>
        <div
          onClick={() => handleChangeTab(2)}
          className="text-blue-400 cursor-pointer  hover:underline"
        >
          Demo Sign in Apple
        </div>
      </div>
      <div className="mt-[24px] max-w-[250px]">
        {tab === 0 && (
          <div>
            <LoginSocialGoogle
              onResolve={(data) => setGoogleToken(data?.credential)}
            />
            {googleToken && (
              <div>
                <div className="text-[24px] font-bold">Account Info</div>
                <div>
                  <ul>
                    <li>
                      <strong>JWT Token:</strong>
                      <div
                        className="line-clamp-2"
                        style={{ wordBreak: "break-word" }}
                      >{`${googleToken}`}</div>
                    </li>

                    <li>
                      <strong>Name:</strong>
                      {`${decodeGoogleToken?.given_name}${decodeGoogleToken?.family_name}`}
                    </li>
                    <li>
                      <strong>Email:</strong>
                      {`${decodeGoogleToken?.email}`}
                    </li>
                    <li>
                      <strong>Locale:</strong>
                      {decodeGoogleToken?.locale}
                    </li>
                    <li>
                      <strong>Avatar:</strong>
                      <img src={decodeGoogleToken?.picture} />
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 1 && (
          <div>
            <LoginSocialFacebook onResolve={(info) => setFbInfo(info)} />
            {fbInfo && (
              <div>
                <div className="text-[24px] font-bold">Account Info</div>
                <div>
                  <ul>
                    <li>
                      <strong>Access Token:</strong>
                      <div
                        style={{ wordBreak: "break-word" }}
                      >{`${fbInfo?.accessToken}`}</div>
                    </li>
                    <li>
                      <strong>User Id:</strong>
                      {`${fbInfo?.authResponse?.userID}`}
                    </li>
                    <li>
                      <strong>Name:</strong>
                      {`${fbInfo?.first_name} ${fbInfo?.middle_name} ${fbInfo?.last_name}`}
                    </li>
                    <li>
                      <strong>Email:</strong>
                      {fbInfo?.email}
                    </li>

                    <li>
                      <strong>Avatar:</strong>
                      <img src={fbInfo?.picture?.data?.url} />
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {/* <button onClick={() => handleLogoutFacebook()}>Logout </button> */}
          </div>
        )}
        {tab === 2 && <LoginSocialApple />}
      </div>
    </div>
  );
}

export default App;
