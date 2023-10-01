const $ = document.querySelector.bind(document)

function err(message) {
    toast(`Failed to obtain analytics: ${message}`)
}

function toast(message) {
    const toast = $("#toast")

    toast.innerText = message
    toast.style.top = "10px"

    setTimeout(() => {
        toast.style.top = `-70px`
        setTimeout(() => {
            window.close()
        }, 500)
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

export { $, err, setProgressIndicator }