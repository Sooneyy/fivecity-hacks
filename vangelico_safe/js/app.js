const hackBox = document.querySelector('.hack-box');
const hackFunction = document.querySelector('.hack-fn');
const hackTitleBox = document.querySelector('.hack-title');
const hackTitle = document.getElementById('hack-title-text');
const hackInfoBox = document.querySelector('.hack-info');
const hackInfo = document.getElementById('hack-info-text');
const startButton = document.querySelector('.start-hack');
const progressBarBox = document.querySelector('.hack-progress')
const progressBarFn = document.getElementById('progress-bar-fn');
const statisticsButton = document.querySelector('.statistics-header');
const statisticsMenu = document.querySelector('.statistics-menu');
const statisticsButtonArrow = document.querySelector('.statistics-header > span > svg');
const options = document.querySelector('.options');
const input = document.querySelector('.input');
const sizeText = document.getElementById('size');

var attempts = localStorage.getItem('attempts');
var wins = localStorage.getItem('wins');
var loses = localStorage.getItem('loses');

if (attempts === null) attempts = 0;
if (wins === null) wins = 0;
if (loses === null) loses = 0;

var className = new Array();
    className[0] = 'empty';
    className[1] = 'active';
var progressBarInterval;
var playTime = 15;
var stepsCount = 0;
var height = 5;
var width = 5;
var squares = [];
var classCount = className.length;
var cells;
var col;
var row;
var mat;
var rows;
var m;
var n;
var np;
var r;
var maxr;

function hack() {
    sizeText.textContent = input.value + 'x' + input.value;
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Naciśnij przycisk poniżej, aby rozpocząć minigrę';
    hackFunction.style.display = 'none';
    progressBarBox.style.display = 'none';
    document.getElementById('number-a').textContent = String(attempts);
    document.getElementById('number-w').textContent = String(wins);
    document.getElementById('number-l').textContent = String(loses);
}

function startHack() {
    cells = new Array();
    for (row = 0; row < width; row++) {
        cells[row] = new Array();
        for (col = 0; col < height; col++)
            cells[row][col] = 0;
    }
    stepsCount = 0;
    squares = [];
    attempts++;
    document.getElementById('number-a').textContent = String(attempts);
    localStorage.setItem('attempts', attempts);
    options.style.display = 'none';
    createGrid();
    newGame();
    hackTitle.innerHTML = 'Odznacz wszystkie pola';
    hackTitleBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Przygotuj się...';
    progressBarBox.style.display = 'block';
    progressBar('start', 8);
}

function gameWin() {
    wins++;
    alert('Hack zrobiony w ' + stepsCount + ' ruchach');
    document.getElementById('number-w').textContent = String(wins);
    localStorage.setItem('wins', wins);
    hackTitleBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack udany';
    progressBarBox.style.display = 'block';
    progressBar('end', 8);
}

function gameOver() {
    loses++;
    document.getElementById('number-l').textContent = String(loses);
    localStorage.setItem('loses', loses);
    hackFunction.style.display = 'none';
    hackTitleBox.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack nieudany';
    progressBarBox.style.display = 'block';
    progressBar('end', 8);
}

function progressBar(w, t) {
    let width = 1000;

    function updateProgress() {
        if (width > 0) {
            if (w === 'start' || w === 'end') width -= 3;
            else width--;
            progressBarFn.style.width = (width * 100) / 1000 + '%';
        } else {
            if (w === 'start') {
                hackTitleBox.style.display = '';
                hackInfoBox.style.display = 'none';
                hackFunction.style.display = '';
                progressBar('game', playTime);
                return;
            }
            if (w === 'game') {
                gameOver();
                return;
            }
            if (w === 'end') {
                hackFunction.style.display = 'none';
                hackTitleBox.style.display = 'none';
                progressBarBox.style.display = 'none';
                options.style.display = '';
                hackInfo.textContent = 'Naciśnij przycisk poniżej, aby ponownie rozpocząć minigrę';
            }
        }
    }

    clearInterval(progressBarInterval);
    progressBarInterval = setInterval(updateProgress, t)
}

function createGrid() {
    hackFunction.innerHTML = '';

    for (let i = 0; i < width; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        row.dataset.row = i;

        for (let x = 0; x < height; x++) {
            const el = document.createElement('div');
            el.classList.add('square')

            el.dataset.row = i;
            el.dataset.column = x;
            squares.push(el);

            el.onclick = function () {
                const row = parseInt(this.dataset.row);
                const column = parseInt(this.dataset.column);

                stepsCount++;

                toggleLight(row, column);
                toggleLight(row - 1, column);
                toggleLight(row + 1, column);
                toggleLight(row, column - 1);
                toggleLight(row, column + 1);

                const every = squares.every(sqr => !sqr.classList.contains('active'))

                if (every) {
                    gameWin();
                }
            }

            hackFunction.appendChild(row)
            row.appendChild(el);
        }
    }
}

function toggleLight(row, col) {
    if (row >= 0 && row < width && col >= 0 && col < width) {
        const square = squares.find((sqr) => parseInt(sqr.dataset.row) === row && parseInt(sqr.dataset.column) === col);
        square.classList.toggle('active');
    }
}

function newGame() {
    do {
        for (var row = 0; row < width; row++) {
            for (var col = 0; col < height; col++) {
                setcell(row, col, Math.floor(Math.random() * classCount));
            }
        }
    }
    while (!silentSolve());
}

function setcell(row, col, value) {
    cells[row][col] = value;
    setcellclass(row, col, className[value])
}

function setcellclass(row, col, className) {
    var el = document.querySelector(`[data-row="${row}"][data-column="${col}"]`);
    el.classList.remove('active');
    el.classList.add(className);
}

function modulate(x) {
    if (x >= 0) return x % classCount;
    x = (-x) % classCount;
    if (x == 0) return 0;
    return classCount - x;
}

function invert(value) {
    if (value <= 1) return value;
    var seed = gcd(value, classCount);
    if (seed != 1) return 0;
    var a = 1,
        b = 0,
        x = value;
    var c = 0,
        d = 1,
        y = classCount;
    while (x > 1) {
        var tmp = Math.floor(y / x);
        y -= x * tmp;
        c -= a * tmp;
        d -= b * tmp;
        tmp = a;
        a = c;
        c = tmp;
        tmp = b;
        b = d;
        d = tmp;
        tmp = x;
        x = y;
        y = tmp;
    }
    return a;
}

function a(i, j) {
    return mat[i][rows[j]];
}

function setmat(i, j, val) {
    mat[i][rows[j]] = modulate(val);
}

function gcd(x, y) {
    if (y == 0) return x;
    if (x == y) return x;
    if (x > y) x = x % y;
    while (x > 0) {
        y = y % x;
        if (y == 0) return x;
        x = x % y;
    }
    return y;
}

function silentSolve() {
    var retVal = false;
    var row;
    var col;
    for (var goal = 0; goal < classCount; goal++) {
        if (solveProblem(goal)) {
            var anscols = new Array();
            var j;
            for (j = 0; j < n; j++) anscols[rows[j]] = j;
            for (row = 0; row < width; row++)
                for (col = 0; col < height; col++) {
                    var value;
                    j = anscols[col * height + row];
                    if (j < r) value = a(j, n);
                    else value = 0;
                }
            retVal = true;
        }
    }

    return retVal;
}

function initMatrix() {
    maxr = Math.min(m, n);
    mat = new Array();
    for (var row = 0; row < width; row++)
        for (var col = 0; col < height; col++) {
            var i = col * height + row;
            var line = new Array();
            mat[i] = line;
            for (var j = 0; j < n; j++) line[j] = 0;
            line[i] = 1;
            if (row > 0) line[i - 1] = 1;
            if (col > 0) line[i - height] = 1;
            if (row < height - 1) line[i + 1] = 1;
            if (col < width - 1) line[i + height] = 1;
        }
    rows = new Array();
    for (var j = 0; j < np; j++) rows[j] = j;
}

function solveProblem(goal) {
    var size = width * height;
    m = size;
    n = size;
    np = n + 1;
    initMatrix();
    for (var row = 0; row < width; row++)
        for (var col = 0; col < height; col++)
            mat[col * width + row][n] = modulate(goal - cells[row][col]);
    return sweep();
}

function sweep() {
    for (r = 0; r < maxr; r++) {
        if (!sweepStep()) return false;
        if (r == maxr) break;
    }
    return true;
}

function sweepStep() {
    var i;
    var j;
    var finished = true;
    for (j = r; j < n; j++) {
        for (i = r; i < m; i++) {
            var aij = a(i, j);
            if (aij != 0) finished = false;
            var inv = invert(aij);
            if (inv != 0) {
                for (var jj = r; jj < np; jj++)
                    setmat(i, jj, a(i, jj) * inv);
                doBasicSweep(i, j);
                return true;
            }
        }
    }
    if (finished) {
        maxr = r;
        for (j = n; j < np; j++)
            for (i = r; i < m; i++)
                if (a(i, j) != 0) return false;
        return true;
    }
    alert("Błąd wewnętrzny - odśwież stronę");
    return false;
}

function swap(array, x, y) {
    var tmp = array[x];
    array[x] = array[y];
    array[y] = tmp;
}

function doBasicSweep(pivoti, pivotj) {
    if (r != pivoti) swap(mat, r, pivoti);
    if (r != pivotj) swap(rows, r, pivotj);
    for (var i = 0; i < m; i++) {
        if (i != r) {
            var air = a(i, r);
            if (air != 0)
                for (var j = r; j < np; j++)
                    setmat(i, j, a(i, j) - a(r, j) * air);
        }
    }
}

statisticsButton.addEventListener('click', () => {
    statisticsButton.classList.toggle('opened');
    statisticsButtonArrow.classList.toggle('open');
    statisticsMenu.classList.toggle('collapsed');
})

input.addEventListener('input', (e) => {
    height = Number(e.target.value)
    width = Number(e.target.value);

    sizeText.textContent = e.target.value + 'x' + e.target.value;
})
