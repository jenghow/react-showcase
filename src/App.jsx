import React, { useState } from "react";
import { Header } from "./components/header.jsx";
import { Sidebar, DEFAULT_MENU } from "./components/sidebar.jsx";
import { AppRoutes } from "./routes.jsx";

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [openMenuId, setOpenMenuId] = useState("projects");

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      <Header />
      <div className="flex w-full flex-row">
        <Sidebar
          collapsed={sidebarCollapsed}
          toggleCollapsed={() => setSidebarCollapsed((v) => !v)}
          menu={DEFAULT_MENU}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
        />
        <main
          className={[
            "min-h-[calc(100vh-4rem)] flex-1 overflow-y-auto bg-neutral-50",
            sidebarCollapsed ? "px-4 sm:px-6" : "px-6 sm:px-8",
          ].join(" ")}
        >
          <div className="py-6">
            <AppRoutes />
            {/* <h1 className="mb-4 text-2xl font-semibold tracking-tight">Welcome</h1>
            <p className="mb-6 max-w-3xl text-neutral-600">
              Body uses full browser width minus the sidebar. Header and sidebar are separated into
              components and imported into <code>App.jsx</code>.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <section key={i} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <h2 className="mb-2 font-medium">Card {i + 1}</h2>
                  <p className="text-sm text-neutral-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vehicula, nibh nec
                    ultricies tincidunt, urna arcu pulvinar mi, et convallis mi dui quis libero.
                  </p>
                </section>
              ))}
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}
