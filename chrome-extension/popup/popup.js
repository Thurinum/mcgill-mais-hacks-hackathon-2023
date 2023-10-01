const $ = document.querySelector.bind(document)
const ctx = $("#productivity-chart")
const apiEndpoint = "http://104.155.165.248:8080"

function err(message) {
    alert(`Failed to obtain analytics: ${message}`)
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
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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

analyseBrowserHistory().then(() => {})



function createWeeklyChart(data, week) {
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
