const $ = document.querySelector.bind(document)
const ctx = $("#productivity-chart")
const apiEndpoint = "https://run.mocky.io/v3/798bb0fe-80a5-46a0-8a33-38f5022573ba"

function err(message) {
    toast(`Failed to obtain analytics: ${message}`)
}

function toast(message) {
    const toast = $("#toast")

    toast.innerText = message
    toast.style.top = "10px"

    setTimeout(() => {
        toast.style.top = `-70px`
    }, 2000)
}

function setProgressIndicator(isVisible) {
    const spinner = $("#loading-indicator")

    if (isVisible) {
        spinner.style.display = "block"
        spinner.style.opacity = "1"
    } else {
        spinner.style.opacity = "0"
        setTimeout(() => {
            spinner.style.display = "none"
        }, 500)
    }
}

async function analyseBrowserHistory() {
    setProgressIndicator(true)

    const history = await chrome.history.search({
        text: "",
        startTime: 0,
        maxResults: 100000
    })

    const body = history.map(site => ({
        url: site.url,
        title: site.title,
        lastVisitTime: site.lastVisitTime,
    }))

    let analytics
    try {
        analytics = await fetch(apiEndpoint, {
            method: "GET",
            // headers: {
            //     "Content-Type": "application/json",
            //     "Accept": "application/json",
            // },
            // body: JSON.stringify(body)
        }).finally(() => {
            setProgressIndicator(false)
        })
    } catch(e) {
        err(e.message)
        return null
    }

    if (analytics.status !== 200) {
        err(`The server request failed: ${analytics.status}`)
        return null
    }

    setProgressIndicator(false)
    return await analytics.json()
}

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
            }
        }
    }
})

function createWeeklyChart(data, week) {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const days = data.weeks[week].days.map(day => day.averageProductivity * 100)
    new Chart(ctx, chartOptions(labels, days))
}

analyseBrowserHistory().then((data) => {
    createWeeklyChart(data, 0)
})
