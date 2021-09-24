const fileInput = document.querySelector("#input-file");
const zoomInput = document.querySelector('#zoom-input');

let csvTitles = null;
let maxTimestamp, minValue, maxValue, grid, drawSVG, polyline;
let zoom = 1, hasDrawBeenSetup = false;

const draw = () => {
    const drawing = document.querySelector('#drawing');
    const height = drawing.clientHeight;
    const width = drawing.clientWidth;

    if(!hasDrawBeenSetup) {
        drawSVG = SVG().addTo(drawing);
        hasDrawBeenSetup = true;
    }
    drawSVG.size(zoom * width, height);
    
    const translatedGrid = grid.map(([x,y]) =>([
        zoom * x / maxTimestamp * Math.floor(width),
        (maxValue-y) / maxValue * Math.floor(height),
    ]));

    if(polyline === undefined) {
        polyline = drawSVG.polyline('').fill('red').stroke({ width: 100 });
    }
    polyline.clear();
    polyline.plot(translatedGrid);
    console.log(translatedGrid);
}

const isLetter = char => char.length === 1 && char.match(/[a-z]/i);

const parseCSV = text => {
    text = text.replace(/\r/g, '');
    grid = text
        .split('\n')
        .filter(x => x != '')
        .map(row => row.split(','));
    if(isLetter(grid[0][0].charAt(0))) {
        csvTitles = grid.shift();
    }
    grid = grid.map(row => row.map(x => parseInt(x)));
    const { min, max } = grid.reduce(({min, max}, row) => ({ min: (min > row[1] ? row[1] : min), max: (max < row[1] ? row[1] : max) }), { min: 0, max: 0 });
    minValue = min;
    maxValue = max;
    maxTimestamp = parseInt(grid[grid.length-1][0]);
    draw();
}

const readFileContent = file => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}

const getFile = async event => {
    const input = event.target;
    if('files' in input && input.files.length > 0) {
        try {
            const content = await readFileContent(input.files[0]);
            parseCSV(content);
        }
        catch(e) { console.error(e); }
    }
}

fileInput.addEventListener('change', getFile)
zoomInput.addEventListener('change', event => {
    zoom = event.target.valueAsNumber;
    draw();
});