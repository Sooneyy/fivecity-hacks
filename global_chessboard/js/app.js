const hackBox = document.querySelector('.hack-box');
const hackFunction = document.querySelector('.hack-fn');
const hackTitleBox = document.querySelector('.hack-title');
const hackTitle = document.getElementById('hack-title-text');
const hackInfoBox = document.querySelector('.hack-info');
const hackInfo = document.getElementById('hack-info-text');
const buttons = document.querySelector('.play-buttons');
const progressBarBox = document.querySelector('.hack-progress')
const progressBarFn = document.getElementById('progress-bar-fn');
const hackOptions = document.querySelector('.hack-options');
const heistButtons = document.querySelector('.heist-buttons');
const cellsInput = document.getElementById("cells-input");
const timeInput = document.getElementById("time-input");
const timer = document.querySelector('.timer');

var progressBarInterval, timerInterval;
var playTime = timeInput;
var defaultTime = 5;
var defaultCellsCount = 5;
var height = cellsInput;
var width = cellsInput;
var antiSolverMode = false;
var isOver = false;
var gameStarted = false;
var wrong = 0;
var lastPosition, bestRoute, goodPositions;
var pieces = [
    "<img src='./assets/pionek.png' alt='pionek' />",
    "<img src='./assets/kon.png' alt='kon' />",
    "<img src='./assets/goniec.png' alt='goniec' />",
    "<img src='./assets/wieza.png' alt='wieza' />",
];

function hack() {
    hackInfoBox.style.display = 'none';
    hackBox.style.display = 'none';
    hackFunction.style.display = 'none';
    progressBarBox.style.display = 'none';
    document.getElementById("cells-count").textContent = defaultCellsCount;
    document.getElementById("time").textContent = defaultTime;
}

function showBox(){
    if(!gameStarted){
        hackBox.style.display = '';
        heistButtons.style.display = '';
        hackOptions.style.display = '';
    }else return;
}

function startHack() {
    isOver = false;
    gameStarted = true;
    lastPosition = 0;
    wrong = 0;
    let start = new Date();
    let updateTime = () => {
        timer.style.display = "block";
        let now = new Date();
        let diff = new Date();

        diff.setTime(now - start);
        timer.textContent = diff.getMinutes().toString().padStart("2", 0) + ":" + diff.getSeconds().toString().padStart("2", 0);
    }
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTime, 1000);
    createGrid();
    hackTitle.innerHTML = 'Dotrzyj z lewego górnego rogu, do prawego dolnego';
    hackTitleBox.style.display = 'none';
    heistButtons.style.display = 'none';
    hackOptions.style.display = 'none';
    hackFunction.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Przygotuj się...';
    progressBarBox.style.display = 'block';
    progressBar('start', 9);
}

function gameWin() {
    hackTitleBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack udany';
    progressBarBox.style.display = 'block';
    progressBar('end', 9);
}

function gameOver() {
    hackFunction.style.display = 'none';
    hackTitleBox.style.display = 'none';
    progressBarBox.style.display = 'block';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack nieudany'
    progressBar('end', 9);
}

function progressBar(w, t) {
    let width = 1000;
    function updateProgress() {
        if (width > 0) {
            if (w === 'start' || w === 'end' || w === 'game') width -= 3;
            else width--;
            progressBarFn.style.width = (width * 100) / 1000 + '%';
        } else {
            if (w === 'start') {
                hackTitleBox.style.display = '';
                hackInfoBox.style.display = 'none';
                hackFunction.style.display = '';
                hackFunction.setAttribute('style', `--cells: ${height.value}`);
                const squares = document.querySelectorAll('.square');
                setTimeout(() => {
                    squares.forEach((sqr) => {
                        if (!sqr.classList.contains('hidden') && !isOver) {
                            sqr.classList.add('hidden');
                        } else return;
                    })
                }, (playTime.value * 1000) / 2)
                progressBar('displaypath', playTime.value);
                return;
            }
            if(w === 'displaypath'){
                isOver = true;
                document.querySelectorAll('.breathing').forEach((b) => b.classList.remove('breathing'));
                document.querySelectorAll('.square').forEach((s) => s.classList.remove('hidden'));
                let squares = document.querySelectorAll('.square');
                goodPositions.forEach(pos => {
                    squares[pos].classList.add('right-path');
                });
                progressBar('game', 9)
            }
            if (w === 'game') {
                gameOver();
                return;
            }
            if (w === 'end') {
                hackFunction.style.display = 'none';
                hackTitleBox.style.display = 'none';
                progressBarBox.style.display = 'none';
                hackInfoBox.style.display = 'none';
                heistButtons.style.display = '';
                hackOptions.style.display = '';
                gameStarted = false;
            }
        }
    }

    clearInterval(progressBarInterval);
    progressBarInterval = setInterval(updateProgress, t)
}

function createGrid() {
    hackFunction.innerHTML = '';

    let breathingPosition = 1;
    bestRoute = generateRoute(breathingPosition);
    goodPositions = Object.keys(bestRoute);

    for (let i = 0; i < height.value * width.value; i++) {
        const el = document.createElement('div');

        el.classList.add('square')

        el.dataset.pos = i.toString();

        let text, value;

        switch (i) {
            case 0: {
                text = 'START'
                break;
            }
            case height.value * width.value - 1: {
                text = 'EXIT';
                break;
            }
            case breathingPosition:
            case (breathingPosition * height.value): {
                el.classList.add('breathing');
                value = random(1, 5);
                text = pieces[value - 1];
                break;
            }
            default: {
                value = random(1, 5)
                text = pieces[value - 1];
            }
        }
        if (goodPositions.includes(i.toString())) {
            value = bestRoute[i]
            text = pieces[value - 1];
        }

        el.innerHTML = text;
        el.dataset.value = value;
        hackFunction.appendChild(el)

        el.onclick = function () {
            const pos = parseInt(this.dataset.pos);

            if (pos === 0) return;

            if (isOver) return;

            if (lastPosition === 0) {
                const breathingEls = document.querySelectorAll('.breathing');
                const squares = document.querySelectorAll('.square');

                squares.forEach((sqr) => {
                    sqr.classList.add('hidden');
                })

                breathingEls.forEach((el) => {
                    el.classList.remove('breathing');
                })

                if (pos === breathingPosition || pos === breathingPosition * Number(height.value)) {
                    lastPosition = pos;
                    this.classList.add('good');
                } else {
                    this.classList.add('bad');
                    wrong++;
                }
            } else {
                let jump = parseInt(document.querySelectorAll('.square')[lastPosition].dataset.value, 10);
                let maxV = maxVertical(lastPosition);
                let maxH = maxHorizontal(lastPosition);

                if (jump <= maxH && pos === lastPosition + jump) {
                    lastPosition = pos;
                    this.classList.add('good');
                } else if (jump <= maxV && pos === lastPosition + (jump * Number(height.value))) {
                    lastPosition = pos;
                    this.classList.add('good');
                } else {
                    wrong++;
                    this.classList.add('bad');
                }
            }

            if (wrong === 3) {
                isOver = true;
                document.querySelectorAll('.breathing').forEach((b) => b.classList.remove('breathing'));
                document.querySelectorAll('.square').forEach((s) => s.classList.remove('hidden'));
                let squares = document.querySelectorAll('.square');
                goodPositions.forEach(pos => {
                    squares[pos].classList.add('right-path');
                });
                progressBar('game', 9)
            }

            if (lastPosition === height.value * width.value - 1 && document.querySelectorAll('.square')[lastPosition].classList.contains('good')) {
                gameWin();
            }
        }
    }
}

function maxVertical(pos) {
    return Math.floor(((height.value * width.value - 1) - pos) / Number(height.value));
}

function maxHorizontal(pos) {
    let max = (pos + 1) % Number(width.value);
    if (max > 0) return Number(width.value) - max;
    else return 0;
}

function check(value){
    if(value > 4){
        return value - 4;
    } else return value;
}

function generateNextPosition(pos) {
    let maxV = maxVertical(pos);
    let maxH = maxHorizontal(pos);

    if (maxV === 0) {
        let newPosition = random(random(1, maxH), maxH);
        let correctPos = check(newPosition);

        return [correctPos, pos + correctPos];
    }
    if (maxH === 0) {
        let newPosition = random(random(1, maxV), maxV);
        let correctPos = check(newPosition);

        return [correctPos, pos + (correctPos * height.value)];
    }
    if (random(1, 1000) % 2 === 0) {
        let newPosition = random(random(1, maxH), maxH);
        let correctPos = check(newPosition);

        return [correctPos, pos + correctPos];
    } else {
        let newPosition = random(random(1, maxV), maxV);
        let correctPos = check(newPosition);

        return [correctPos, pos + (correctPos * height.value)];
    }
}

function generateRoute(startPos) {
    let route = [];
    if (random(1, 1000) % 2 === 0) {
        startPos *= height.value;
    }
    while (startPos < height.value * width.value - 1) {
        let newPos = generateNextPosition(startPos);
        route[startPos] = newPos[0];
        startPos = newPos[1];
    }

    return route;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function cellsCountChange(){
    document.getElementById("cells-count").textContent = cellsInput.value;
}

function timeChange(){
    document.getElementById("time").textContent = timeInput.value;
}

function setOptions(){
    let option = prompt("Opcje pod dany heist, które ustawią Ci się automatycznie\n1 - fleeca zwykła\n2 - fleeca czerwona\n3 - sgoc\nWszystko inne co wpiszesz ustawi defaultowe wartości.");

    switch(option){
        case "1": {
            cellsInput.value = 5;
            timeInput.value = 7;

            break;
        }
        case "2": {
            cellsInput.value = 6;
            timeInput.value = 10;

            break;
        }
        case "3": {
            cellsInput.value = 8;
            timeInput.value = 10;

            break;
        }
        default: {
            cellsInput.value = defaultCellsCount;
            timeInput.value = defaultTime;
        }
    };

    cellsCountChange();
    timeChange();
}

setInterval(function() {
    let time = new Date();
    let hours = time.getHours() <= 12 ? time.getHours() : time.getHours() - 12;
    let midDay = time.getHours() <= 12 ? "AM" : "PM";
  
    document.querySelector(".current-time").textContent = `${midDay} ${hours}:${time.getMinutes().toString().padStart("2", 0)}`;
}, 1000)