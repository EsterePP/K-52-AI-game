const valuesArrayElement = document.getElementById("h1SkaitluVirkne");
const outputElement = document.getElementById("systemOutput");
const playerPointsElement = document.getElementById("playerPoints");
const opponentPointsElement = document.getElementById("opponentPoints");

class NumberGame {
    constructor() {
      this.humanScore = 0;
      this.computerScore = 0;
      this.currentPlayer = 0; 
      this.values = [];
    }

    // Lietotājs ievada virknes garumu. Šis neizskatās smuki tikai tāpēc, ka javascript īsti nav domāts command
    // line lietām, mūsu beigu kodā nekas tāds nebūs
    init() {
        /*const readline = require('readline');
        const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
        });
    
        // Pagaidām var ievadīt pilnīgi jebkādu garumu
        rl.question("Enter length of the number string : ", input => {
          const arrayLength = parseInt(input.trim());
          this.generateValues(arrayLength);
          rl.close();
          this.startGame();
        });*/

        let arrayLength = 0
        while (arrayLength < 15 || arrayLength > 25 || isNaN(arrayLength)) { // ievaddatu pārbaude (vai iekļaujas robežās (15-25), vai ir skaitlis)
            arrayLength = prompt("Izvēlieties skaitļu virknes garumu (15-25):");
        }
        this.generateValues(arrayLength);
        this.startGame();
      }
    
    // masīvā values tiek ģenerēti random skaitļi no 1-9
    generateValues(arrayLength) {
        let skVirkneTxt = "";
        for (let i = 0; i < arrayLength; i++) {
            let randomelem = Math.floor(Math.random() * 9) + 1;
            skVirkneTxt = skVirkneTxt + "   " + randomelem + "(" + i + ")";
            this.values.push(randomelem);
        }
        valuesArrayElement.innerHTML = skVirkneTxt;
    }

    // pati spēles loģika ("async" te ir tikai tāpēc, ka javascript īsti nav domāts command line lietām, tas nav nekas būtisks)
    async startGame()  {
        while (this.values.length > 1) { // spēle turpinās līdz values masīvā vairs nav skaitļu, ko saskaitīt
            let valueString = ""; // izvada masīvu kā skaitļu virkni, lai spēlētājs varētu izvēlēties, kurus skaitļus 
            // var saskaitīt. 
            playerPointsElement.innerHTML = this.humanScore;
            opponentPointsElement.innerHTML = this.computerScore;
                for (let i=0; i<this.values.length; i++) {
                    valueString += this.values[i] + "(" + i + ")" + " ";
                }
                valuesArrayElement.innerHTML = valueString; 
            if (this.currentPlayer == 0) { // spēlētāja kārta (cilvēks reprezentē 0, dators- 1)
                try {
                    const {valueOne, valueTwo} = await this.humanMove(); // cilvēks veic savu gājienu, metodes var apskatīt zemāk
                    let sum = this.values[valueOne] + this.values[valueTwo]; 
                    this.editArray(valueOne, sum); // balstoties uz saskaitīto skaitļu summas veicam izmaiņas virknē
                    this.points(sum, this.currentPlayer); // saskaitām punktus
                } catch (error) {
                    console.error(error.message); 
                }
            } else { // ja currentPlayer vērtība ir 0 (tūlīt tā tiks mainīta) ir datora gājiens
                let [valueOne, valueTwo] = this.computerMove(); // izgšutam jaunos valueOne un valueTwo, ko izvēlas dators
                let sum = this.values[valueOne] + this.values[valueTwo];
                this.editArray(valueOne, sum); // arī balstoties uz daotra veikto gājienu tiek mainīta virkne
                this.points(sum, this.currentPlayer); // un saskaitīti punkti
            }

            this.currentPlayer = 1 - this.currentPlayer; // gājiena beigās nomainas spēlētājs
        }
        
        this.winner(this.computerScore, this.humanScore); // kad algoritms iziet no cikla, uzzinam uzvarētāju

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

    // saskaitām punktus pēc spēles notiekumiem
    points(sum, currentPlayer) {
        if (currentPlayer == 0) {
        if (sum > 7) {
            this.humanScore =+ 2;
        } else if (sum < 7) {
            this.computerScore =- 1;
        } else {
            this.humanScore =-1;
        }
        }

        if (currentPlayer == 1) {
            if (sum > 7) {
                this.computerScore += 2;
            } else if (sum < 7) {
                this.humanScore -= 1;
            } else {
                this.computerScore -= 1;
            }
            }
    }

    // self explanatory
    winner() {
        if (this.humanScore > this.computerScore) {
            outputElement.innerHTML = "You won!";
        } else if (this.computerScore > this.humanScore) { 
            outputElement.innerHTML = "You lost...";
        } else { outputElement.innerHTML = "It's a tie."; } 
    }

    // no spēlētāja veiktās ievades izgūstam valueOne un valueTwo jeb saskaitāmo skaitļu pozīcijas
    async humanMove() { //async prieks [await], lai sagaidītu lietotāja atbildi (skaitļu pāri)
        /*const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        return new Promise((resolve, reject) => {
            readline.question("Enter index of the first value you want to add: ", inputOne => {
                const valueOne = parseInt(inputOne.trim());
    
                readline.question("Enter index of the second value you want to add: ", inputTwo => {
                    const valueTwo = parseInt(inputTwo.trim());
                    
                    if (Math.abs(valueOne - valueTwo) !== 1) {
                        readline.close();
                        reject(new Error('Values not adjacent'));
                    } else {
                        readline.close();
                        resolve({valueOne, valueTwo});
                    }
                });
            });
        });*/


        //bik pamainiju ka ir jaievada tikai pirmo no 2 elementiem, nakotne var mainit
        outputElement.innerHTML = "Izvēlies savu skaitļu pāri!";

        return new Promise(resolve => { //seit vajadzetu sataisit response validation
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

