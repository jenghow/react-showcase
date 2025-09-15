import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

/**
 * GridTable — React + Tailwind CSS (JavaScript version)
 *
 * Expects JSON shaped as:
 * {
 *   columns: [ { key: string, label: string, sortable?: boolean, align?: 'left'|'center'|'right' } ],
 *   rows: [ { ...data } ]
 * }
 *
 * Example server response (GET /api/table-data):
 * {
 *   "columns": [
 *     { "key": "name", "label": "Name", "sortable": true },
 *     { "key": "email", "label": "Email" },
 *     { "key": "age", "label": "Age", "sortable": true, "align": "right" }
 *   ],
 *   "rows": [
 *     { "id": 1, "name": "Ava", "email": "ava@example.com", "age": 29 },
 *     { "id": 2, "name": "Ben", "email": "ben@example.io", "age": 34 }
 *   ]
 * }
 */

function sortRows(rows, key, dir) {
  const m = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = a?.[key];
    const vb = b?.[key];
    if (va == null && vb == null) return 0;
    if (va == null) return -1 * m;
    if (vb == null) return 1 * m;
    if (typeof va === "number" && typeof vb === "number") return (va - vb) * m;
    return String(va).localeCompare(String(vb)) * m;
  });
}

function GridTable({
  data,
  pageSizeOptions = [5, 10, 20, 50],
  initialPageSize = 10,
  striped = true,
  dense = false,
  className = "",
}) {
  const { columns = [], rows = [] } = data || {};

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [rows, query]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return sortRows(filtered, sortKey, sortDir);
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * pageSize;
  const paged = sorted.slice(start, start + pageSize);

  const headerClasses = "sticky top-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60";
  const cellPad = dense ? "px-3 py-1.5" : "px-4 py-2.5";

  function onSort(col) {
    if (!col.sortable) return;
    if (sortKey !== col.key) {
      setSortKey(col.key);
      setSortDir("asc");
    } else {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    }
    setPage(1);
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search…"
            className="w-full rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 pl-10 pr-3 py-2"
            aria-label="Search rows"
          />
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-3.5-3.5" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Rows per page</label>
          <select
            className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className={headerClasses}>
            <tr>
              {columns.map((col) => {
                const active = sortKey === col.key;
                const align = col.align || "left";
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`${cellPad} text-gray-700 font-semibold whitespace-nowrap ${
                      col.headerClassName || ""
                    } ${
                      align === "right"
                        ? "text-right"
                        : align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(col)}
                      className={`group inline-flex items-center gap-1 ${
                        col.sortable ? "hover:text-black" : "cursor-default"
                      }`}
                      aria-sort={
                        active ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                      }
                      aria-label={col.sortable ? `Sort by ${col.label}` : undefined}
                    >
                      <span>{col.label}</span>
                      {col.sortable && (
                        <svg
                          className={`h-4 w-4 transition-transform ${
                            active && sortDir === "desc" ? "rotate-180" : ""
                          } text-gray-400 group-hover:text-gray-600`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 3l-5 6h10l-5-6zM5 11l5 6 5-6H5z" />
                        </svg>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={`${cellPad} text-center text-gray-500`}>
                  No results
                </td>
              </tr>
            ) : (
              paged.map((row, idx) => (
                <tr
                  key={row.id ?? idx}
                  className={`${
                    striped ? (idx % 2 === 1 ? "bg-gray-50/60" : "bg-white") : ""
                  } hover:bg-gray-100/50 transition-colors`}
                >
                  {columns.map((col) => {
                    const align = col.align || "left";
                    const value = col.accessor ? col.accessor(row) : row[col.key];
                    return (
                      <td
                        key={col.key}
                        className={`${cellPad} ${col.className || ""} ${
                          align === "right"
                            ? "text-right"
                            : align === "center"
                            ? "text-center"
                            : "text-left"
                        }`}
                      >
                        {value ?? <span className="text-gray-400">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{sorted.length === 0 ? 0 : start + 1}</span>–
          <span className="font-medium">{start + paged.length}</span> of <span className="font-medium">{sorted.length}</span>
        </p>
        <div className="inline-flex items-center gap-2">
          <button
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm disabled:opacity-50"
            onClick={() => setPage(1)}
            disabled={clampedPage === 1}
          >
            « First
          </button>
          <button
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={clampedPage === 1}
          >
            ‹ Prev
          </button>
          <span className="text-sm text-gray-700">Page {clampedPage} / {totalPages}</span>
          <button
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={clampedPage === totalPages}
          >
            Next ›
          </button>
          <button
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm disabled:opacity-50"
            onClick={() => setPage(totalPages)}
            disabled={clampedPage === totalPages}
          >
            Last »
          </button>
        </div>
      </div>
    </div>
  );
}

GridTable.propTypes = {
  data: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        sortable: PropTypes.bool,
        align: PropTypes.oneOf(["left", "center", "right"]),
        accessor: PropTypes.func,
        className: PropTypes.string,
        headerClassName: PropTypes.string,
      })
    ),
    rows: PropTypes.arrayOf(PropTypes.object),
  }),
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  initialPageSize: PropTypes.number,
  striped: PropTypes.bool,
  dense: PropTypes.bool,
  className: PropTypes.string,
};

export default GridTable;
/**
 * If your API returns raw rows only (e.g., an array of objects),
 * you can derive columns on the client like this:
 *
 * const rows = res.data; // [{ id: 1, name: 'Ava', ... }]
 * const columns = Object.keys(rows[0] || {}).filter(k => k !== 'id').map(k => ({ key: k, label: k[0].toUpperCase()+k.slice(1), sortable: true }));
 * setData({ columns, rows });
 */
