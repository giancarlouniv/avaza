"use client";
import { useState } from "react";
import { useEffect } from "react";
import he from "he";

export default function Page() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [openProject, setOpenProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.avaza.com/api/Task?pageSize=1000", {
          method: "GET",
          headers: {
            "Accept": "application/problem+json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AVAZA_TOKEN}`,
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const json = await res.json();
        
        // Group tasks by ProjectTitle, filtering only In Progress tasks
        const groupedTasks = json.Tasks
          .filter(task => task.TaskStatusName === "In Progress")
          .reduce((acc, task) => {
            const projectTitle = task.ProjectTitle || "Undefined Project";
            
            if (!acc[projectTitle]) {
              acc[projectTitle] = [];
            }
            
            acc[projectTitle].push(task);
            
            return acc;
          }, {});

        setData(groupedTasks);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const toggleProject = (projectTitle) => {
    setOpenProject(openProject === projectTitle ? null : projectTitle);
  };

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-8 text-black">Task In Progress</h1>
      
      {error && <p className="text-red-500">{error}</p>}
      
      {data ? (
        <div className="space-y-2">
          {Object.entries(data).map(([projectTitle, tasks]) => (
            <div key={projectTitle} className="border rounded-lg">
              <div 
                onClick={() => toggleProject(projectTitle)}
                className={`p-3 cursor-pointer flex justify-between items-center ${
                  openProject === projectTitle ? 'bg-gray-200' : 'bg-gray-100'
                }`}
              >
                <h2 className="text-xl font-semibold text-black">
                  {projectTitle}
                </h2>
                <span className="text-gray-600">
                  {tasks.length} Task In Progress
                </span>
              </div>
              
              {openProject === projectTitle && (
                <ul className="p-3 space-y-2">
                  {tasks.map((task) => (
                    console.log(task),
                    <li key={task.TaskID} className="bg-white p-3 rounded shadow-sm">
                      <div className="flex justify-between text-black">
                        <div>
                          {task.Title}<br />
                          <small className="text-blue-600 pe-3">
                            {he.decode(task.DescriptionNoHTML || "")}
                          </small>
                          <small className="text-gray-600">Sezione: {task.SectionTitle}</small>
                        </div>
                        <div className="text-right">
                          {task.AssignedToUsers.map((user) => (
                            <div key={user.AssignedToUserIDFK} className="text-sm text-gray-700 whitespace-nowrap">
                              {user.AssignedToFirstname} {user.AssignedToLastname}
                              <br />
                              <p className="text-gray-700">
                                {task.PercentComplete} % completato
                              </p>
                            </div>
                            
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Caricamento...</p>
      )}
    </div>
  );
}