import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import Task from "../task";
import { BsPlusCircle } from "react-icons/bs";
import AddTask from "../addTask";

interface TaskProps {
  id: string;
  title: string;
  content: string;
  date: string;
  complete: boolean;
  important: boolean;
  token: string;
  userId: string;
}

export default function CompletedTasks({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateTasks, setUpdateTasks] = useState(false);
  const [tasks, setTasks] = useState({ tasks: [] as TaskProps[] });

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await apiRequest.get("/task/display/completed", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token && token.replace(/"/g, "")}`,
        },
      });

      setTasks(response.data);
    };

    fetchTasks();
  }, [isModalOpen, updateTasks, token]);

  function openModal() {
    setIsModalOpen(true);
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-zinc-300 font-bold text-center">
          Completed Tasks
        </h1>

        <button>
          <BsPlusCircle
            size={44}
            className="text-zinc-300 
            hover:text-zinc-100 transition-colors duration-300 ease-out"
            onClick={openModal}
          />
        </button>
      </div>

      <div className="flex items-center flex-wrap gap-4">
        {tasks.tasks.map((task) => (
          <Task
            id={task.id}
            title={task.title}
            content={task.content}
            date={task.date}
            complete={task.complete}
            important={task.important}
            setUpdateTasks={setUpdateTasks}
            userId={userId}
          />
        ))}

        <div
          onClick={openModal}
          className="flex flex-col justify-center items-center h-[250px] w-[350px] rounded-[10px] bg-[#264c6e43] border-2 border-[#2d5574] cursor-pointer"
        >
          <button>
            <BsPlusCircle
              size={64}
              className="text-zinc-300/90
            hover:text-zinc-100 transition-colors duration-300 ease-out"
            />
          </button>
        </div>
      </div>

      <div>
        {isModalOpen && (
          <AddTask setIsModalOpen={setIsModalOpen} userId={userId} />
        )}
      </div>
    </div>
  );
}
