const valuesArrayElement = document.getElementById("h1SkaitluVirkne");
const outputElement = document.getElementById("systemOutput");
const playerPointsElement = document.getElementById("playerPoints");
const computerPointsElement = document.getElementById("computerPoints");

class NumberGame {
    constructor() {
      this.playerScore = 0;
      this.computerScore = 0;
      this.currentPlayer = 0; 
      this.values = [];
    }

    // spēlētājs ievada virknes garumu
    init() {
        let arrayLength = 0
        while (arrayLength < 5 || arrayLength > 25 || isNaN(arrayLength)) { // pagaidām debuggošanai atstāju uz 5 - 25
            arrayLength = prompt("Izvēlieties skaitļu virknes garumu (5-25):");
        }
        this.generateValues(arrayLength);
        this.startGame();
      }
    
    // masīvā values tiek ģenerēti random skaitļi no 1-9
    generateValues(arrayLength) {
        let valuesTxt = "";
        for (let i = 0; i < arrayLength; i++) {
            let randomelem = Math.floor(Math.random() * 9) + 1;
            skVirkneTxt += " " + randomelem + "<span class=\"mini-font\"><i>" + i + "</i></span>&nbsp;&nbsp;";
            this.values.push(randomelem);
        }
        valuesArrayElement.innerHTML = valuesTxt;
    }

    // pati spēles loģika
    async startGame()  {
        while (this.values.length > 1) { // spēle turpinās līdz values masīvā vairs nav skaitļu, ko saskaitīt
            let valueString = "";
            playerPointsElement.innerHTML = this.playerScore;
            computerPointsElement.innerHTML = this.computerScore;
                for (let i=0; i<this.values.length; i++) {
                    valueString += this.values[i] + "<span class=\"mini-font\"><i>" + i + "</i></span>&nbsp;&nbsp;";
                }
                valuesArrayElement.innerHTML = valueString; 
            // pagaidām spēli vienmēr iesāk spēlētājs
            if (this.currentPlayer == 0) { // spēlētājs reprezentē 0, dators- 1
                const {valueOne, valueTwo} = await this.playerMove(); // cilvēks veic savu gājienu, metodes var apskatīt zemāk
                let sum = this.values[valueOne] + this.values[valueTwo]; 
                this.editArray(valueOne, sum); // balstoties uz saskaitīto skaitļu summas veicam izmaiņas virknē
                this.points(sum, this.currentPlayer); // saskaitām punktus
            } else { // datora kārta, ja currentPlayer = 1
                let [valueOne, valueTwo] = this.computerMove(); // dators veic gājienu, pārējais notiek tā pat
                let sum = this.values[valueOne] + this.values[valueTwo];
                this.editArray(valueOne, sum); 
                this.points(sum, this.currentPlayer); 
            }

            this.currentPlayer = 1 - this.currentPlayer; // gājiena beigās nomainas spēlētājs
        }
        
        this.winner(this.computerScore, this.playerScore); // kad algoritms iziet no cikla, uzzinām uzvarētāju

    }

    // values masīvs tiek izmainīts pēc spēles noteikumiem
    editArray(valueOne, sum) {
        let newValue;
        if (sum > 7) {
            newValue = 1;
        } else if (sum < 7) {
            newValue = 3;
        } else {
            newValue = 2;
        }
        this.values.splice(valueOne, 2, newValue);
    }

    // saskaitām punktus pēc spēles noteikumiem
    points(sum, currentPlayer) {
        if (currentPlayer == 0) {
        if (sum > 7) {
            this.playerScore += 2;
        } else if (sum < 7) {
            this.computerScore -= 1;
        } else {
            this.playerScore -= 1;
        }
        }

        if (currentPlayer == 1) {
            if (sum > 7) {
                this.computerScore += 2;
            } else if (sum < 7) {
                this.playerScore -= 1;
            } else {
                this.computerScore -= 1;
            }
            }
    }

    // self explanatory
    winner() {
        playerPointsElement.innerHTML = this.playerScore;
        computerPointsElement.innerHTML = this.computerScore;
        if (this.playerScore > this.computerScore) {
            outputElement.innerHTML = "You won!";
        } else if (this.computerScore > this.playerScore) { 
            outputElement.innerHTML = "You lost...";
        } else { outputElement.innerHTML = "It's a tie."; } 
    }

    // no spēlētāja veiktās ievades izgūstam valueOne un valueTwo jeb saskaitāmo skaitļu pozīcijas
    async playerMove() { 
        //pagaidām jāievada tikai pirmo elementu, valueTwo ir izvēlētais + 1
        outputElement.innerHTML = "Izvēlies savu skaitļu pāri!";

        return new Promise(resolve => { 
            document.getElementById("okButton").addEventListener("click", function() {
                const inputText = document.getElementById("textField").value.trim();
                const valueOne = parseInt(inputText);
                const valueTwo = valueOne + 1;
                resolve({ valueOne, valueTwo });
            });
        });
    }    
    
    // dators izvēlas random skaitļus, ar kuriem veikt gājienu. Realitātē šī metode būtu jāsadala variantā, kad dators
    // spēlē ar minimax un ar alpha beta un jāimplementē algoritmi. 
    computerMove() {
        let index = Math.floor(Math.random() * (this.values.length - 1));
        return [index, index + 1];
    }
}

const game = new NumberGame();
game.init();

