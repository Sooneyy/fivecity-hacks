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

var attempts = localStorage.getItem('attempts');
var wins = localStorage.getItem('wins');
var loses = localStorage.getItem('loses');

if (attempts === null) attempts = 0;
if (wins === null) wins = 0;
if (loses === null) loses = 0;

var progressBarInterval;
var playTime = 15;
var height = 6;
var width = 6;
var squares = [];

function hack() {
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Naciśnij przycisk poniżej, aby rozpocząć minigrę';
    hackFunction.style.display = 'none';
    progressBarBox.style.display = 'none';
    document.getElementById('number-a').textContent = String(attempts);
    document.getElementById('number-w').textContent = String(wins);
    document.getElementById('number-l').textContent = String(loses);
}

function startHack() {
    squares = [];
    document.getElementById('number-a').textContent = String(attempts);
    localStorage.setItem('attempts', attempts);
    createGrid();
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
        for (let x = 0; x < height; x++) {
            const el = document.createElement('div');
            el.classList.add('square')

            el.dataset.row = i;
            el.dataset.column = x;
            squares.push(el);

            el.onclick = function(){
                const row = parseInt(this.dataset.row);
                const column = parseInt(this.dataset.column);

                toggleLightOnSquare(row, column);
                toggleLightOnSquare(row - 1, column);
                toggleLightOnSquare(row + 1, column);
                toggleLightOnSquare(row, column - 1);
                toggleLightOnSquare(row, column + 1);
                
                const every = squares.every(sqr => !sqr.classList.contains('active'))
            
                if(every){
                    gameWin();
                }
            }

            hackFunction.appendChild(el)
        }
    }

    for (let i = 0; i < height * width; i++) {
        let random = Math.random() < 0.5 ? true : false;

        if (random) {
            squares[i].classList.add('active')
        }
    }
}

function toggleLightOnSquare(row, col) {
    if (row >= 0 && row < width && col >= 0 && col < width) {
        const square = squares.find((sqr) => parseInt(sqr.dataset.row) === row && parseInt(sqr.dataset.column) === col);
        square.classList.toggle('active');
    }
}

statisticsButton.addEventListener('click', () => {
    statisticsButton.classList.toggle('opened');
    statisticsButtonArrow.classList.toggle('open');
    statisticsMenu.classList.toggle('collapsed');
})
