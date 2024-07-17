import { CheckCircle, HomeIcon, ImportIcon } from "lucide-react";
import { useContext } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAccessTime } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiRequest from "../lib/apiRequest";

interface SideBarProps {
  contentType: string;
  changeContentType: (type: string) => void;
}

export default function SideBar({ changeContentType }: SideBarProps) {
  const navigate = useNavigate();
  const { updateUser, currentUser, updateToken } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");

      updateUser(null);
      updateToken(null);

      navigate("/auth");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col items-center justify-between bg-[#1d3f58] border-2 border-[#2d5574] shadow-[0px_0px_10px_0px_#2d3748] w-60 rounded-3xl p-8">
      <div className="flex flex-col justify-center items-center gap-8">
        <h1 className="text-2xl text-zinc-300 font-bold text-center">
          Welcome!
        </h1>

        <div className="flex items-center justify-center gap-2">
          <CgProfile className="text-zinc-300 text-4xl" />

          <span className="text-zinc-200 font-bold text-lg">
            {(currentUser as { username: string }).username}
          </span>
        </div>
      </div>

      <div className="min-w-full">
        <ul className="min-w-full flex flex-col items-start gap-4">
          <li className="text-zinc-300 font-bold text-lg flex items-start justify-start">
            <button
              className="flex gap-6"
              onClick={() => changeContentType("allTasks")}
            >
              <HomeIcon size={24} className="text-zinc-300" />
              <span>All Tasks</span>
            </button>
          </li>
          <li className="text-zinc-300 font-bold text-lg flex items-center">
            <button
              className="flex gap-6"
              onClick={() => changeContentType("importantTasks")}
            >
              <ImportIcon size={24} className="text-zinc-300" />
              <span>Important!</span>
            </button>
          </li>
          <li className="text-zinc-300 font-bold text-lg flex items-center">
            <button
              className="flex gap-6"
              onClick={() => changeContentType("completedTasks")}
            >
              <CheckCircle size={24} className="text-zinc-300" />
              <span>Completed</span>
            </button>
          </li>
          <li className="text-zinc-300 font-bold text-lg flex items-center">
            <button
              className="flex gap-6"
              onClick={() => changeContentType("doItNow")}
            >
              <MdOutlineAccessTime size={24} className="text-zinc-300" />
              <span>Do It Now</span>
            </button>
          </li>
        </ul>
      </div>

      <button
        className="bg-zinc-300 text-slate-800 rounded-lg p-2 font-bold border border-zinc-300
          hover:bg-zinc-400/10  hover:text-zinc-300 transition-colors  duration-300 ease-in-out w-full
          "
        onClick={handleLogout}
      >
        Sign Out
      </button>
    </div>
  );
}
