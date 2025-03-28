"use client";

import { useEffect, useState } from "react";

export default function Users() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Users moved to environment variable
  const users = JSON.parse(process.env.NEXT_PUBLIC_USERS);


  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.avaza.com/api/UserProfile?pageSize=1000`,
          {
            method: "GET",
            headers: {
              Accept: "application/problem+json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_AVAZA_TOKEN}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
        console.log(json)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    
  return (
    <div className="p-6">
      
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Caricamento...</p>}

        <h1 className="text-2xl font-bold">Users</h1>
        
        {data && (
          <div className="">
            {data.Users.map((user) => (
                console.log(user),
              <div key={user.UserID} className="p-1">
                <h2 className="text-xl font-bold">{user.Name}</h2>
                <p>#{user.UserID}: <span className="" style={{}}>{user.Firstname} {user.Lastname}</span> | {user.Email}</p>
              </div>
            ))}
          </div>
        )}

    
      <div className="space-y-6">
        
      </div>
    </div>
  );
}