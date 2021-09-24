let chart;
let isSetup = false;

const setupDraw = () => {
    isSetup = true;

    const ctx = document.querySelector('#canvasId');

    const config = {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Line',
                data: grid,
                borderColor: 'rgb(255, 99, 132)',
                showLine: true,
            }],
        },
        options: {
            parsing: false,
            animation: false,
            spanGaps: true,
            maintainAspectRatio: false,
            resizeDelay: 100,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: false,
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                        modifierKey: 'ctrl',
                    },
                    zoom: {
                        drag: {
                            enabled: true
                        },
                        wheel: {
                            enabled: true
                        },
                        mode: 'x',
                    },
                }
            },
            elements: {
                point: {
                    radius: 0,
                },
            },
        },
    };

    chart = new Chart(ctx, config);
}


const draw = () => {
    if(!isSetup) setupDraw();
    console.log(grid);
}

const resetZoom = () => {
    chart.resetZoom();
}