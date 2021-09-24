const fileInput = document.querySelector("#input-file");
fileInput.value = '';

let csvTitles = null;
let maxTimestamp, minValue, maxValue, grid;

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
    grid = grid.map(row => {
        const [ x, y ] = row;
        return { x, y };
    });
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