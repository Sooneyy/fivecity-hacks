const gameConfig = {
    playTime: 15, // Normalny czas
    startTime: 24, // 4 sekundy
    endTime: 12, // 4 sekundy
    gameStarted: false,
    hackTitle: "Zapełnij cały żółty pasek w wyznaczonym czasie",
    hackInfo: "",
}

const app = Vue.createApp({
    data(){
        return{
            ...gameConfig,
            timeInterval: null,
            hackTimerInterval: null,
            progressInterval: null,
            mainDotInterval: null,
            redDotSpawnTimeout: null,
            wormScaleTimeout: null,
            hours: 0,
            minutes: 0,
            midDay: "",
            hackTimeStart: 0,
            hackMinutes: 0,
            hackSeconds: 0,
            showHackTimer: false,
            showHackBox: false,
            gameType: "start",
            gameResult: false,
            width: 1000,
            mainDot: {x: 9, y: 9, velocity: 2},
            redDots: [],
            worm: {},
            bullets: [],
            targets: [],
            validKeys: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
            keys: {},
            targetsCount: 40,
            destroyedTargets: 0,
            health: 100,
        }
    },
    computed: {
        getProgressWidth(){
            return this.width / 1000 * 100;
        }
    },
    methods: {
        // Timers
        timeCounter(){
            let time = new Date();

            this.hours = time.getHours() < 12 ? time.getHours() : time.getHours() - 12;
            this.minutes = String(time.getMinutes()).padStart(2, "0");
            this.midDay = time.getHours() < 12 ? "AM" : "PM";
        },
        hackTimerStart(){
            this.hackTimeStart = new Date();

            this.hackTimerCounter();

            clearInterval(this.hackTimerCounter);
            hackTimerInterval = setInterval(this.hackTimerCounter, 1000);
        },
        hackTimerCounter(){
            let now = new Date();
            let timeDiff = new Date();

            timeDiff.setTime(now - this.hackTimeStart);

            this.hackMinutes = String(timeDiff.getMinutes()).padStart(2, "0");
            this.hackSeconds = String(timeDiff.getSeconds()).padStart(2, "0");
        },
        // Game Functions
        startGame(){
            if(this.showHackBox) return;

            this.redDots = [];
            this.targets = [];
            this.bullets = [];
            this.health = 100;
            this.destroyedTargets = 0;
            this.mainDot.x = 9;
            this.mainDot.y = 9;

            this.createGame();

            this.gameType = "start";
            this.hackTimerStart();
            this.initGame();
        },
        initGame(){
            this.hackInfo = "Przygotuj się...";
            this.lettersArr = [];
            this.currentIndex = 0;

            this.showHackBox = true;
            this.showHackTimer = true;

            switch(this.gameType){
                case "start": {
                    this.updateProgress(this.startTime);

                    this.gameType = "inProgress";
                    break;
                }
                case "inProgress": {
                    this.updateProgress(this.playTime);

                    this.gameStarted = true;

                    this.moveMainDot();
                    this.spawnWorm();
                    this.setRandomWormScale();
                    setTimeout(this.spawnRedDot, 2000);

                    this.gameType = "end";
                    break;
                }
                case "end": {
                    this.updateProgress(this.endTime);

                    this.gameStarted = false;
                    this.hackInfo = this.gameResult ? "Hack Udany" : "Hack Nieudany";

                    clearInterval(this.mainDotInterval)
                    clearTimeout(this.wormScaleTimeout)
                    clearTimeout(this.redDotSpawnTimeout);

                    this.gameType = "endGame";
                    break;
                }
            }
        },
        gameWin(){
            this.gameType = "end";
            this.gameResult = true;
            this.initGame();
        },
        gameLose(){
            this.gameType = "end";
            this.gameResult = false;
            this.initGame();
        },
        createGame(){
            let randomCount = Math.floor(Math.random() * 5 + 3) + 5;

            for(let i = 0; i < randomCount; i++){
                let randomX = getRandomInt(3, 447);
                let randomY = getRandomInt(3, 447);
                let color = ["blue", "yellow"];

                this.targets.push({
                    x: randomX,
                    y: randomY,
                    color: Math.random() < 0.05 ? color[0] : color[1],
                })
            }
        },
        createTargetDot(){
            let randomX = getRandomInt(3, 447);
            let randomY = getRandomInt(3, 447);
            let color = ["blue", "yellow"];

            this.targets.push({
                x: randomX,
                y: randomY,
                color: Math.random() < 0.05 ? color[0] : color[1],
            })
        },
        spawnRedDot(){
            let direction = ["left", "right", "top", "bottom"][Math.floor(Math.random() * 4)];
            let randomPos = getRandomInt(15, 435);
            let spawnDirection;

            if(direction === "left" || direction === "right"){
                spawnDirection = "top";
            }else{
                spawnDirection = "left";
            }

            this.redDots.push({
                dir: direction,
                spawnDir: spawnDirection,
                spawnPos: randomPos,
                pos: -45,
            })

            this.redDotSpawnTimeout = setTimeout(this.spawnRedDot, 300);
        },
        animateRedDot(){
            for(let i = 0; i < this.redDots.length; i++){
                if(this.redDots[i].pos > 475) this.redDots.splice(i, 1);

                this.redDots[i].pos += 3;
            }

            const els = document.getElementsByClassName("red-dot");

            for(let i = 0; i < els.length; i++) {
                const rect = els[i].getBoundingClientRect();
                const rect2 = this.$refs.main.getBoundingClientRect();
                
                const horizontal = rect2.x + 18 > rect.left && rect2.x < rect.left + rect.width;
                const vertical = rect2.y + 18 > rect.top && rect2.y < rect.top + rect.height
                if(horizontal && vertical) {
                    this.health -= 50;
                    this.redDots.splice(i, 1);

                    if(this.health === 0) this.gameLose();
                };
            }
        },
        spawnWorm(){
            this.worm = {
                x: 700,
                y: 700,
                scale: 2,
                velocity: 1,
                rotate: 45,
                hp: 100,
            }
        },
        getDotStyle(dot){
            return {
                [dot.dir]: dot.pos + 'px',
                [dot.spawnDir]: dot.spawnPos + 'px'
            }
        },
        // Progress
        updateProgress(time){
            this.width = 1000;

            clearInterval(this.progressInterval);
            this.progressInterval = setInterval(this.updateProgressWidth, time);
        },
        updateProgressWidth(){
            if(this.gameType === "inProgress" || this.gameType === "endGame") this.width -= 3;
            else this.width--; 

            if(this.getProgressWidth <= 0){
                if(this.gameType === "endGame"){
                    this.showHackBox = false;
                    this.showHackTimer = false;
                    clearInterval(this.progressInterval);
                    clearInterval(this.hackTimerInterval);
                }else{
                    this.initGame();
                }
            }
        },
        isWithinRadius(trg){
            const horizontal = Math.abs(this.mainDot.x + 9 - trg.x);
            const vertical = Math.abs(this.mainDot.y + 9 - trg.y);
            
            const isWithinRadius = horizontal <= 35 && vertical <= 35;

            return isWithinRadius;
        },
        calculateWormRotate(){
            let deltaX = this.worm.x - this.mainDot.x;
            let deltaY = this.worm.y - this.mainDot.y;
            
            let radian = Math.atan2(deltaY, deltaX);
            let degrees = radian * (180 / Math.PI);

            this.worm.rotate = degrees;
        },
        async animateTargetDot(dot){
            return new Promise((resolve) => {
                if(dot.x < this.mainDot.x + 5){
                    dot.x += 4;
                }

                if(dot.x > this.mainDot.x + 5){
                    dot.x -= 4;
                }

                if(dot.y < this.mainDot.y + 5){
                    dot.y += 4;
                }

                if(dot.y > this.mainDot.y + 5){
                    dot.y -= 4;
                }
                
                if(dot.y < this.mainDot.y + 18 && dot.y + 4 > this.mainDot.y && dot.x < this.mainDot.x + 18 && dot.x + 4 > this.mainDot.x) resolve(true);
            })
        },
        animateWorm(){
            if(this.worm.x < this.mainDot.x){
                this.worm.x += this.worm.velocity;
            }

            if(this.worm.x > this.mainDot.x){
                this.worm.x -= this.worm.velocity;
            }

            if(this.worm.y < this.mainDot.y){
                this.worm.y += this.worm.velocity;
            }

            if(this.worm.y > this.mainDot.y){
                this.worm.y -= this.worm.velocity;
            }
     
            const wormRect = document.querySelector(".worm-body").getBoundingClientRect();

            const disX = this.worm.x - this.mainDot.x;
            const disY = this.worm.y - this.mainDot.y;

            const dist = Math.sqrt(disX ** 2 + disY ** 2);
            const centerDistance = wormRect.width / 2 + 9;

            if(dist <= centerDistance) this.gameLose();

            for(let i = 0; i < this.bullets.length; i++){
                if(this.bullets[i].y < this.worm.y + wormRect.height && this.bullets[i].y + 2 > this.worm.y && this.bullets[i].x < this.worm.x + wormRect.width && this.bullets[i].x + 2 > this.worm.x){
                    this.worm.hp -= 10;
                    this.bullets.splice(i, 1);

                    if(this.worm.hp === 0){
                        this.worm.x = 700;
                        this.worm.y = 700;
                        this.worm.hp = 100;
                    }
                }
            }
        },
        setRandomWormScale(){
            let scales = [1, 2, 3];
            let velocities = [1.5, 1, .5];
            let rnd = getRandomInt(0, 3);
            let rndTimeout = getRandomInt(1000, 4500);

            this.worm.scale = scales[rnd];
            this.worm.velocity = velocities[rnd];

            this.wormScaleTimeout = setTimeout(this.setRandomWormScale, rndTimeout);
        },
        getWormScale(worm){
            return `skala${worm.scale}`;
        },
        fireBullet(e){
            const rect = this.$refs.main.getBoundingClientRect();
            const boardRect = this.$refs.board.getBoundingClientRect();

            const deltaX = (e.clientX - boardRect.left) - (this.mainDot.x + 5);
            const deltaY = (e.clientY - boardRect.top) - (this.mainDot.y + 5);
            const angle = Math.atan2(deltaY, deltaX);

            let speed = 100;
            const velX = speed * Math.cos(angle);
            const velY = speed * Math.sin(angle);

            const backVelX = -10 * Math.cos(angle);
            const backVelY = -10 * Math.sin(angle);

            this.bullets.push({
                x: this.mainDot.x + 5, 
                y: this.mainDot.y + 5,
                velX: velX,
                velY: velY,
                backVelX: backVelX,
                backVelY: backVelY,
                moveTime: 0,
                moveForward: true,
            });
        },
        //Events
        moveMainDot(){
            this.mainDotInterval = setInterval(async () => {
                for(let i = 0; i < this.targets.length; i++){
                    if(this.isWithinRadius(this.targets[i])){
                        this.animateTargetDot(this.targets[i]).then((ovrlap) => {
                            if(ovrlap){
                                if(this.targets[i].color === "yellow"){
                                    this.targets.splice(i, 1);
                                    this.destroyedTargets++;
                                    this.createTargetDot();
                                }else{
                                    this.targets.splice(i, 1);
                                    this.destroyedTargets+=2;
                                    this.createTargetDot();
                                }

                                if(this.destroyedTargets >= this.targetsCount){
                                    this.gameWin();
                                }
                            }
                        })
                        continue;
                    }
                }

                if(this.redDots.length > 0){
                    this.animateRedDot();
                }
                this.animateWorm();
                this.calculateWormRotate();

                for(let i = 0; i < this.bullets.length; i++){     
                    if(this.bullets[i].moveTime >= 1.6){
                        this.bullets[i].moveForward = !this.bullets[i].moveForward;
                        this.bullets[i].moveTime = 0;
                    }
                    
                    if(this.bullets[i].moveForward){
                        this.bullets[i].x += this.bullets[i].velX * 0.2;
                        this.bullets[i].y += this.bullets[i].velY * 0.2;
                    }else{
                        this.bullets[i].x += this.bullets[i].backVelX * 0.2;
                        this.bullets[i].y += this.bullets[i].backVelY * 0.2;
                    }

                    if(this.bullets[i].x < -5 || this.bullets[i].y < -5 || this.bullets[i].x > 455 || this.bullets[i].y > 455) this.bullets.splice(i, 1);
                    else this.bullets[i].moveTime += 0.2
                }
        
                if(this.keys[this.validKeys[0]]){
                    if(this.mainDot.y > -9){
                        this.mainDot.y -= this.mainDot.velocity;
                    }
                }

                if(this.keys[this.validKeys[1]]){
                    if(this.mainDot.y < 441){
                        this.mainDot.y += this.mainDot.velocity;
                    }
                }

                if(this.keys[this.validKeys[2]]){
                    if(this.mainDot.x > -9){
                        this.mainDot.x -= this.mainDot.velocity;
                    }
                }

                if(this.keys[this.validKeys[3]]){
                    if(this.mainDot.x < 441){
                        this.mainDot.x += this.mainDot.velocity;
                    }
                }
            }, 10)
        }
    },
    mounted(){
        window.addEventListener("keydown", (e) => {
            this.keys[e.key] = true;
        });
        window.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
        });

        this.timeInterval = setInterval(this.timeCounter, 1000);

        this.timeCounter();
    },
    beforeUnmount(){
        clearInterval(timeInterval);
    },
}).mount("#app");

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}