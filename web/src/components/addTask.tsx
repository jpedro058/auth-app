import { FormEvent } from "react";
import { CgClose } from "react-icons/cg";
import apiRequest from "../lib/apiRequest";

interface AddTaskProps {
  setIsModalOpen: (value: boolean) => void;
  userId: string;
}

export default function AddTask({ setIsModalOpen, userId }: AddTaskProps) {
  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const title = data.get("title");
    const content = data.get("content");
    const date = data.get("date");
    const is_important = data.get("important");
    const is_complete = data.get("complete");

    let important = false;
    let complete = false;

    if (!title || !content || !date) {
      console.log("Please fill all fields");
      return;
    }

    if (is_important === "true") {
      important = true;
    }

    if (is_complete === "true") {
      complete = true;
    }

    try {
      await apiRequest.post("/task/register", {
        userId,
        title,
        content,
        date,
        important,
        complete,
      });

      closeModal();
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]   rounded-[20px] w-[700px] h-[900] flex flex-col gap-4 py-8 px-16 bg-[#1d3f58] border-2 border-[#2d5574] shadow-[0px_0px_10px_0px_#2d3748]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-zinc-300">Add Task</h1>

        <button onClick={closeModal}>
          <CgClose
            size={32}
            className="text-zinc-300/90 
                  hover:text-zinc-100 transition-colors duration-300 ease-out"
          />
        </button>
      </div>

      <form onSubmit={handleAddTask} className="flex flex-col gap-4">
        <input
          name="title"
          type="text"
          placeholder="Title"
          required
          className="bg-[#264d6e] border-2 border-[#2d5574] text-zinc-200 placeholder:text-zinc-200 outline-none rounded-lg p-2"
        />

        <input
          name="content"
          type="text"
          placeholder="Content"
          required
          className="bg-[#264d6e] border-2 border-[#2d5574] text-zinc-200 placeholder:text-zinc-200 outline-none rounded-lg p-2"
        />

        <input
          name="date"
          type="date"
          placeholder="Date"
          required
          className="bg-[#264d6e] border-2 border-[#2d5574] text-zinc-200 placeholder:text-zinc-200 outline-none rounded-lg p-2"
        />

        <div className="flex flex-col gap-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              name="important"
              type="checkbox"
              value={"true"}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-zinc-200 dark:text-gray-300">
              Important
            </span>
          </label>

          <label className="inline-flex items-center cursor-pointer">
            <input
              name="complete"
              type="checkbox"
              className="sr-only peer"
              value={"true"}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium dark:text-gray-300 text-zinc-200">
              Complete
            </span>
          </label>
        </div>

        <button
          className="bg-[#264d6e] border-2 border-[#2d5574] text-zinc-200 placeholder:text-zinc-200 outline-none rounded-lg p-2
                  hover:bg-[#2d5574] hover:text-zinc-300 transition-colors duration-300 ease-in-out
                  "
          type="submit"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
