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
const hackCount = document.querySelector('.hack-count');
const hackOptions = document.querySelector('.hack-options')
const input = document.querySelector('#color-number');
const hackLevel = document.querySelector('.hack-level');
const level = document.getElementById('level');

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
var playTime = 5;
var height = 7;
var width = 7;
var randomColor = 0;
var randomPlaceholderColor = 0;
var antiSolverMode = false;
var levelCount = 0;
var numbers = [];
var colors = ['niebieskiego', 'czerwonego', 'zielonego'];
var color = ['blue', 'red', 'green'];

function hack() {
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Naciśnij przycisk poniżej, aby rozpocząć minigrę';
    hackFunction.style.display = 'none';
    progressBarBox.style.display = 'none';
    hackCount.style.display = 'none';
    hackLevel.style.display = 'none';
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.getElementById('number-a').textContent = String(attempts);
    document.getElementById('number-w').textContent = String(wins);
    document.getElementById('number-l').textContent = String(loses);
}

function startHack() {
    levelCount = 0;
    attempts++;
    document.getElementById('number-a').textContent = String(attempts);
    localStorage.setItem('attempts', attempts);
    hackTitleBox.style.display = 'none';
    hackOptions.style.display = 'none';
    hackFunction.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Przygotuj się...';
    progressBarBox.style.display = 'block';
    hackCount.style.display = 'none';
    hackLevel.style.display = 'none';
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
    hackCount.style.display = 'none';
    hackLevel.style.display = 'none';
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
    hackCount.style.display = 'none';
    hackLevel.style.display = 'none';
    progressBarBox.style.display = 'block';
    progressBar('end', 8);
}

function nextLevel() {
    randomColor = colors[Math.floor(Math.random() * colors.length)];
    randomPlaceholderColor = color[Math.floor(Math.random() * color.length)];
    input.value = '';
    input.placeholder = 'Ile było pól koloru ' + randomColor + '?';
    input.style.setProperty('--randomColor', randomPlaceholderColor);
    input.style.color = randomPlaceholderColor;
    hackTitle.textContent = 'Odpowiedz';
    hackFunction.style.display = 'none';
    hackCount.style.display = '';
    hackLevel.style.display = '';
    progressBar('remember', playTime);
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
                hackLevel.style.display = '';
                createGrid();
                progressBar('game', playTime);
                return;
            }
            if (w === 'game') {
                hackTitleBox.style.display = '';
                hackInfoBox.style.display = 'none';
                hackFunction.style.display = '';
                hackLevel.style.display = '';
                nextLevel();
                return;
            }
            if (w === 'remember') {
                hackFunction.style.display = 'none';
                hackCount.style.display = '';
                hackInfoBox.style.display = 'none';
                hackLevel.style.display = '';
                check();
                return;
            }
            if (w === 'end') {
                hackFunction.style.display = 'none';
                hackTitleBox.style.display = 'none';
                progressBarBox.style.display = 'none';
                hackOptions.style.display = '';
                hackCount.style.display = 'none';
                hackInfo.textContent = 'Naciśnij przycisk poniżej, aby ponownie rozpocząć minigrę';
            }
        }
    }

    clearInterval(progressBarInterval);
    progressBarInterval = setInterval(updateProgress, t)
}

function createGrid() {
    hackFunction.innerHTML = '';

    randomColors(3, Math.floor(Math.random() * (12 - 6 + 1) + 6));

    for (let i = 0; i < height * width; i++) {
        const el = document.createElement('div');
        el.classList.add('square');

        el.setAttribute('id', i);

        hackFunction.appendChild(el);
    }

    generateColors('blue', numbers[0])
    generateColors('red', numbers[1])
    generateColors('green', numbers[2])

    levelCount++;  

    hackFunction.style.display = '';
    hackCount.style.display = 'none';
    hackTitle.textContent = 'Zapamiętaj';
    level.textContent = levelCount;
}

function generateColors(col, num) {
    for (let i = 0; i < num; i++) {
        let random = Math.floor(Math.random() * 49);
        let el = document.getElementById(random);
        let good = true;

        if (hasClass(el, 'blue') || hasClass(el, 'red') || hasClass(el, 'green')) {
            generateColors(col, 1);
            good = false;
        }

        if (good) document.getElementById(random).classList.add(col)
    }
}

function randomColors(a, n) {
    let array = new Array(a);

    for (let i = 0; i < array.length; i++) {
        array[i] = 2;
    }

    for (let i = 0; i < n; i++) {
        array[Math.floor(Math.random() * n) % a]++;
    }

    for (let i = 0; i < a; i++) {
        numbers[i] = array[i];
    }
}

function hasClass(el, className) {
    return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
}

function check() {
    for (let i = 0; i < 3; i++) {
        if (randomColor === colors[i]) {
            if (parseInt(input.value) === numbers[i]) {
                if (levelCount < 5) {
                    progressBar('game', playTime);
                    createGrid();
                    return;
                } else {
                    gameWin();
                    return;
                }
            }
        }
    }
    gameOver();
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        check();
    }
})

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
