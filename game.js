const valuesArrayElement = document.getElementById("h1SkaitluVirkne");
const outputElement = document.getElementById("systemOutput");
const playerPointsElement = document.getElementById("playerPoints");
const computerPointsElement = document.getElementById("computerPoints");

// comment

class NumberGame {
    constructor() {
      this.playerScore = 0;
      this.computerScore = 0;
      this.currentPlayer = 0; 
      this.values = [];
    }

    init() {
        let arrayLength = 0
        while (arrayLength < 5 || arrayLength > 25 || isNaN(arrayLength)) { // pagaidām atstāju uz 5 - 25
            arrayLength = prompt("Izvēlieties skaitļu virknes garumu (5-25):");
        }
        this.generateValues(arrayLength);
        this.startGame();
      }
    
    generateValues(arrayLength) {
        let valuesTxt = "";
        for (let i = 0; i < arrayLength; i++) {
            let randomelem = Math.floor(Math.random() * 9) + 1;
            valuesTxt += " " + randomelem + "<span class=\"mini-font\"><i>" + i + "</i></span>&nbsp;&nbsp;";
            this.values.push(randomelem);
        }
        valuesArrayElement.innerHTML = valuesTxt;
    }

    async startGame()  {
        while (this.values.length > 1) { 
            let valueString = "";
            playerPointsElement.innerHTML = this.playerScore;
            computerPointsElement.innerHTML = this.computerScore;
                for (let i=0; i<this.values.length; i++) {
                    valueString += this.values[i] + "<span class=\"mini-font\"><i>" + i + "</i></span>&nbsp;&nbsp;";
                }
                valuesArrayElement.innerHTML = valueString; 
            // pagaidām spēli vienmēr iesāk spēlētājs
            if (this.currentPlayer == 0) { // spēlētājs - 0, dators- 1
                const {valueOne, valueTwo} = await this.playerMove(); 
                let sum = this.values[valueOne] + this.values[valueTwo]; 
                this.editArray(valueOne, sum); 
                this.points(sum, this.currentPlayer); 
            } else { 
                let [valueOne, valueTwo] = this.computerMove(); 
                let sum = this.values[valueOne] + this.values[valueTwo];
                this.editArray(valueOne, sum); 
                this.points(sum, this.currentPlayer); 
            }

            this.currentPlayer = 1 - this.currentPlayer; 
        }
        
        this.winner(this.computerScore, this.playerScore); 

    }

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

    winner() {
        playerPointsElement.innerHTML = this.playerScore;
        computerPointsElement.innerHTML = this.computerScore;
        if (this.playerScore > this.computerScore) {
            outputElement.innerHTML = "You won!";
        } else if (this.computerScore > this.playerScore) { 
            outputElement.innerHTML = "You lost...";
        } else { outputElement.innerHTML = "It's a tie."; } 
    }

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
    
    // pagaidām ators izvēlas random skaitļus, ar kuriem veikt gājienu. Realitātē šeit jāimplementē minimax un alpha beta apruning
    computerMove() {
        let index = Math.floor(Math.random() * (this.values.length - 1));
        return [index, index + 1];
    }
}

const game = new NumberGame();
game.init();

