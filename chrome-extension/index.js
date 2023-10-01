const $ = document.querySelector.bind(document)
const ctx = $("#productivity-chart")

fetch("https://run.mocky.io/v3/02b569d9-5131-4e3b-a100-7917fe72fcaf")
    .then(response => response.json())
    .then(data => {
        try {
            createWeeklyChart(data)
        } catch(e) {
            alert(e.message)
        }

        const spinner = $("#loading-spinner")
        spinner.style.opacity = "0"
        setTimeout(() => {
            spinner.style.display = "none"
        }, 500)
    })

function createWeeklyChart(data) {
    const err = (message) => {
        throw new Error(`Invalid chart data provided: ${message}.`)
    }

    if (!data)
        $("nodata").style.display = "block"

    const results = data.results

    if (!results)
        err("no metrics found")

    new Chart(ctx,{
        type: "line",
        data: {
            labels: results.map(r => r.day),
            datasets: [{
                data: results.map(r => r.averageProductivity * 100),
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
                }
            }
        }
    });
}
