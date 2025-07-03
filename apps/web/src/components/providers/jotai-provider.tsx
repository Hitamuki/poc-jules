"use client"; // Jotai Provider needs to be a client component

import { Provider } from "jotai";
// To enable Jotai Devtools (optional, install 'jotai-devtools' first):
// import { Devtools } from "jotai-devtools"; // For standalone devtools window
// import { useAtomsDevtools } from "jotai-devtools"; // For embedding devtools in your app (less common for simple setup)

// // Optional: A component to conditionally render Jotai Devtools
// const JotaiDevtools = () => {
//   // This hook is for embedding the devtools UI into your application.
//   // For the standalone window, just importing 'jotai-devtools/styles.css' might be needed
//   // and ensuring the Devtools component from 'jotai-devtools' is rendered.
//   // useAtomsDevtools('YourAppNameAtoms'); // This hook itself doesn't render UI.
//   return null; // The <Devtools /> component from 'jotai-devtools' renders the UI.
// };

export function JotaiProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      {/*
        To use the standalone Jotai Devtools window:
        1. Install `jotai-devtools`: `pnpm --filter @bookmark-todo-app/web add -D jotai-devtools`
        2. Add `<Devtools />` here.
        3. Optionally, import 'jotai-devtools/styles.css' if needed, or it might inject styles itself.
      */}
      {/* {process.env.NODE_ENV === 'development' && <Devtools />} */}
      {children}
    </Provider>
  );
}
