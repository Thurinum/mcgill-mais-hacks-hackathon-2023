chrome.history.search({
    text: "",
    startTime: 0,
    maxResults: 100000
}).then(
    items => {
        console.log(items)
    }
)