import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IconHome, IconFolder, IconBarChart, IconSettings, IconSidebarCollapse, Dot } from "./icons";

/**
 * JSON-driven Sidebar with router + external link support
 *
 * Menu item shape (examples):
 * {
 *   id: "dashboard",
 *   label: "Dashboard",
 *   to: "/" // or "/dashboard"; optional; defaults to "/${id}"
 *   icon: IconHome
 * }
 * {
 *   id: "projects",
 *   label: "Projects",
 *   icon: IconFolder,
 *   children: [
 *     { id: "active", label: "Active", to: "/projects/active" },
 *     { id: "archived", label: "Archived" } // -> defaults to "/projects/archived"
 *   ]
 * }
 * External links: use an absolute URL in `to` (e.g. "https://docs.example.com")
 */

export const DEFAULT_MENU = [
  { id: "dashboard", label: "Dashboard", to: "/", icon: IconHome },
  { id: "projects", label: "Projects", icon: IconFolder },
  { id: "reports", label: "Reports", to: "/reports", icon: IconBarChart,
    children: [
      { id: "dailyOutput", label: "Daily Output", to: "/reports/dailyoutput" },
      { id: "accumulateOutput", label: "Accumulated", to: "/reports/accumulated" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: IconSettings,
    children: [
      { id: "profile", label: "Profile", to: "/settings/profile" },
      { id: "billing", label: "Billing" },
    ],
  },
  { id: "docs", label: "Docs (External)", to: "https://react.dev", icon: IconFolder },
];

export function Sidebar({ collapsed, toggleCollapsed, menu = DEFAULT_MENU, openMenuId, setOpenMenuId }) {
  const location = useLocation();

  return (
    <aside
      className={[
        "transition-all duration-300 ease-in-out border-r border-neutral-200 bg-white",
        collapsed ? "basis-16 sm:basis-16" : "basis-1/6 sm:basis-1/6",
      ].join(" ")}
    >
      <div className="flex h-16 items-center justify-between px-3">
        {!collapsed ? (
          <span className="text-sm font-semibold tracking-tight">Navigation</span>
        ) : (
          <span className="sr-only">Navigation</span>
        )}
        <button
          onClick={toggleCollapsed}
          className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 hover:bg-neutral-50"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <IconSidebarCollapse collapsed={collapsed} />
        </button>
      </div>

      <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto px-2 pb-4">
        <ul className="space-y-1">
          {menu.map((item) => (
            <li key={item.id}>
              <MenuItem
                item={item}
                collapsed={collapsed}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                currentPath={location.pathname}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function MenuItem({ item, collapsed, openMenuId, setOpenMenuId, currentPath }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isOpen = openMenuId === item.id;

  const headerTo = resolveTo(item);
  const isExternal = isExternalUrl(headerTo);
  const isActive = headerTo && !hasChildren && isPathActive(currentPath, headerTo);

  const onClickHeader = () => {
    if (hasChildren) setOpenMenuId(isOpen ? undefined : item.id);
  };

  const HeaderInner = (
    <>
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200">
        {item.icon ? <item.icon className="h-5 w-5" /> : <Dot className="h-1.5 w-1.5" />}
      </span>
      <span className={collapsed ? "hidden" : "flex-1 truncate text-sm font-medium"}>{item.label}</span>
      {hasChildren && !collapsed && (
        <svg
          className={["h-4 w-4 transition-transform duration-200", isOpen ? "rotate-90" : "rotate-0"].join(" ")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </>
  );

  const headerClass = [
    "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left",
    isActive ? "bg-neutral-100" : "hover:bg-neutral-50",
  ].join(" ");

  return (
    <div>
      {/* Header row: either toggles submenu (if has children) or navigates (link) */}
      {hasChildren ? (
        <button onClick={onClickHeader} className={headerClass} aria-expanded={isOpen}>
          {HeaderInner}
        </button>
      ) : isExternal ? (
        <a href={headerTo} target="_blank" rel="noreferrer" className={headerClass}>
          {HeaderInner}
        </a>
      ) : (
        <Link to={headerTo} className={headerClass}>
          {HeaderInner}
        </Link>
      )}

      {/* One-level submenu */}
      {hasChildren && (
        <div className={["grid transition-[grid-template-rows] duration-200", collapsed ? "grid-rows-[0fr]" : isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"].join(" ")}>
          <div className="overflow-hidden">
            <ul className="mt-1 space-y-1 pl-14 pr-2">
              {item.children.map((child) => {
                const childTo = resolveChildTo(item, child);
                const childExternal = isExternalUrl(childTo);
                const childActive = !childExternal && isPathActive(currentPath, childTo);

                const childClass = [
                  "flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm",
                  childActive ? "bg-neutral-100" : "hover:bg-neutral-50",
                ].join(" ");

                const ChildInner = (
                  <>
                    <span className="truncate">{child.label}</span>
                    <span className="text-xs text-neutral-400">{childExternal ? "↗" : "•"}</span>
                  </>
                );

                return (
                  <li key={child.id}>
                    {childExternal ? (
                      <a href={childTo} target="_blank" rel="noreferrer" className={childClass}>
                        {ChildInner}
                      </a>
                    ) : (
                      <Link to={childTo} className={childClass}>
                        {ChildInner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- helpers ----------
function resolveTo(item) {
  if (!item) return undefined;
  if (typeof item.to === "string" && item.to.length > 0) return item.to;
  return `/${item.id}`; // default fallback
}

function resolveChildTo(parent, child) {
  if (child && typeof child.to === "string" && child.to.length > 0) return child.to;
  return `/${parent.id}/${child.id}`; // default fallback
}

function isExternalUrl(url) {
  return typeof url === "string" && /^(https?:)?\/\//i.test(url);
}

function isPathActive(currentPath, to) {
  if (!to) return false;
  return currentPath === to || currentPath.startsWith(to + "/");
}