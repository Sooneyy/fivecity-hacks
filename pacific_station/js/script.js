const words = {
    "arr1": ["Radio", "Zapałki", "Git", "Przełącznik", "Kołdra", "Szafka", "Myszka komputerowa", "Klawiatura", "Rzeka", "Portfel"],
    "arr2": ["Talerz", "Telefon", "Ramka", "Basen", "Kabel", "Drzewo", "Klip", "Balon", "Głośniki", "Pudełko"],
    "arr3": ["Worek", "Koc", "Klamka", "Ściana", "Led", "Wat", "Bateria", "Maskotka", "Banknot", "Lodówka"],
    "arr4": ["Kot", "Niedźwiedź", "Filtr", "Chusteczki higieniczne", "Procesor", "Zmywarka", "Piekarnik", "Serwetka", "Przewód", "Gniazko"],
    "arr5": ["Opiekacz", "Dokument", "Język", "Ręcznik", "Pies", "Butelka", "Moneta", "Kieszeń", "Czapka z daszkiem", "Plecak"],
    "arr6": ["Obiektyw", "Krzesło", "Album", "Klej", "Rondel", "Spinacz", "Morze", "Rzeka", "Podziemie", "Klucz do drzwi"],
    "arr7": ["Kamera", "Zdalne sterowanie", "Sztuczna inteligencja", "Maszyna", "Robot", "Programowanie", "Rakieta", "Samolot", "Pompka", "Farba", "Jedzenie"],
    "arr8": ["Deska", "Tkanina", "Kuchenka", "Instagram", "Okap", "Zamrażarka", "Piec", "Król", "Książe", "Kryształ"],
    "arr9": ["Kokaina", "Serial", "Film", "Nazwa", "Witamina", "Podkładka", "Mięsień", "Przedłużacz", "Design", "Pokój"],
    "arr10": ["Dwór", "Huśtawka", "Miasto", "Kraj", "Wojna", "Dodawanie", "Ciąg liczb", "Panel podłogowy", "Monitor", "Aplikacja konsolowa"]
}

const gameConfig = {
    playTime: 20, // Normalny czas
    startTime: 12, // 4 sekundy
    endTime: 12, // 4 sekundy
    gameStarted: false,
    hackTitle: "Kliknij w odpowiedni",
    hackInfo: "",
    level: 0,
    levelCount: 15
}

const app = Vue.createApp({
    data(){
        return{
            ...gameConfig,
            timeInterval: null,
            hackTimerInterval: null,
            progressInterval: null,
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
            words: { ...words },
            wordsArr: [],
            aldBeenWords: [],
            randomWord: "",
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

            this.wordArr = [];
            this.level = 0;
            this.aldBeenWords = [];

            this.createGame();

            this.gameType = "start";
            this.hackTimerStart();
            this.initGame();
        },
        initGame(){
            this.hackInfo = "Przygotuj się";
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

                    this.gameType = "end";
                    break;
                }
                case "end": {
                    this.updateProgress(this.endTime);

                    this.gameStarted = false;
                    this.hackInfo = this.gameResult ? "Hack Udany" : "Hack Nieudany";

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
            for(let i = 1; i <= 10; i++){
                let word = this.words["arr" + i][Math.floor(Math.random() * 10)];

                this.wordsArr.push(word);
            }

            this.createWord();
        },
        createWord(){
            let word = this.wordsArr[Math.floor(Math.random() * this.wordsArr.length)];

            if(word === this.randomWord){
                this.createWord();
                return;
            };
            
            this.randomWord = word;
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
                    clearInterval(this.progressInterval);
                    clearInterval(this.hackTimerInterval);
                    this.showHackBox = false;
                    this.showHackTimer = false;
                }else{
                    this.initGame();
                }
            }
        },
        //Events
        checkBeenWord(){
            if(this.aldBeenWords.includes(this.randomWord)){
                this.createWord();
                this.level++;
            }else{
                this.gameLose();
            }

            this.checkLevel();
        },
        checkNewWord(){
            if(!this.aldBeenWords.includes(this.randomWord)){
                this.aldBeenWords.push(this.randomWord);

                this.level++;
                this.createWord();
            }else{
                this.gameLose();
            }

            this.checkLevel();
        },
        checkLevel(){
            if(this.level === 15){
                this.gameWin();
            }
        }
    },
    mounted(){
        this.timeInterval = setInterval(this.timeCounter, 1000);

        this.timeCounter();
    },
    beforeUnmount(){
        clearInterval(timeInterval);
    },
}).mount("#app")