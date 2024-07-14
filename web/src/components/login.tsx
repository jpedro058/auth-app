import { useContext, useState } from "react";
import { IoLogoGoogleplus } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiRequest from "../lib/apiRequest";

export default function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await apiRequest.post("/auth/login", {
        username,
        email,
        password,
      });

      updateUser(response.data.user);

      navigate("/home");
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        // Handle generic error (e.g., network issues)
        setError(err.message);
      } else if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response
      ) {
        // Handle API response error
        setError(
          (err as { response: { data: { message: string } } }).response.data
            .message
        );
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[50%] flex flex-col justify-center items-center gap-4">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-5xl text-zinc-100 font-semibold pb-4">Sign In</h1>
        <button
          className="flex items-center px-[20px] gap-4 py-[10px] bg-slate-200  rounded-[10px] text-[#1d3f58] font-bold hover:bg-slate-400
              transition-all duration-300 ease-out
              "
        >
          <IoLogoGoogleplus className="w-[30px] h-[25px]" />
          Login with Google
        </button>

        <p className="text-zinc-300">or use the form below</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center items-center gap-4">
          <input
            name="email"
            type="text"
            placeholder="Username or Email"
            required
            className="w-[300px] h-12 px-[10px] text-zinc-200 bg-[#537692]/40 placeholder:text-zinc-300 rounded-[10px] outline-none caret-slate-300
          "
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-[300px] h-12 px-[10px] text-zinc-200 bg-[#537692]/40 placeholder:text-zinc-300 rounded-[10px] outline-none caret-slate-300"
          />
        </div>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <div className="space-y-4 flex flex-col justify-center items-center ">
          <p className="text-zinc-300">
            <a href="#" className="text-zinc-300 hover:text-slate-200">
              Forgot Password?
            </a>
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="px-12 py-2 bg-slate-200 rounded-[10px] text-[#1d3f58] font-bold
          hover:bg-slate-400 transition-all duration-300 ease-out
          "
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
