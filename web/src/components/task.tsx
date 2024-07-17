import { Edit3, Trash2 } from "lucide-react";
import { PiStarThin } from "react-icons/pi";
import apiRequest from "../lib/apiRequest";
import { useState } from "react";
import EditTask from "./editTask";

interface TaskProps {
  id: string;
  title: string;
  content: string;
  date: string;
  complete: boolean;
  important: boolean;
  setUpdateTasks: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  token: string;
}

export default function Task({
  id,
  title,
  content,
  date,
  complete,
  important,
  setUpdateTasks,
  userId,
  token,
}: TaskProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  async function handleDelete() {
    console.log("Delete Task", token, userId);
    try {
      await apiRequest.delete(`/task/remove/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token && token.replace(/"/g, "")}`,
        },

        data: {
          userId,
        },
      });

      setUpdateTasks(true);
    } catch (error) {
      console.log(error);
    }
  }

  function openModal() {
    setIsModalOpen(true);
  }

  async function handleCompleted() {
    complete = !complete;

    try {
      await apiRequest.put(
        `/task/edit/${id}`,
        {
          userId,
          title,
          content,
          date,
          complete,
          important,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token && token.replace(/"/g, "")}`,
          },
        }
      );

      setUpdateTasks(true);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      key={id}
      className="flex flex-col justify-between gap-4 h-[250px] w-[350px] rounded-[10px] bg-[#264d6e] border-2 border-[#2d5574]  p-4"
    >
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <h2 className="text-zinc-200 text-xl font-semibold">
            {title.length > 31 ? title.slice(0, 31) + "..." : title}
          </h2>
          {important && <PiStarThin size={24} className="text-zinc-300" />}
        </div>

        <p className="text-sm max-h-[90px] text-zinc-300 overflow-y-scroll text-ellipsis">
          {content?.length > 100 ? content.slice(0, 100) + "..." : content}
        </p>
      </div>

      <div className="space-y-2">
        <span className="text-zinc-200 text-xs font-bold">
          {date?.slice(0, 10)}
        </span>
        <div className="flex items-center justify-between">
          <button
            onClick={handleCompleted}
            className="bg-zinc-300 text-slate-800 rounded-full px-4 py-1.5 font-bold border border-zinc-300 hover:bg-zinc-400/10 hover:text-zinc-300 transition-colors duration-300 ease-in-out"
          >
            {complete ? "Completed" : "Incomplete"}
          </button>

          <div className="flex items-center justify-center gap-2.5">
            <button>
              <Edit3
                size={24}
                className="text-zinc-300 hover:text-zinc-100 transition-colors duration-300 ease-out"
                onClick={openModal}
              />
            </button>

            <button>
              <Trash2
                size={24}
                className="text-zinc-300 hover:text-zinc-100 transition-colors duration-300 ease-out"
                onClick={handleDelete}
              />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EditTask
          setIsModalOpen={setIsModalOpen}
          userId={userId}
          id={id}
          title={title}
          content={content}
          date={date}
          complete={complete}
          important={important}
          setUpdateTasks={setUpdateTasks}
          token={token}
        />
      )}
    </div>
  );
}
