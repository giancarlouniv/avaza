"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function Timesheets() {
  const [date, setDate] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Users moved to environment variable
  const users = JSON.parse(process.env.NEXT_PUBLIC_USERS);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDate(new Date());
    }
  }, []);

  const formatDate = (date) => date?.toLocaleDateString("sv-SE") || "";

  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const formattedDate = formatDate(date);

      try {
        const res = await fetch(
          `https://api.avaza.com/api/Timesheet?pageSize=1000&EntryDateTo=${formattedDate}&EntryDateFrom=${formattedDate}&Sort=DateCreated&Direction=desc`,
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  const filteredTimesheets = data?.Timesheets.filter((item) =>
    [item.Firstname, item.Lastname, item.ProjectTitle, item.Notes]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const groupedTimesheets = filteredTimesheets?.reduce((acc, item) => {
    const key = `${item.Firstname} ${item.Lastname}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const totalHoursByUser = Object.fromEntries(
    Object.entries(groupedTimesheets || {}).map(([user, timesheets]) => [
      user,
      timesheets.reduce((total, item) => total + parseFloat(item.Duration), 0),
    ])
  );

  // Find users with entries and daily expected hours
  const usersWithEntries = Object.keys(groupedTimesheets || {});
  const missingUsers = search === "" 
    ? users
      .filter(user => !usersWithEntries.includes(user.name))
      .map(user => user.name)
    : [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="w-2/3">
          <h1 className="text-2xl font-bold mb-2 text-black">Lista dei timesheets</h1>
          <input
            type="text"
            placeholder="Cerca per nome, progetto o note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 w-full rounded-lg shadow-sm bg-white dark:text-black"
          />
        </div>
        <div className="w-1/3 flex justify-end">
          {date && <Calendar onChange={setDate} value={date} className="shadow-lg rounded-lg text-black" />}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Caricamento...</p>}

      {/* Show users without timesheet entries */}
      {missingUsers.length > 0 && (
        <div className="mt-10 mb-8 p-4 border rounded-lg bg-red-100 shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-3">❌ Utenti senza ore caricate</h2>
          <ul className="list-disc pl-6">
            {missingUsers.map((user, index) => (
              <li key={index} className="text-gray-700 text-lg">🚫 {user}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {groupedTimesheets && Object.keys(groupedTimesheets).length > 0 ? (
          Object.entries(groupedTimesheets).map(([user, timesheets]) => {
            // Find the daily expected hours for this user
            const userConfig = users.find(u => u.name === user);
            const dailyExpectedHours = userConfig ? userConfig.dailyHours : 8; // Default to 8 if not found
            const totalHours = totalHoursByUser[user];
            const isHoursLessThanExpected = totalHours < dailyExpectedHours;

            return (
              <div key={user} className="p-4 border bg-white rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition-shadow">
                <h2 className="text-xl font-semibold mb-3 dark:text-black">👤 {user}</h2>
                <div className="space-y-2">
                  {timesheets.map((item, index) => (
                    <div key={index} className="p-3 dark:border-black border-b last:border-b-0 flex justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">
                        {item.Duration === 1 ? `⏳ ${item.Duration} ora | 📌 ${item.ProjectTitle}` : `⏳ ${item.Duration} ore | 📌 ${item.ProjectTitle}`}

                        </p>
                        <p className="text-gray-500 text-xs mt-1 pe-2">
                          {item.Notes && item.Notes !== "." ? `📄 ${item.Notes}` : " -- "}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-800 text-sm mb-1">
                          {format(new Date(item.DateCreated), "HH:mm", { locale: it })} 🕒 
                        </p>
                        <p className="text-gray-600 text-sm whitespace-nowrap">
                          {format(new Date(item.DateCreated), "dd/MM/yyyy", { locale: it })} 📅 
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className={`mt-3 font-bold text-end mt-8 ${isHoursLessThanExpected ? 'text-red-600 text-xl' : 'text-gray-700'}`}>
                  🔹 Totale ore: {totalHours}h 
                </p>
              </div>
            );
          })
        ) : (
          !loading && <p className="text-gray-600">Nessun timesheet trovato.</p>
        )}
      </div>
    </div>
  );
}