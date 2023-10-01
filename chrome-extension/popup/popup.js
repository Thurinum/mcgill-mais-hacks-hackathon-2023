import * as Chart from "../scripts/chart.mjs";
import {err, setProgressIndicator} from "../scripts/utils.mjs";

const apiEndpoint = "https://run.mocky.io/v3/798bb0fe-80a5-46a0-8a33-38f5022573ba"

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


analyseBrowserHistory().then((data) => {
    Chart.createWeeklyChart(data, 0)
})
