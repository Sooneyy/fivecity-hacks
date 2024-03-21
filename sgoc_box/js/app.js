const hackBox = document.querySelector('.hack-box');
const hackFunction = document.querySelector('.hack-fn');
const hackTitleBox = document.querySelector('.hack-title');
const hackTitle = document.getElementById('hack-title-text');
const hackInfoBox = document.querySelector('.hack-info');
const hackInfo = document.getElementById('hack-info-text');
const buttons = document.querySelector('.play-buttons');
const progressBarBox = document.querySelector('.hack-progress')
const progressBarFn = document.getElementById('progress-bar-fn');
const timer = document.querySelector('.timer');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

var progressBarInterval, timerInterval;
var playTime = 80;
var dotsAmount = 13;
var selectedDot = null;
var offset = {x: 0, y: 0};
var dots = [];
var lines = [];
var intersections = [];
var randomColor;
var gameStarted = false;
var colors = [
    { primary: "#7A47B2", secondary: "#ffd6fc" },
    { primary: "#f21505", secondary: "#ffb300" },
    { primary: "#09ff00", secondary: "#d6fad4" },
    { primary: "#0015ff", secondary: "#00d5ff" },
    { primary: "#3c2652", secondary: "#9181a1" },
    { primary: "#ff7300", secondary: "#ffe2c9" },
    { primary: "#242500", secondary: "#D1D3AF" },
    { primary: "#03539E", secondary: "#EEA47F" },
    { primary: "#E2D2F9", secondary: "#317873" },
    { primary: "#FE69B3", secondary: "#00FFFF" },
    { primary: "#89ABE3", secondary: "#EA738D" },
    { primary: "#2C5E2D", secondary: "#98BC61" },
    { primary: "#2F2E30", secondary: "#11A2D8" },
    { primary: "#0C1138", secondary: "#697A82" },
]

function hack() {
    hackInfoBox.style.display = 'none';
    hackBox.style.display = 'none';
    hackFunction.style.display = 'none';
    progressBarBox.style.display = 'none';
}

function startHack() {
    gameStarted = true;
    intersections = [];
    randomColor = colors[Math.floor(Math.random() * colors.length)];
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
    hackTitle.innerHTML = 'Rozplącz Linie';
    hackTitleBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackBox.style.display = '';
    hackInfoBox.style.display = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    while(intersections < 1){
        createDots();
        createLines();
        drawLines();
        drawDots();
    }
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
                hackInfoBox.style.display = 'none';
                hackBox.style.display = 'none';
                gameStarted = false;
                clearInterval(progressBarInterval);
            }
        }
    }

    clearInterval(progressBarInterval);
    progressBarInterval = setInterval(updateProgress, t)
}

canvas.width = 400;
canvas.height = 400;

function createDots(){
    let radius = 160;
    let centerX = 200;
    let centerY = 200;
    dots = [];

    for(let i = 0; i < dotsAmount; i++){
        dots.push({
            x: Math.floor(centerX + radius * Math.cos(2 * Math.PI * i / dotsAmount)),
            y: Math.floor(centerY + radius * Math.sin(2 * Math.PI * i / dotsAmount))
        })
    }
}

function drawDots(){
    ctx.fillStyle = randomColor.primary;
    ctx.strokeStyle = "#DFD3DE";
    ctx.lineWidth = 5;

    dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 6, 0, Math.PI * 2);
        ctx.shadowBlur = 2;
        ctx.shadowColor = "rgba(0, 0, 0, .5)";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.stroke();
        ctx.fill();
    })
}

function createLines(){
    lines = [];
    let limit = new Array(dots.length).fill(0);
    let maxConnects = 4;
    let finish = false;

    while(finish === false){
        let from = random(0, dots.length);
        let to = random(0, dots.length);

        if(from === to) continue;
        if(limit[from] === maxConnects || limit[to] === maxConnects) continue;
        if(lines.filter((line) => line.start === from && line.end === to).length > 0) continue;
        if(lines.filter((line) => line.start === to && line.end === from).length > 0) continue;

        limit[from] += 1;
        limit[to] += 1;

        lines.push({
            start: from,
            end: to
        })

        finish = true;

        limit.forEach((num) => {
            if(num < 2) finish = false;
        })
    }
}

function getLineDot(index){
    return dots[index];
}

function detectIntersects(){
    intersections = [];
    lines.forEach((line) => line.intersecting = null);
    for(let i = 0; i < lines.length; i++){
        for(let j = i + 1; j < lines.length; j++){
            const line1 = lines[i];
            const line2 = lines[j];
            
            let intersection = getIntersection(getLineDot(line1.start).x, getLineDot(line1.start).y, getLineDot(line1.end).x, getLineDot(line1.end).y, getLineDot(line2.start).x, getLineDot(line2.start).y, getLineDot(line2.end).x, getLineDot(line2.end).y);
            const linepoints = [getLineDot(line1.start), getLineDot(line1.end), getLineDot(line2.start), getLineDot(line2.end)];
            if (intersection != null && linepoints.some(item => item.x === intersection.x && item.y === intersection.y)) {
                intersection = null;
            }
            if (intersection) {
                intersections.push(intersection);
            }
        
            if (intersection != null) {
                line1.intersecting = true;
                line2.intersecting = true;
            }
        }
    }
}

function drawLines(){
    detectIntersects();

    ctx.strokeStyle = randomColor.primary;
    ctx.lineWidth = 2;

    lines.forEach((line) => {
        const {start, end} = line;
        ctx.beginPath();
        ctx.moveTo(getLineDot(start).x, getLineDot(start).y);
        ctx.lineTo(getLineDot(end).x, getLineDot(end).y);
        if(line.intersecting){
            ctx.strokeStyle = randomColor.secondary;
            ctx.shadowBlur = 0;
            ctx.shadowColor = "rgba(0, 0, 0, 0)";
        }else{
            ctx.strokeStyle = randomColor.primary;
        }

        ctx.stroke();
    });
}

function getIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const det1 = (x1 - x2) * (y3 - y4);
    const det2 = (y1 - y2) * (x3 - x4);
    const det = det1 - det2;
    if (det === 0) {
      return null;
    }
    const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / det;
    const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / det;
    if (x < Math.min(x1, x2) || x > Math.max(x1, x2) || y < Math.min(y1, y2) || y > Math.max(y1, y2)) {
        return null;
    }
    if (x < Math.min(x3, x4) || x > Math.max(x3, x4) || y < Math.min(y3, y4) || y > Math.max(y3, y4)) {
        return null;
    }
    return { x: x, y: y };
}

function refreshCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    drawDots();
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

$(document).ready(function () {
    $("#canvas").on("mousedown", function(e){
        for(let i = 0; i < dots.length; i++){
            const dot = dots[i];
            const dx = e.offsetX - dot.x;
            const dy = e.offsetY - dot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if(distance <= 7){
                selectedDot = dot;
                offset.x = dx;
                offset.y = dy;
                break;
            }
        }
    })

    $("#canvas").on("mousemove", function(e){
        if(selectedDot !== null){
            selectedDot.x = e.offsetX - offset.x;
            selectedDot.y = e.offsetY - offset.y;
            refreshCanvas();
        }
    })

    $("#canvas").on("mouseup", function(){
        selectedDot = null;        
        if(intersections.length === 0){
            gameWin();
        }
    })
})

setInterval(function() {
    let time = new Date();
    let hours = time.getHours() <= 12 ? time.getHours() : time.getHours() - 12;
    let midDay = time.getHours() <= 12 ? "AM" : "PM";
  
    document.querySelector(".current-time").textContent = `${midDay} ${hours}:${time.getMinutes().toString().padStart("2", 0)}`;
}, 1000)