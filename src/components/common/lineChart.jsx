import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
    Title as ChartTitle,
} from "chart.js";


// Register Chart.js pieces once
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
    ChartTitle
);

function gradientFillFrom(color) {
    // expects rgba(r,g,b,1) and returns a function that produces a vertical gradient
    const start = color.replace(/,\s*1\)/, ", 0.25)");
    const end = color.replace(/,\s*1\)/, ", 0)");
    return (ctx) => {
        const chart = ctx.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return start; // initial pass before layout
        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, start);
        g.addColorStop(1, end);
        return g;
    };
}

const PALETTE = [
    "rgba(59,130,246,1)", // blue-500
    "rgba(16,185,129,1)", // emerald-500
    "rgba(244,63,94,1)", // rose-500
    "rgba(234,179,8,1)", // yellow-500
    "rgba(139,92,246,1)", // violet-500
    "rgba(34,197,94,1)", // green-500
    "rgba(251,146,60,1)", // orange-400
    "rgba(99,102,241,1)", // indigo-500
];

export default function LineChart({ data, options = {}, className = "", width = "100%", height = "20rem", style = {} }) {
    const labels = data?.labels || [];
    const datasets = data?.datasets || [];
    const chartData = useMemo(() => {
        return {
            labels,
            datasets: datasets.map((ds, i) => {
                const color = ds.borderColor || PALETTE[i % PALETTE.length];
                const fill = Boolean(ds.fill);
                return {
                    label: ds.label,
                    data: ds.data || [],
                    borderColor: color,
                    backgroundColor: fill
                        ? ds.backgroundColor || gradientFillFrom(color)
                        : ds.backgroundColor || "transparent",
                    tension: ds.tension ?? 0.35,
                    pointRadius: ds.pointRadius ?? 2,
                    pointHoverRadius: ds.pointHoverRadius ?? 4,
                    borderWidth: ds.borderWidth ?? 2,
                    fill,
                };
            }),
        };
    }, [labels, datasets]);

    const chartOptions = useMemo(() => {
        const base = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { position: "top", labels: { usePointStyle: true } },
                tooltip: { enabled: true },
                title: data?.title
                    ? { display: true, text: data.title, font: { weight: "600" } }
                    : undefined,
            },
            scales: {
                x: {
                    grid: { color: "rgba(0,0,0,0.06)" },
                    ticks: { maxRotation: 0, autoSkip: true },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "rgba(0,0,0,0.06)" },
                    ticks: { precision: 0 },
                },
            },
        };
        return { ...base, ...options };
    }, [options, data?.title]);

    return (
        <div className={`w-full rounded-2xl border border-gray-200 shadow-sm bg-white flex flex-col ${className}`} style={{ width: (typeof width === 'number' ? `${width}px` : width), height: (typeof height === 'number' ? `${height}px` : height), ...style }}>
            <div className="p-3 border-b border-gray-100">
                <div className="text-sm text-gray-600">Line Chart</div>
            </div>
            <div className="flex-1 p-3">{/** set a height via Tailwind */}
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}


LineChart.propTypes = {
    data: PropTypes.shape({
        labels: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        ),
        datasets: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                data: PropTypes.arrayOf(PropTypes.number).isRequired,
                borderColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
                backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
                fill: PropTypes.bool,
                tension: PropTypes.number,
                pointRadius: PropTypes.number,
                pointHoverRadius: PropTypes.number,
                borderWidth: PropTypes.number,
            })
        ),
        title: PropTypes.string,
    }).isRequired,
    options: PropTypes.object,
    className: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
};


LineChart.propTypes = {
    data: PropTypes.shape({
        labels: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        ),
        datasets: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                data: PropTypes.arrayOf(PropTypes.number).isRequired,
                borderColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
                backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
                fill: PropTypes.bool,
                tension: PropTypes.number,
                pointRadius: PropTypes.number,
                pointHoverRadius: PropTypes.number,
                borderWidth: PropTypes.number,
            })
        ),
        title: PropTypes.string,
    }).isRequired,
    options: PropTypes.object,
    className: PropTypes.string,
};