import React from "react";
import LineChart from "../components/common/lineChart";

export default function AccumulateOutput() {
    const json_data = {
        labels: ["Jan","Feb","Mar","Apr","May","Jun"],
        datasets: [
            { label: "Sales", data: [120,150,180,160,210,260], fill: true },
            { label: "Costs", data: [80,100,130,120,140,170] }
        ],
        title: "Monthly Performance"
    }

    return (
        <>
            <div>
                <h2>
                    this is Accumulate Line Chart page
                </h2>
            </div>
            <div className="p-6">
                <LineChart data={json_data} className="h-96" width="100%" height="40rem"/>
            </div>
        </>
    );
}