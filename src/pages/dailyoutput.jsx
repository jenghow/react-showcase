import React from "react";
import GridTable from "../components/common/gridTable";

export default function DailyOuput() {
    const json_data = {
        "columns": [
            { "key": "name", "label": "Name", "sortable": true },
            { "key": "email", "label": "Email" },
            { "key": "age", "label": "Age", "sortable": true, "align": "right" }
        ],
        "rows": [
            { "id": 1, "name": "Ava", "email": "ava@example.com", "age": 29 },
            { "id": 2, "name": "Ben", "email": "ben@example.io", "age": 34 }
        ]
    }

    return (
        <>
            <div>
                <h2>
                    This is grid table testing
                </h2>
            </div>
            <div className="p-4">
                <h1 className="text-xl font-semibold mb-3">Users</h1>
                <GridTable data={json_data} initialPageSize={10} className="bg-white" />
            </div>
        </>
    );
}