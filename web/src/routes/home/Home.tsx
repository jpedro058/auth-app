import { useState } from "react";
import SideBar from "../../components/sideBar";
import AllTasks from "../../components/sideBarItems/allTasks";
import CompletedTasks from "../../components/sideBarItems/completedTasks";
import DoItNow from "../../components/sideBarItems/doItNow";
import ImportantTasks from "../../components/sideBarItems/importantTasks";

interface HomeProps {
  contentType: string;
}

export default function Home({ contentType }: HomeProps) {
  const [currentContentType, setCurrentContentType] = useState(contentType);

  const changeContentType = (type: string) => {
    setCurrentContentType(type);
  };

  return (
    <div className="flex items-center min-h-screen bg-[#001b2e] p-[2.5rem] gap-8">
      <SideBar
        contentType={currentContentType}
        changeContentType={changeContentType}
      />

      <div className="w-[85%] h-[calc(100vh-5rem)] flex flex-col items-center justify-between bg-[#1d3f58] border-2 border-[#2d5574] shadow-[0px_0px_10px_0px_#2d3748] rounded-3xl p-8">
        {currentContentType === "completedTasks" ? (
          <CompletedTasks />
        ) : currentContentType === "importantTasks" ? (
          <ImportantTasks />
        ) : currentContentType === "doItNow" ? (
          <DoItNow />
        ) : (
          <AllTasks />
        )}
      </div>
    </div>
  );
}
