import apiRequest from "../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export default function SignUp() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser, updateToken } = useContext(AuthContext);

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
      updateToken(response.data.token);

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

  const handleGoogleLoginSuccess = async (responseCred: CredentialResponse) => {
    try {
      const { credential } = responseCred; // Assuming response contains the credential

      const response = await apiRequest.post("/auth/google-login", {
        credential, // Sending credential to the backend
      });

      const { user } = response.data;

      updateUser(user);

      navigate("/home"); // Navigate to home page after successful login
    } catch (err) {
      console.error(err);

      let errorMessage = "An unknown error occurred.";

      if (err instanceof Error) {
        errorMessage = err.message; // Handle generic error (e.g., network issues)
      } else if (
        (err as { response: { data: { message: string } } }).response?.data
          ?.message
      ) {
        errorMessage = (err as { response: { data: { message: string } } })
          .response.data.message; // Handle API response error
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-5xl min-w-full text-center text-zinc-100 font-semibold pb-4">
          Create Account
        </h1>

        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
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
