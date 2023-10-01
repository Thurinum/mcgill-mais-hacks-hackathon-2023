import {$} from "./utils.mjs";

let chart;
const ctx = document.querySelector("#chart")

const chartOptions = (labels, data, tooltipTitle, tooltipLabel) => ({
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            data: data,
            borderWidth: 3,
            borderColor: "#6d4ea7",
            lineTension: 0.4,
            fill: true,
            pointHoverRadius: 8,
            backgroundColor: "rgba(109, 78, 167, 0.1)",
        }]
    },
    options: {
        scales: {
            x: {
                ticks: {
                    padding: 10
                }
            },
            y: {
                min: 0,
                max: 100,
                ticks: {
                    callback: (value) => `${value}%`,
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                xAlign: "center",
                yAlign: "bottom",
                callbacks: {
                    title: tooltipTitle,
                    label: tooltipLabel,
                }
            }
        }
    }
})

function createWeeklyChart(data, week) {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const days = data.weeks[week].days.map(day => day.averageProductivity * 100)
    const tooltipTitle = (t) => `Average productivity: ${t[0].raw}%`
    const tooltipLabel = (t) => `Click to see inspect the day`
    chart = new Chart(ctx, chartOptions(labels, days, tooltipTitle, tooltipLabel))

    $("#chart").onclick = (e) => {
        const canvasPosition = Chart.helpers.getRelativePosition(e, chart)
        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x)
        createDailyChart(data, week, dataX)
    }
}

function createDailyChart(data, week, day) {
    const labels = [
        "1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h",
        "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h",
        "20h", "21h", "22h", "23h", "24h"
    ]
    const hours = data.weeks[week].days[day].hours.map(hour => hour.averageProductivity * 100)
    console.log(data)
    const websites = data.weeks[week].days[day].hours.map(hour => hour.websites)
    const tooltipTitle = (t) => `Average productivity: ${t[0].raw}%`
    const tooltipLabel = (t) => `Website: ${websites[t.dataIndex].url}`

    chart.destroy()
    chart = new Chart(ctx, chartOptions(labels, hours, tooltipTitle, tooltipLabel))
}

export { createWeeklyChart }