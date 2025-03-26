"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.avaza.com/api/Project", {
          method: "GET",
          headers: {
            "Accept": "application/problem+json",
            "Authorization": "Bearer 897541-13d88c120c567266ce4c9f9c351426d1f9ae2b85"
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-3 text-black">Lista dei progetti</h1>
      {error && <p>{error}</p>}
  
      <div className="gap-4">
        {data ? (
          data.Projects.map((item) => (
            <div key={item.ProjectID} className="flex border bg-white text-black rounded-lg mb-2 text-center px-3 hover:shadow-lg transition-shadow">
              <Link href={`/project/${item.ProjectID}`} className="flex-1 py-1">
                <h2>{item.Title.toUpperCase()}</h2>
              </Link>
            </div>
          ))
        ) : (
          <p>Caricamento...</p>
        )}
      </div>
    </div>
  );
}
