class NumberGame {
    constructor() {
      this.humanScore = 0;
      this.computerScore = 0;
      this.currentPlayer = 0; 
      this.values = [];
    }

    // Lietotājs ievada virknes garumu
    init() {
        const readline = require('readline');
        const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
        });
    
        rl.question("Enter length of the number string (15-25): ", input => {
          const arrayLength = parseInt(input.trim(), 10); // šeit
          this.generateValues(arrayLength);
          rl.close();
          this.startGame();
        });
      }
    
    // masīvā values tiek ģenerēti random skaitļi no 1-9
    generateValues(arrayLength) {
        for (let i = 0; i < arrayLength; i++) {
          this.values.push(Math.floor(Math.random() * 9) + 1);
        }
    }

    // pati spēles loģika ("async" te ir tikai tāpēc, ka javascript nav šiti domāts šādām lietām, tas nav nekas būtisks)
    async startGame()  {
        while (this.values.length > 1) { // spēle turpinās līdz values masīvā vairs nav skaitļu, ko saskaitīt
            let valueString = ""; // izvada masīvu kā skaitļu virkni, lai spēlētājs varētu izvēlēties, kurus skaitļus 
            // var saskaitīt. Ieliekot šo iekš while cikla var arī redzēt kā izmainas masīvs pēc sava gājiena.
                for (let i=0; i<this.values.length; i++) {
                    valueString += this.values[i] + "(" + i + ")" + " ";
                }
                console.log(valueString); 
            if (this.currentPlayer == 0) { // spēlētāja kārta (cilvēks reprezentē 0, dators- 1)
                try {
                    const {valueOne, valueTwo} = await this.humanMove(); // cilvēks veic savu gājienu
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
            console.log("You won!");
        } else if (this.computerScore > this.humanScore) { 
            console.log("You lost...")
        } else { console.log("It's a tie."); } 
    }

    // no spēlētāja veiktās ievades izgūstam valueOne un valueTwo jeb saskaitāmo skaitļu pozīcijas
    humanMove() {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        return new Promise((resolve, reject) => {
            readline.question("Enter position of the first value you want to add: ", inputOne => {
                const valueOne = parseInt(inputOne.trim());
    
                readline.question("Enter position of the second value you want to add: ", inputTwo => {
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
        });
    }    
    
    // dators izvēlas random skaitļus, ar kuriem veikt gājienu. Realitātē šī metode būtu jāsadala variantā, kad dators
    // spēlē ar minimax un ar alpha beta un jāimplementē reālie algoritmi. Visticamāk arī pats spēles
    // koks, ko šī metode izmantos būs atseviška klase/ metode. 
    computerMove() {
        let index = Math.floor(Math.random() * (this.values.length - 1));
        return [index, index + 1];
    }
}

const game = new NumberGame();
game.init();

