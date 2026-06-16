import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white font-sans">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Aura - The Portable AI Soul
        </h1>
        <p className="text-center mb-12 text-zinc-400 text-lg">
          Sui Overflow 2026 - Walrus Track MVP Demo
        </p>

        <div className="grid text-center lg:grid-cols-2 lg:text-left gap-8">
          <Link
            href="/tavern"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-zinc-700 hover:bg-zinc-800/30"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Tavern Chat{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Aplikasi A: The Ingestion Engine (Dark Mode / Retro). Ekstrak memori di kedai fantasi.
            </p>
          </Link>

          <Link
            href="/zenboard"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-zinc-700 hover:bg-zinc-800/30 bg-zinc-100 text-zinc-900 hover:text-white"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Zen Board{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-70">
              Aplikasi B: The Cross-Agent Recall (Light Mode). Tarik memori untuk produktivitas.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}

