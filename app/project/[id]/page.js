"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]); // Stato per le tasks
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // Stato per il task selezionato
  const [isModalOpen, setIsModalOpen] = useState(false); // Stato per la visibilità della modal


  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`https://api.avaza.com/api/Project/${id}`, {
          method: "GET",
          headers: {
            "Accept": "application/problem+json",
            "Authorization": "Bearer 897541-13d88c120c567266ce4c9f9c351426d1f9ae2b85"
          }
        });

        if (!res.ok) {
          throw new Error(`Errore HTTP! Status: ${res.status}`);
        }

        const json = await res.json();
        setProject(json);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await fetch(`https://api.avaza.com/api/Task?ProjectID=${id}&pageSize=1000`, {
          method: "GET",
          headers: {
            "Accept": "application/problem+json",
            "Authorization": "Bearer 897541-13d88c120c567266ce4c9f9c351426d1f9ae2b85"
          }
        });

        if (!res.ok) {
          throw new Error(`Errore HTTP! Status: ${res.status}`);
        }

        const json = await res.json();
        setTasks(json.Tasks); // Supponiamo che l'array delle tasks sia in `Tasks`
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProject();
    fetchTasks();
  }, [id]);

   // Funzione per aprire la modal
   const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Funzione per chiudere la modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="p-3">
      {error && <p className="text-red-500">{error}</p>}

      {project ? (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black">
              {project.Title} - {project.CompanyName}
            </h2>
            <Link href="/data">
              <span className="text-blue-500 hover:underline">Torna alla lista dei progetti</span>
            </Link>
          </div>

          {project.Members.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-black">Membri</h3>
              <ul>
                {project.Members.map((member) => (
                  <li className="text-black" key={member.UserIDFK}>{member.Firstname} {member.Lastname}</li>
                ))}
              </ul>
            </div>
          )}

          {project.Sections.length > 0 && (
            <div className="mt-4">
              <div className="flex space-x-4 overflow-x-auto p-2">
                {project.Sections.map((section) => (
                  <div
                    key={section.SectionID}
                    className="text-black min-w-[300px] p-4 border rounded-lg shadow-sm bg-white max-h-[540px] overflow-y-auto"
                  >
                    <p className="font-semibold text-lg">{section.Title}</p>

                    {/* Lista Tasks */}
                    <div className="mt-2 space-y-1">
                    {tasks
                      .filter((task) => task.SectionIDFK === section.SectionID)
                      .map((task) => (
                        <div
                          key={task.TaskID}
                          className={`text-sm mb-3 border p-2 rounded-lg cursor-pointer 
                            ${task.isCompleteStatus ? 'bg-green-100 text-green-700 border-green-700' : 'bg-yellow-100 text-yellow-700 border-yellow-700'}`} 
                          onClick={() => openModal(task)} // Aggiunto il click per aprire la modal
                        >
                          <div>{task.Title}</div>  
                          <div className="text-xs text-gray-500">
                            <p className="mt-2">
                              Assegnato a:{" "}
                              {task.AssignedToUsers.length > 0 ? (
                                task.AssignedToUsers.map((user, index) => (
                                  <span key={user.AssignedToUserIDFK} className="!text-gray-500">
                                    {user.AssignedToFirstname} {user.AssignedToLastname}
                                    {index < task.AssignedToUsers.length - 1 && ", "}
                                  </span>
                                ))
                              ) : (
                                "-"
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Messaggio se non ci sono tasks */}
                    {tasks.filter((task) => task.SectionIDFK === section.SectionID).length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">Nessuna task disponibile</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Caricamento...</p>
      )}

      {/* Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4" onClick={closeModal}>
        <div className="bg-white p-6 rounded-lg max-w-lg max-h-[80vh] overflow-y-auto shadow-lg relative" onClick={(e) => e.stopPropagation()}>
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>
            ✖
          </button>
          <h2 className="text-xl text-gray-500 font-semibold">{selectedTask.Title}</h2>
          <div className="mt-2 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: selectedTask.Description || "Nessuna descrizione disponibile" }}></div>
        </div>
      </div>
      )}
    </div>
  );
}
