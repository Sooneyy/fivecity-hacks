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
const hackOptions = document.querySelector('.hack-options');

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

var attempts = localStorage.getItem('attempts');
var wins = localStorage.getItem('wins');
var loses = localStorage.getItem('loses');

if (attempts === null) attempts = 0;
if (wins === null) wins = 0;
if (loses === null) loses = 0;

var progressBarInterval;
var playTime = 10;
var height = 15;
var width = 15;
var path;
var antiSolverMode = false;
var wrong = 0;
var good = 0;
var keyCodes = { left: 37, up: 38, right: 39, down: 40 }

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
    wrong = 0;
    attempts++;
    path = randomPath(width, height);
    document.getElementById('number-a').textContent = String(attempts);
    localStorage.setItem('attempts', attempts);
    hackFunction.innerHTML = '';
    hackOptions.style.display = 'none';
    createGrid();
    hackTitle.innerHTML = 'Przejdź labirynt';
    hackTitleBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Przygotuj się...';
    progressBarBox.style.display = 'block';
    document.addEventListener('keydown', handleKeyPress);
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
                hackOptions.style.display = '';
                hackInfo.textContent = 'Naciśnij przycisk poniżej, aby ponownie rozpocząć minigrę';
            }
        }
    }

    clearInterval(progressBarInterval);
    progressBarInterval = setInterval(updateProgress, t)
}

function createGrid() {
    for (let i = 0; i < height * width; i++) {
        const el = document.createElement('div');
        const set = document.createElement('div');
        set.classList.add('set')
        el.classList.add('square');

        const x = i % width + 1;
        const y = Math.floor(i / height) + 1;

        el.dataset.x = x;
        el.dataset.y = y;

        set.dataset.x = x;
        set.dataset.y = y;

        el.setAttribute('id', x + ',' + y);
        set.setAttribute('id', 's' + x + ',' + y);

        hackFunction.appendChild(el);
        el.appendChild(set)
    }
    createSquares()
}

function randomPath(sizeX, sizeY) {
    let x = Math.floor(Math.random() * sizeX);
    let path = [];
    for (let y = sizeY - 1; y >= 0; y--) {
        let upX = Math.floor(Math.random() * sizeX);
        while (x != upX) {
            path.push([x, y]);
            if (x < upX) x++;
            else x--;
        }
        path.push([x, y]);
    }
    for (let i = path.length - 4; i > 0; i--) {
        if (i + 3 < path.length && path[i][1] === path[i + 3][1] + 1 && path[i][0] === path[i + 3][0]) {
            path.splice(i + 1, 2);
        }
    }
    return path;
}

function createSquares(array, e) {
    let x = 0;
    let y = 0;
    let squareElement;

    for (let i = 0; i < path.length; i++) {
        x = path[i][0] + 1;
        y = path[i][1] + 1;

        squareElement = document.getElementById('s' + x + ',' + y)

        squareElement.classList.add('mazesquare')

        if (i === 0) squareElement.classList.add('head');
        if (i === path.length - 1) squareElement.classList.add('finish');
    }
}

function handleKeyPress(e) {
    const key = e.keyCode;
    const headElement = document.querySelector('.head');
    const squares = document.querySelectorAll('.square');

    switch (key) {
        case keyCodes.left: {
            const x = parseInt(headElement.dataset.x) - 1;
            const y = parseInt(headElement.dataset.y);
            const previousX = parseInt(headElement.dataset.x);
            const previousElement = document.getElementById('s' + previousX + ',' + y);
            const nextElement = document.getElementById('s' + x + ',' + y)
            if (nextElement) {
                nextElement.classList.add('head');
                if(nextElement.classList.contains('good')){
                    nextElement.classList.remove('good');
                }
                if (previousElement.classList.contains('wrongmaze')) {
                    previousElement.classList.remove('good');
                } else {
                    previousElement.classList.add('good');
                    good++
                }
                previousElement.classList.remove('head');
                previousElement.classList.remove('wrongmaze');
            }else return;

            if (!nextElement.classList.contains('mazesquare')) {
                if (nextElement.classList.contains('head')) {
                    nextElement.classList.add('wrongmaze');
                    nextElement.parentElement.classList.add('wrong');
                } else {
                    previousElement.classList.remove('wrongmaze');
                    previousElement.classList.remove('good');
                }
                wrong++;
            }
            break;
        }
        case keyCodes.up: {
            const x = parseInt(headElement.dataset.x);
            const y = parseInt(headElement.dataset.y) - 1;
            const previousY = parseInt(headElement.dataset.y);
            const nextElement = document.getElementById('s' + x + ',' + y);
            const previousElement = document.getElementById('s' + x + ',' + previousY);
            if (nextElement) {
                nextElement.classList.add('head');
                if(nextElement.classList.contains('good')){
                    nextElement.classList.remove('good');
                }
                if (previousElement.classList.contains('wrongmaze')) {
                    previousElement.classList.remove('good');
                } else {
                    previousElement.classList.add('good');
                    good++
                }
                previousElement.classList.remove('head');
                previousElement.classList.remove('wrongmaze');
            }else return;

            if (!nextElement.classList.contains('mazesquare')) {
                if (nextElement.classList.contains('head')) {
                    nextElement.classList.add('wrongmaze');
                    nextElement.parentElement.classList.add('wrong');
                } else {
                    previousElement.classList.remove('wrongmaze');
                    previousElement.classList.remove('good');
                }
                wrong++;
            }
            break;
        }
        case keyCodes.right: {
            const x = parseInt(headElement.dataset.x) + 1;
            const y = parseInt(headElement.dataset.y);
            const previousX = parseInt(headElement.dataset.x);
            const nextElement = document.getElementById('s' + x + ',' + y)
            const previousElement = document.getElementById('s' + previousX + ',' + y)
            if (nextElement) {
                nextElement.classList.add('head');
                if(nextElement.classList.contains('good')){
                    nextElement.classList.remove('good');
                }
                if (previousElement.classList.contains('wrongmaze')) {
                    previousElement.classList.remove('good');
                } else {
                    good++
                    previousElement.classList.add('good');
                }
                previousElement.classList.remove('head');
                previousElement.classList.remove('wrongmaze');
            }else return;

            if (!nextElement.classList.contains('mazesquare')) {
                if (nextElement.classList.contains('head')) {
                    nextElement.classList.add('wrongmaze');
                    nextElement.parentElement.classList.add('wrong');
                } else {
                    previousElement.classList.remove('wrongmaze');
                    previousElement.classList.remove('good');
                }
                wrong++;
            }
            break;
        }
        case keyCodes.down: {
            const x = parseInt(headElement.dataset.x);
            const y = parseInt(headElement.dataset.y) + 1;
            const previousY = parseInt(headElement.dataset.y);
            const nextElement = document.getElementById('s' + x + ',' + y)
            const previousElement = document.getElementById('s' + x + ',' + previousY)
            if (nextElement) {
                nextElement.classList.add('head');
                if(nextElement.classList.contains('good')){
                    nextElement.classList.remove('good');
                }
                if (previousElement.classList.contains('wrongmaze')) {
                    previousElement.classList.remove('good');
                } else {
                    previousElement.classList.add('good');
                    good++
                }
                previousElement.classList.remove('head');
                previousElement.classList.remove('wrongmaze');
            }else return;
            if (!nextElement.classList.contains('mazesquare')) {
                if (nextElement.classList.contains('head')) {
                    nextElement.classList.add('wrongmaze');
                    nextElement.parentElement.classList.add('wrong');
                } else {
                    previousElement.classList.remove('wrongmaze');
                    previousElement.classList.remove('good');
                }
                wrong++;
            }
            break;
        }
    }

    const mazeSquares = document.querySelectorAll('.mazesquare');
    const finishSquare = document.querySelector('.finish');
    const goodElements = document.querySelectorAll('.good');
    
    if(goodElements.length === mazeSquares.length - 1 && hasClass(finishSquare, 'head')){
        gameWin();
    }

    if (wrong > 3) {
        gameOver();
    }
}

function hasClass(el, className){
    return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
}

statisticsButton.addEventListener('click', () => {
    statisticsButton.classList.toggle('opened');
    statisticsButtonArrow.classList.toggle('open');
    statisticsMenu.classList.toggle('collapsed');
})

$(document).ready(function () {

    $("#game-mode").on("change", function () {
        $(this).prop("checked") ? $("#mode").text("Włączony") : $("#mode").text("Wyłączony");
        $(this).prop("checked") ? antiSolverMode = true : antiSolverMode = false;
    })
    
    $(".start-hack").on("click", function() {
        let randomOperator = Math.random() < 0.5 ? "" : "-";

        if(antiSolverMode){
            $(".hack-box").css({
                "transform": `rotate(${randomOperator}${random(1,5)}deg) translate(${randomOperator}${random(80, 105)}px, ${randomOperator}${random(30,45)}px)`,
            });
        }else {
            $(".hack-box").css({
                "transform": `rotate(0deg) translate(0, 0)`,
            });
        }
    })
})
