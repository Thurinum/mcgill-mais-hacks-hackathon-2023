import * as Chart from "../scripts/chart.mjs";
import {$, err, setProgressIndicator} from "../scripts/utils.mjs";

const apiEndpoint = "http://35.222.12.140:8080/process"

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
            mode: "cors",
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

    $("#chart").style.transform = "scale(1)"
    $("#chart").style.opacity = "1"
    $("#overlay").style.backdropFilter = "blur(0px)"
    setProgressIndicator(false)
    return await analytics.json()
}


analyseBrowserHistory().then((data) => {
    Chart.createWeeklyChart(data,  0)
})
