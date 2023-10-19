import { useState } from "react";
import LoginSocialGoogle from "./components/LoginSocialGoogle";
import LoginSocialFacebook from "./components/LoginSocialFacebook";
import LoginSocialApple from "./components/LoginSocialApple";

function App() {
  const [tab, setTab] = useState(0);

  const handleChangeTab = (tabIndex) => setTab(tabIndex);
  return (
    <div className="p-[20px]">
      <div className="flex">
        <div onClick={() => handleChangeTab(0)} className="text-blue-400">
          Demo Sign in Google
        </div>
        <span className="mx-[12px]">|</span>
        <div onClick={() => handleChangeTab(1)} className="text-blue-400">
          Demo Sign in Facebook
        </div>
        <span className="mx-[12px]">|</span>
        <div onClick={() => handleChangeTab(2)} className="text-blue-400">
          Demo Sign in Apple
        </div>
      </div>
      <div className="mt-[24px] max-w-[200px]">
        {tab === 0 && <LoginSocialGoogle />}
        {tab === 1 && <LoginSocialFacebook />}
        {tab === 2 && <LoginSocialApple />}
      </div>
    </div>
  );
}

export default App;
