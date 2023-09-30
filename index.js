const ctx = document.getElementById("productivity-chart")
const json= fetch("https://run.mocky.io/v3/b4add931-0807-4c21-864c-ce67e16ef236")
    .then(response => response.json()
    .then(data => {
        console.log(data)
        createWeeklyChart(data)

        const spinner = document.getElementById("loading-spinner")
        spinner.style.opacity = "0"
        setTimeout(() => {
            spinner.style.display = "none"
        }, 500)
    }))

function createWeeklyChart(data) {
    if (!data)
        throw new Error("No chart data provided.");

    new Chart(ctx,{
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Productivity",
                data: [69, 40, 60, 81, 56, 55, 40],
                borderWidth: 1,
            }]
        },
        options: {}
    });
}