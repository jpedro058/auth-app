import { useContext } from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

export default function Home() {
  const navigate = useNavigate();

  const { updateUser, currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");

      updateUser(null);

      navigate("/auth");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(currentUser);

  return (
    <div className="flex items-center min-h-screen bg-[#001b2e] p-[5rem]">
      <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-between bg-slate-800 w-60 rounded-3xl p-8">
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="text-2xl text-zinc-300 font-bold text-center">
            Welcome!
          </h1>

          <div className="flex items-center justify-center gap-2">
            <CgProfile className="text-zinc-300 text-4xl" />

            <span className="text-zinc-300 font-bold text-lg">
              {(currentUser as { username: string }).username}
            </span>
          </div>
        </div>
        <button
          className="bg-zinc-300 text-slate-800 rounded-lg p-2 font-bold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
