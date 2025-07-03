// import Image from "next/image";
import { Button } from "@bookmark-todo-app/ui"; // Corrected import path
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to&nbsp;
          <code className="font-mono font-bold">Bookmark ToDo App</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-24 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none lg:h-auto">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <span className="font-bold text-xl">Jules</span>
            {/* <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            /> */}
          </a>
        </div>
      </div>

      <div className="relative z-[-1] flex place-items-center text-6xl sm:text-8xl font-bold my-12
        before:absolute before:h-[150px] sm:before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full
        before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-['']
        after:absolute after:-z-20 after:h-[90px] sm:after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic
        after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-['']
        before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10
        after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40">
        <h1>🚀</h1>
      </div>

      <div className="mb-16 sm:mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 gap-4">
        <Link
          href="/dashboard" // Replace with actual link
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 block"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Dashboard{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-60">
            View your main dashboard. (Coming Soon!)
          </p>
        </Link>
        <Button variant="outline" size="lg" className="m-auto" onClick={() => alert('Shadcn Button Clicked!')}>
           Shadcn Button Example
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Start building your awesome PWA!
      </p>
    </main>
  );
}
