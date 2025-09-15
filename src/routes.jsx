import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";


const DailyOutputPage = lazy(() => import("./pages/dailyoutput.jsx"));
const AccumulatedPage = lazy(() => import("./pages/accumulateoutput.jsx"));
const DashboardPage = lazy(() => import("./pages/Dashboard.jsx"))

export function AppRoutes(){
return (
<Suspense fallback={<div className="p-6 text-sm text-neutral-500">Loading…</div>}>
<Routes>
<Route path="/" element={<DashboardPage/>} />
<Route path="/reports/dailyoutput" element={<DailyOutputPage/>} />
<Route path="/reports/accumulated" element={<AccumulatedPage/>} />
<Route path="*" element={<Navigate to="/" replace/>} />
</Routes>
</Suspense>
);
}

// Optional: export a JSON definition of routes if you want to share
export const ROUTES_JSON = [
{ path: "/", label: "Dashboard" },
{ path: "/projects/active", label: "Projects · Active" },
{ path: "/projects/archived", label: "Projects · Archived" },
{ path: "/reports", label: "Reports" },
{ path: "/settings/profile", label: "Settings · Profile" },
{ path: "/settings/billing", label: "Settings · Billing" },
];