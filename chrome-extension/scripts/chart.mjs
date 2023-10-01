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
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.formattedValue}`
                }
            }
        }
    }
})

function createWeeklyChart(data, week) {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const days = data.weeks[week].days.map(day => day.averageProductivity * 100)
    new Chart(ctx, chartOptions(labels, days))
}

export { createWeeklyChart }