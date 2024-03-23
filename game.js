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
                //Apakšā esošais ir pagaidu testēšanas risinājums (Ēriks Lijurovs)
                const initState = new State(this.playerScore, this.computerScore, this.values);
                State.printState(initState);
                const tempTree = new GameTree(initState);
                tempTree.buildTree(initState, 5, false);
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

//Klases State un GameTree ar visu no tām izrietošo saturu izmurgoja Ēriks Lijurovs
// VAJAG SAVIENOT AR PĀRĒJO SPĒLI
class State{    //Spēles stāvoklis
    constructor(playerScore, computerScore, ...values){    //Sastāv no abu spēlētāju rezultātiem un skaitļu virknes
        this.playerScore = playerScore;
        this.computerScore = computerScore;
        this.values = values;
    }

    static computeState(initialState, firstNumAddr, human){    //Stāvokļa aprēķināšanas metode
        let playerScore = initialState.playerScore;
        let computerScore = initialState.computerScore;
        //SEKOJOŠAIS IR SLIKTS, NEĒRTS KODS, BET BEZ TĀ NEKAS NESTRĀDĀ
        const stringValues = initialState.values[0].toString(); //Pārveidojam skaitļu virkni no objekta par string
        const values = stringValues.split(',').map(Number);     //un atpakaļ
        //Kāpēc? Lai JS liek virkni adresē, kas NAV vecāka objekta virknes adrese. Citādi vecāka elementa virkne arī tiks mainīta.

        if(values[firstNumAddr] + values[firstNumAddr+1] > 7){    //Punktu aprēķināšana
            switch(human){
                case true:
                    playerScore += 2;
                    break;
                case false:
                    computerScore += 2;
                    break;
            }
            values.splice(firstNumAddr, 2, 1);  //Vērtību aizvietošana virknē no aizvietojamā pāra sākuma, 2 vērtības, ar 1

        }else if(values[firstNumAddr] + values[firstNumAddr+1] < 7){
            switch(human){
                case true:
                    computerScore -= 1;
                    break;
                case false:
                    playerScore -= 1;
                    break;
            }
            values.splice(firstNumAddr, 2, 3);

        }else{
            switch(human){
                case true:
                    playerScore -= 1;
                    break;
                case false:
                    computerScore -= 1;
                    break;
            }
            values.splice(firstNumAddr, 2, 2);
        }

        const computedState = new State(playerScore, computerScore, values);  //Izveido jauno stāvokli
        return computedState;   //Atgriež to
    }

    static printState(State){
        console.log(State.playerScore + "|" + State.values + "|" + State.computerScore);
    }
}

class GameTree{ //Spēles koks
    constructor(initialState){
        this.tree = new Map();    //Tā kā šis reāli ir grafs, katram stāvoklim var būt vairāki pēcteči
        this.tree.set(JSON.stringify(initialState), []);    //Spēles kokam key ir stāvoklis kā string, lai atvieglotu salīdzināšanu
    }

    addPath(fromState, toState){    //Loka pievienošanas funkcija grafā
        const from = JSON.stringify(fromState);
        
        if(this.tree.has(from)){    //Ja kokā ir vecāka virsotne
            this.tree.get(from).push(toState); //Pievieno loku no vecāka virsotnes uz bērna virsotni
        }else{
            console.log("Nav tada stavokla");
        }
    }

    removePath(fromState, toState){ //Noņem loku no vecāka elementa uz bērna elementu ŠĪ FUNKCIJA NAV PĀRBAUDĪTA DARBĪBĀ
        const from = JSON.stringify(fromState);
        const to = JSON.stringify(toState);
        const index = this.tree.get(from).findIndex((element) => JSON.stringify(element) == to);
        this.tree.get(from).splice(index, 1);  //Izņem loku no ar vecāka virsotni saistīto saraksta
    }

    buildTree(initialState, depth, human){ //Spēles koka īstenā būvēšana
        let paths = initialState.values[0].length - 1;  //Katram stāvoklim VIENMĒR būs virknes garums - 1 pēctecis
        const initialStateStr = JSON.stringify(initialState);

        if(this.tree.has(initialStateStr) === false){    //Ja vecāka virsotnes vēl nav kokā, ieliekam to
            this.tree.set(initialStateStr, []);
        }

        if(paths == 0 || depth == 0){ //Ja esam koka galā, izejam no metodes
            return;
        }

        for(let i=0; i<paths; i++){ //Katram stāvoklim ir paths pēcteči
            const childState = State.computeState(initialState, i, human);    //Aprēķinam vienu (1) pēcteci sākuma stāvoklim
            this.addPath(initialState, childState); //Pievienojam ceļu no sākotnējā stāvokļa uz pēctečiem BET NE OTRĀDI
            this.buildTree(childState, depth-1, !human);  //Būvējam koku tālāk no šī pēcteča, apvēršam spēlētāja bool
        }
    }
}

const game = new NumberGame();
game.init();

