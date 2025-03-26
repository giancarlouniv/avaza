import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Link href="/data">
          <span className="text-blue-500 hover:text-3xl transition-all duration-200 rounded-lg shadow-md border px-8 py-2">Progetti</span>
        </Link>
      </main>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Link href="/timesheets">
          <span className="text-blue-500 hover:text-3xl transition-all duration-200 rounded-lg shadow-md border px-8 py-2">Timesheets</span>
        </Link>
      </main>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Link href="/tasks">
          <span className="text-blue-500 hover:text-3xl transition-all duration-200 rounded-lg shadow-md border px-8 py-2">Tasks</span>
        </Link>
      </main>

    </div>
  );
}
