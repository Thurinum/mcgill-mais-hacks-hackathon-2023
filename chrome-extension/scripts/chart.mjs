import {$} from "./utils.mjs";

const ctx = document.querySelector("#chart")

const chartOptions = (labels, data) => ({
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
                    title(t) {
                        return `Average productivity: ${t[0].raw}%`
                    },
                    label: (context) => `Click to inspect day`
                }
            }
        }
    }
})

function createWeeklyChart(data, week) {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const days = data.weeks[week].days.map(day => day.averageProductivity * 100)
    const chart = new Chart(ctx, chartOptions(labels, days))

    $("#chart").onclick = (e) => {
        const canvasPosition = Chart.helpers.getRelativePosition(e, chart)

        // Substitute the appropriate scale IDs
        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x)
        const dataY = chart.scales.y.getValueForPixel(canvasPosition.y)

        alert(dataX)
    }
}

export { createWeeklyChart }