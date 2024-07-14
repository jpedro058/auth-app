import { IoLogoGoogleplus } from "react-icons/io";
import apiRequest from "../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SignUp() {
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
      const response = await apiRequest.post("/auth/register", {
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
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-5xl min-w-full text-center text-zinc-100 font-semibold pb-4">
          Create Account
        </h1>
        <button
          className="flex items-center px-[20px] gap-4 py-[10px] bg-slate-200  rounded-[10px] text-[#1d3f58] font-bold hover:bg-slate-400
              transition-all duration-300 ease-out
              "
        >
          <IoLogoGoogleplus className="w-[30px] h-[25px]" />
          Login with Google
        </button>
      </div>

      <form
        className="space-y-4 flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-center items-center gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            className="w-[300px] h-12 px-[10px] text-zinc-200 bg-[#537692]/40 placeholder:text-zinc-300 rounded-[10px] outline-none caret-slate-300
          "
          />

          <input
            type="text"
            name="email"
            placeholder="Email"
            className="w-[300px] h-12 px-[10px] text-zinc-200 bg-[#537692]/40 placeholder:text-zinc-300 rounded-[10px] outline-none caret-slate-300
          "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-[300px] h-12 px-[10px] text-zinc-200 bg-[#537692]/40 placeholder:text-zinc-300 rounded-[10px] outline-none caret-slate-300"
          />
        </div>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="px-12 py-2 bg-slate-200 rounded-[10px] text-[#1d3f58] font-bold
        hover:bg-slate-400 transition-all duration-300 ease-out
        "
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
