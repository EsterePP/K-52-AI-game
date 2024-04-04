const valuesArrayElement = document.getElementById("h1SkaitluVirkne");
const outputElement = document.getElementById("systemOutput");
const playerPointsElement = document.getElementById("playerPoints");
const computerPointsElement = document.getElementById("computerPoints");

class NumberGame {
    constructor() {
      this.currentState = new State(0, 0, []); 
      this.selectedParagraphIndex = null;
      this.gameTree = null; 
      this.previousState = new State(0, 0, []); 
    }

    init(whoStarts) {
        let arrayLength = 0;
        arrayLength = document.getElementById("arrayLength").value;

        if (arrayLength < 5 || arrayLength > 25 || isNaN(arrayLength)){}
        else{
            let arrayLength = 0

            arrayLength = document.getElementById("arrayLength").value;

            this.currentState = new State(0, 0, [8, 3, 2, 5, 9] ); // piemēra koks
            // this.currentState = new State(0, 0, this.generateValues(arrayLength));


            // Pārbauda kurš alogirtms tika izvēlēts
            var selectedAlgorithm = getSelectedAlgorithm();

            function getSelectedAlgorithm() {
                var algorithmForm = document.getElementById("algorithmForm");
                var selectedAlgorithm = null;
                
                algorithmForm.querySelectorAll("input[name='algorithm']").forEach(function(radioButton) {
                    // Pārbauda, kura opcija ir izvēlēta
                    if (radioButton.checked) {
                        selectedAlgorithm = radioButton.value;
                    }
                });
                
                return selectedAlgorithm;
            }
            // ja selectedAlgorithm != 'alphabeta', tad tiek izmantots minimax 
            if(selectedAlgorithm == 'alphabeta'){
                this.alphabeta = true;
            } else{
                this.alphabeta = false;
            }

            // !!!!!!!!!!!!!! Šeit atgriežas true vai false, jāsataisa loģika lai dators pirmais uzsāktu spēli
            this.humanPlayer = whoStarts; 

            // Nodrošina lai spēle rādītos uz ekrāna
            var mainGameUI = document.querySelectorAll(".container");
            mainGameUI.forEach(function(div) {
                div.style.display = "flex";
            });

            // Nodrošina lai spēles parametru izvēle pazūd no ekrāna
            var gameParameterSelector = document.getElementById("start-game-div");
            gameParameterSelector.remove();

            this.startGame();
        }
        
      }
    
    generateValues(arrayLength) {
        let values = [];
        for (let i = 0; i < arrayLength; i++) {
            let randomelem = Math.floor(Math.random() * 9) + 1;
            values.push(randomelem);
        }
        return values;
    }

    // Funkcija, kura dod iespēju klikšķināt skaitļus, nevis rakstīt tos manuāli 
    toggleP = (index) => {
        console.log("Clicked index:", index); // Šo var izdēst 
        document.getElementById("textField").value = index;
        return index;
    };

    async startGame() {
        this.gameTree = new GameTree(this.currentState);
    
        // !!! Lietotājam ir jābūt iespējai spēles sākumā mainīt šo vērtību 
        this.humanPlayer = true;
    
        // !!! Arī šo
        this.alphabeta = false;
    
        if (this.humanPlayer == true) {
            this.gameTree.buildTree(this.currentState, 4, true);
        } else {
            this.gameTree.buildTree(this.currentState, 4, false);
        }
    
        const self = this; // Nepieciešams lai realizētu skaitļa izvēli ar klikšķi
        while (this.currentState.values.length >= 1) {
            let valueString = "";
            playerPointsElement.innerHTML = this.currentState.playerScore;
            computerPointsElement.innerHTML = this.currentState.computerScore;
            

    
            for (let i = 0; i < this.currentState.values.length; i++) {
                valueString += `<p tabindex='0' class='virkneElement e${i}' id='toggleNumber'>${this.currentState.values[i]}<span class=\"mini-font\"><i>${i}</i></span></p>`;
            }
            valuesArrayElement.innerHTML = valueString;
    
            // Pievieno onClick funkcionalitāti skaitļiem, lai uzklikšķinot uz tiem, saglabājas index(jeb kārtas numurs)
            document.querySelectorAll('.virkneElement').forEach((paragraph, index) => {
                paragraph.addEventListener('click', function() {
                    // Saglabājam kārtas numuru
                    console.log(`index now: ${index}`);
                    self.selectedParagraphIndex = index;
                    // Izsauc toggleP() kad tiek uzklikšķināts
                    self.toggleP(index);
                });
            });
    
            // pagaidām spēli vienmēr iesāk spēlētājs
            if (this.humanPlayer == true) {
                console.log(`game state before player makes a move : computer score : ${this.currentState.computerScore},
                player score: ${this.currentState.playerScore}, values : ${this.currentState.values}`)
                const { valueOne, valueTwo } = await this.playerMove();
                this.currentState = State.computeState(this.currentState, valueOne, this.humanPlayer);
                console.log(`game state after player makes a move : computer score: ${this.currentState.computerScore},
                player score: ${this.currentState.playerScore}, values : ${this.currentState.values}`)
                this.previousState = this.currentState;
            } else {
                console.log(`game state before computer makes a move : computer score: ${this.currentState.computerScore},
                player score: ${this.currentState.playerScore}, values : ${this.currentState.values}`)
                const { valueOne, valueTwo} = await this.computerMove();
                this.currentState = State.computeState(this.previousState, valueOne, this.humanPlayer);
                console.log(`game state after computer makes a move : computer score: ${this.currentState.computerScore},
                player score: ${this.currentState.playerScore}, values : ${this.currentState.values}`);
    
            }
    
            this.humanPlayer = !this.humanPlayer;
    
            // Nepieciešams lai izvadītu beigu stāvokli, nevis tikai spēles beigu rezultātu (Lai rādītos tikai 1 elements beigās, nevis 2(kā bija pirms tā))
            if (this.currentState.values.length === 1) {
                let valueString = "";
                playerPointsElement.innerHTML = this.currentState.playerScore;
                computerPointsElement.innerHTML = this.currentState.computerScore;

                for (let i = 0; i < this.currentState.values.length; i++) {
                    valueString += `<p tabindex='0' class='virkneElement e${i}' id='toggleNumber'>${this.currentState.values[i]}<span class=\"mini-font\"><i>${i}</i></span></p>`;
                }
                valuesArrayElement.innerHTML = valueString;

                break; 
            }
        }
        
        this.winner();
    }
    winner() {
        playerPointsElement.innerHTML = this.currentState.playerScore;
        computerPointsElement.innerHTML = this.currentState.computerScore;
        if (this.currentState.playerScore > this.currentState.computerScore) {
            outputElement.innerHTML = "You won!";
        } else if (this.currentState.computerScore > this.currentState.playerScore) { 
            outputElement.innerHTML = "You lost...";
        } else { outputElement.innerHTML = "It's a tie."; } 
    }

    async playerMove() {
        // Dabūn pieķļuvi pie selectedParagraphIndex un reseto to
        console.log(`index when playermove called: ${this.selectedParagraphIndex}`);
        const index = this.selectedParagraphIndex;
        this.selectedParagraphIndex = null;
        console.log(`index before clicking: ${this.selectedParagraphIndex}`);

        //pagaidām jāievada tikai pirmo elementu, valueTwo ir izvēlētais + 1
        outputElement.innerHTML = "Izvēlies savu skaitļu pāri!";

        return new Promise(resolve => {
            document.getElementById("okButton").addEventListener("click", function() {
                // Bišku pamainīju loģiku, lai strādātu ar skaitļu klikšķināšanu
                console.log(`player clicked on index: ${index}`)
                let valueOne = index !== null ? parseInt(document.getElementById("textField").value.trim()) : parseInt(document.getElementById("textField").value.trim());
                let valueTwo = valueOne + 1;
                console.log(`player counts together values at indexes: ${valueOne}, ${valueTwo}`)
                resolve({ valueOne, valueTwo });

            });
        });
    }
    
    async computerMove() {
        console.log("Computer move called");
        console.log(`game state when computer move is called : computer score ${this.currentState.computerScore},
        player score: ${this.currentState.playerScore}, values : ${this.currentState.values}`)
        if (this.alphabeta == false) {
            const bestMove = this.gameTree.minimax(this.currentState, 4, true ); // te jātceras mainīt true un false atkarībā no tā, kurš sāk spēli
            const bestMoveStr = JSON.stringify(bestMove);
            console.log("---");
            console.log(`game state recieved from minimax : computer score : ${bestMoveStr}`)
            this.currentState = bestMove.node; // nomaina atrasto node ar labāko vērtējumu uz currentState
            const valueOne = bestMove.node.firstNumAddr; // 
            const valueTwo = valueOne + 1;
            return {valueOne, valueTwo};
        } else {
            const bestMove = this.gameTree.alphabeta(this.currentState, 3, Number.NEGATIVE_INFINITY,  Number.POSITIVE_INFINITY, true); 
            this.currentState = bestMove.node; // nomaina atrasto node ar labāko vērtējumu uz currentState
            console.log("---");
            console.log(`game state recieved from alpha beta : computer score : ${this.bestMove.computerScore},
            player score: ${this.bestMove.playerScore}, values : ${this.bestMove.values}`)
            const valueOne = bestMove.node.firstNumAddr; 
            const valueTwo = valueOne + 1;
            return {valueOne, valueTwo};
        }
    } 
}

class State {    //Spēles stāvoklis
    constructor(playerScore, computerScore, values, firstNumAddr){    //Sastāv no abu spēlētāju rezultātiem un skaitļu virknes
        this.playerScore = playerScore;
        this.computerScore = computerScore;
        this.values = values;
        this.firstNumAddr =firstNumAddr;
    }

    static computeState(initialState, firstNumAddr, human) {
        console.log(`Computing new state. Index: ${firstNumAddr}, Human: ${human}`);
        let playerScore = initialState.playerScore;
        let computerScore = initialState.computerScore;
        const stringValues = initialState.values.toString(); //Pārveidojam skaitļu virkni no objekta par string
        const values = stringValues.split(',').map(Number);     //un atpakaļ
        //Kāpēc? Lai JS liek virkni adresē, kas NAV vecāka objekta virknes adrese. Citādi vecāka elementa virkne arī tiks mainīta.
        
        // console.log(`Initial values: ${values.join(', ')}`);
        
        const sum = values[firstNumAddr] + values[firstNumAddr + 1];
        // console.log(`Selected numbers: ${values[firstNumAddr]}, ${values[firstNumAddr + 1]} (Sum: ${sum})`);
        
        if (sum > 7) {
            // console.log(`${human ? 'Player' : 'Computer'} scores 2 points`);
            values.splice(firstNumAddr, 2, 1);
        } else if (sum < 7) {
            // console.log(`${human ? 'Player' : 'Computer'} loses 1 point`);
            values.splice(firstNumAddr, 2, 3);
        } else if (sum == 7 ) {
            //console.log(`It's a draw. ${human ? 'Player' : 'Computer'} loses 1 point`);
            values.splice(firstNumAddr, 2, 2);
        }
        
        playerScore += human? (sum>7 ? 2: sum === 7? -1: 0) :(sum<8 ? -1: 0)
        computerScore += !human? (sum>7 ? 2: sum === 7? -1: 0) :(sum<8 ? -1: 0)
        
        const computedState = new State(playerScore, computerScore, values, firstNumAddr);
        // console.log(`New state: PlayerScore: ${playerScore}, ComputerScore: ${computerScore},  Index: ${firstNumAddr},  Values: ${values.join(', ')}`);
        return computedState;
    }
    

    static printState(State){
        // console.log(State.playerScore + "|" + State.values + "|" + State.computerScore);
    }
}

class GameTree{ //Spēles koks
    constructor(initialState){
        this.tree = new Map();    //Tā kā šis reāli ir grafs, katram stāvoklim var būt vairāki pēcteči
        this.tree.set(JSON.stringify(initialState), []);    //Spēles kokam key ir stāvoklis kā string, lai atvieglotu salīdzināšanu
        
       // this.evaluatedNodes = new Set(); // cheks prieks koka
       // this.tree.set(JSON.stringify(initialState), []);
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

    buildTree(initialState, depth, human, visited = new Set()) { //Spēles koka īstenā būvēšana + visited set
        const initialStateStr = JSON.stringify(initialState);
    
        if (this.tree.has(initialStateStr) === false) {   //Ja vecāka virsotnes vēl nav kokā, ieliekam to
            this.tree.set(initialStateStr, []);
        }
    
        if (visited.has(initialStateStr) || depth === 0) { //parbaudam vai state ir apskatits
            return; 
        }
        visited.add(initialStateStr); //ja nav bijis, tad pec apskatisanas pievienojam so setam ar apskatitajiem state
    
        for (let i = 0; i < initialState.values.length - 1; i++) {
            const childState = State.computeState(initialState, i, human); //Aprēķinam vienu (1) pēcteci sākuma stāvoklim
            this.addPath(initialState, childState); //Pievienojam ceļu no sākotnējā stāvokļa uz pēctečiem BET NE OTRĀDI
            this.buildTree(childState, depth - 1, !human, visited); //Būvējam koku tālāk no šī pēcteča, apvēršam spēlētāja bool
        }
    }

    // printTree() {   //metode kas printē koka šī brīža state
    //     console.log("Game Tree:");  //virsraksts
    //     for (const [stateStr, children] of this.tree) {  
    //         console.log(`State: ${stateStr}`);  //uzraksta speletaju punktus un si briza skaitlu virkni
    //         console.log("Children:");
    //         for (const child of children) {
    //             console.log(JSON.stringify(child)); //uzraksta apaks virsotnes (children)
    //         }
    //         console.log("---"); //linija prieks lasamibas
    //     }
    // }
    
    evaluateState(state) {
        let evaluation = 0;
    
        // labākie stāvokļi ir tie, kuros datoram ir augstāks punktu skaits
        if (state.computerScore > state.playerScore) {
            evaluation += 1;
        } else if (state.computerScore < state.playerScore) {
            evaluation += -1;
        } else evaluation += 0;

        // labākie stāvokļi ir tie, kur ir vairāk par 1 pāri, kur sum > 7
        // slikti ir tie, kur ir viens šāds pāris, jo tad spēlētājs to saskaitīs un iegūs 2 punktus sev
        let pairSums = 0; 
        for (let i = 0; i<state.values.length-1; i++) {
            if (state.values[i] + state.values[i+1] > 7) {
                pairSums += 1;
            }
        }
        if (pairSums >= 2) {
            evaluation +=1;
        } else if (pairSums = 1) {
            evaluation += -1;
        } else evaluation += 0;
       
        return evaluation;
    }

    minimax(node, depth, isMaximizingPlayer) {
        console.log("minimax called");
        const nodeStr = JSON.stringify(node);
        const children = this.tree.get(nodeStr);

        console.log("---");
        console.log(`minimax is evaluating state : ${nodeStr}`)
    
        // console.log(`it's children are : `)
        // for (const child of children) {
        //     const childStr = JSON.stringify(child);
        //     console.log(`${childStr}; `);
        // }

        if (!children || children.length === 0 || depth === 0) {
            const evaluation = this.evaluateState(node);
            console.log(`computer will follow path with states evaluated : ${evaluation}`)
            return { evaluation, node };
        }
    
        let bestEvaluation = null;
        let bestNode = null;
        if (isMaximizingPlayer) {
            bestEvaluation = Number.NEGATIVE_INFINITY;
        } else {
            bestEvaluation = Number.POSITIVE_INFINITY;
        }

        console.log(`the best evaluation is currently : ${bestEvaluation}`);
        const BestNodeStr = JSON.stringify(bestNode);
        console.log(`the best state is currently : ${BestNodeStr}`);
    
        for (const child of children) {
            const childStr = JSON.stringify(child);
            const result = this.minimax(child, depth - 1, !isMaximizingPlayer);
            console.log(`called minimax on child : ${childStr}`);
            if (isMaximizingPlayer) {
                if (result.evaluation > bestEvaluation) {
                    bestEvaluation = result.evaluation;
                    bestNode = child;
                }
            } else { 
                if (result.evaluation < bestEvaluation) {
                    bestEvaluation = result.evaluation;
                    bestNode = child;
                }
            } 
        }
        return { evaluation: bestEvaluation, node: bestNode };
    }


    alphabeta(node, depth, alpha, beta, isMaximizingPlayer) {
        console.log("alpha beta called");
        const nodeStr = JSON.stringify(node);
        const children = this.tree.get(nodeStr) || [];
    
        if (depth === 0 || !children.length) {
            const evaluation = this.evaluateState(node);
            return {evaluation, node};
        }
    
        let bestNode = null;
    
        if (isMaximizingPlayer) {
            let value = Number.NEGATIVE_INFINITY;
            for (const child of children) {
                const result = this.alphabeta(child, depth - 1, alpha, beta, false);
                if (result.evaluation > value) {
                    value = result.evaluation;
                    bestNode = child;
                }
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break;
                }
            }
            return {evaluation: value, node: bestNode};
        } else {
            let value = Number.POSITIVE_INFINITY;
            for (const child of children) {
                const result = this.alphabeta(child, depth - 1, alpha, beta, true);
                if (result.evaluation < value) {
                    value = result.evaluation;
                    bestNode = child;
                }
                beta = Math.min(beta, value);
                if (beta <= alpha) {
                    break;
                }
            }
            return {evaluation: value, node: bestNode};
        }
    }
    

}

const game = new NumberGame();

// game.init();
