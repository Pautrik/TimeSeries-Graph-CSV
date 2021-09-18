const canvas = document.querySelector('#canvasId');
const ctx = canvas.getContext('2d');
const fileInput = document.querySelector("#input-file");
const zoomInput = document.querySelector('#zoom-input');
const offsetInput = document.querySelector('#offset-input');

let csvTitles = null;
let maxTimestamp, minValue, maxValue, grid;
let zoom = 1, offset = 0;

const draw = () => {
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width-4, height-4);

    ctx.strokeStyle = 'red';

    const translatedGrid = grid.map(([x,y]) =>([
        zoom * (x-offset) / maxTimestamp * Math.floor(width-4),
        (maxValue-y) / maxValue * Math.floor(height-4),
    ]));
    console.log(translatedGrid);

    ctx.beginPath();
    ctx.moveTo(translatedGrid[0][0], translatedGrid[0][1]);
    for(let i = 1; i < grid.length; i++) {
        const [ x, y ] = translatedGrid[i];
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    
    console.log("Drawn");
    console.log({ width, height, maxTimestamp, minValue, maxValue });
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
offsetInput.addEventListener('change', event => {
    offset = event.target.valueAsNumber;
    draw();
});