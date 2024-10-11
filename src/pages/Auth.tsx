import { useState } from "react";
import { Login, Register } from "../contents/index";
import { LuSchool } from "react-icons/lu";
import DashboardImg from "../assets/image/dash.png";

export default function Auth() {
  const [activeAuth, setActiveAuth] = useState<string>("Sign In");

  const handleRegister = () => {
    setActiveAuth("Sign Up");
  };

  const handleLogin = () => {
    setActiveAuth("Sign In");
  };

  const renderContent = () => {
    if (activeAuth === "Sign In") {
      return (
        <div className="">
          <Login onRegister={handleRegister} />
        </div>
      );
    }

    if (activeAuth === "Sign Up") {
      return (
        <div className="">
          <Register onLogin={handleLogin} />
        </div>
      );
    }
  };
  return (
    <div className=" w-full h-[100vh]">
      <div className=" bg-custom-white-1 h-full flex justify-center py-8">
        <div className="w-3/4 bg-white rounded-xl p-5 flex gap-4 items-center relative">
          <div className="flex-1">
            <div className="flex gap-3 items-center absolute top-5 pl-3">
              <LuSchool size={30} color="#0D9485" />
              <div className="leading-4 font-bold">
                <h3>School</h3>
                <h3>Attendances</h3>
              </div>
            </div>
            <h1 className="text-center text-xl font-bold">{activeAuth}</h1>
            {renderContent()}
          </div>
          <div className="w-[45%] bg-custom-green-2 h-full rounded-xl p-5 px-12 content-center">
            <p className="text-xl text-white">
              The simplest way to manage your schools data
            </p>
            <p className="text-xs text-white">
              Enter your credentials to access your account
            </p>
            <img src={DashboardImg} alt="" className="w-full mt-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
