import { useState } from "react";
import Login from "../../components/login";
import SignUp from "../../components/sing-up";

export default function Auth() {
  const [isActive, setIsActive] = useState(true);
  const [isTranslated, setIsTranslated] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
    setIsTranslated(!isTranslated);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#001b2e]">
      <div className="relative flex w-[950px] h-[500px] rounded-[40px] bg-[#1d3f58] shadow-[0px_0px_30px_0px_#2d3748] overflow-hidden">
        <div
          className={`flex flex-col justify-center items-center w-[475px] transition-opacity duration-300 ${
            isTranslated ? "opacity-0" : "opacity-100"
          }`}
        >
          {isActive && <Login />}
        </div>

        <div
          className={`flex flex-col justify-center items-center w-[475px] transition-opacity duration-300 ${
            isTranslated ? "opacity-100" : "opacity-0"
          }`}
        >
          {!isActive && <SignUp />}
        </div>

        <div
          className={`absolute top-0 left-0 z-10 h-full w-[475px] bg-[#214666] transform transition-all duration-500 ${
            isTranslated
              ? "translate-x-0 rounded-tr-[35%] rounded-br-[35%]"
              : "translate-x-full rounded-tl-[35%] rounded-bl-[35%]"
          }`}
        >
          {isActive ? (
            <div className="text-center flex flex-col items-center justify-center h-full gap-6">
              <h3 className="text-zinc-200 text-5xl font-semibold">
                Hello, Friend!
              </h3>
              <p className="text-zinc-300 w-[300px]">
                Register with your personal details to use all of the site
                features!
              </p>
              <button
                onClick={handleToggle}
                className="py-2 px-12 bg-transparent text-zinc-200 border border-zinc-200 rounded-xl
                  hover:bg-zinc-200/10 transition-all duration-300 ease-out
                "
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center justify-center h-full gap-6">
              <h3 className="text-zinc-200 text-5xl font-semibold">
                Welcome Back!
              </h3>
              <p className="text-zinc-300 w-[300px]">
                Enter your personal details and start your journey with us!
              </p>
              <button
                onClick={handleToggle}
                className="py-2 px-12 bg-transparent text-zinc-200 border border-zinc-200 rounded-xl
                  hover:bg-zinc-200/10 transition-all duration-300 ease-out
                "
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
