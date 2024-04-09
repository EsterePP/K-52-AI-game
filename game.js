

const valuesArrayElement = document.getElementById("h1SkaitluVirkne");
const outputElement = document.getElementById("systemOutput");
const playerPointsElement = document.getElementById("playerPoints");
const computerPointsElement = document.getElementById("computerPoints");

// Spēles darbības loģika atrodas klasē game
class NumberGame {
    constructor() {
      this.currentState = new State(0, 0, []); // Spēles pašreizējais stāvoklis
      this.selectedParagraphIndex = null;  // Spēlētāja izvēlētā skaitļa indekss
      this.gameTree = null; // Spēles koks
      this.previousState = new State(0, 0, []); // Iepriekšējais spēles stāvoklis tiek glabāts, lai MI veitkais gājiens tiktu pareizi attēlots
    }

    // Spēles restarts
    restartGame(){
        // Paslēp galveno spēles daļu 
        var mainGameUI = document.querySelectorAll(".container");
        mainGameUI.forEach(function(div) {
            div.style.display = "none";
        });
        // Parāda spēles parametrtu izvēli
        var gameParameterSelector = document.getElementById("start-game-div");
        gameParameterSelector.style.display = "flex";
        //Nodzēš pēdējā izvelētā gājiena indeksu
        document.getElementById("textField").value = null;
    };

    init(whoStarts) {
        let arrayLength = 0;
        arrayLength = document.getElementById("arrayLength").value;

        // Pārbauda vai skaitļu virknes garums atbild prasībām
        if (arrayLength < 15 || arrayLength > 25 || isNaN(arrayLength)){}
        else{
            let arrayLength = 0
            arrayLength = document.getElementById("arrayLength").value;

            // Par pašreizējo spēles stāvokli (spēles sākumstāvoklis) kļūst objekts State, kurā abu spēlētāju punkti ir 0 un atrodas skaitļu virkne, kas ģenerēta ar metodi generateValues)
            this.currentState = new State(0, 0, this.generateValues(arrayLength));

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

            // Pārbauda, kurš uzsāks spēli (Spēlētājs vai MI)
            this.humanPlayer = whoStarts; 

            // Nodrošina lai spēle rādītos uz ekrāna
            var mainGameUI = document.querySelectorAll(".container");
            mainGameUI.forEach(function(div) {
                div.style.display = "flex";
            });

            // Nodrošina lai spēles parametru izvēle pazūd no ekrāna
            var gameParameterSelector = document.getElementById("start-game-div");
            gameParameterSelector.style.display = "none";

            // Paslēp restart pogu kad spēle tiek restartēta
            var restartGameButton = document.getElementById("restart");
            restartGameButton.style.display = "none";

            this.startGame();
        }
        
      }
    
    // Metode, kas atgriež masīvu "values" - spēles skaitļu virkni
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
        document.getElementById("textField").value = index;
        return index;
    };

     // Spēles sākums
    async startGame() {
         // Tiek izveidots jauns GameTree objekts ar pašreizējo spēles stāvokli
        this.gameTree = new GameTree(this.currentState);
    
         // Atkarībā no izvēlētā virknes garuma tiek uzsākta spēles koka veidošana dažādos dziļumos
        if (this.humanPlayer == true) {
            if(this.currentState.values.length >= 19){
                this.gameTree.buildTree(this.currentState, 4, true);
            }else{
                this.gameTree.buildTree(this.currentState, 5, true);
            }
        } else {
            if(this.currentState.values.length >= 19){
                this.gameTree.buildTree(this.currentState, 4, true);
            }else{
                this.gameTree.buildTree(this.currentState, 5, true);
            }
            // Ja MI uzsāk spēli, tad pašreizējais (pirmais) spēles stāvoklis kļūst par iepriekšējo spēles stāvokli
            // Šis ir nepieciešams, lai MI gājiena rezultātā izveidotos iecerētais stāvoklis (skat. computerMove)
            this.previousState = this.currentState;
        }
    
        const self = this; // Nepieciešams lai realizētu skaitļa izvēli ar klikšķi
         // Spēles cikla sākums, spēle turpinās līdz 'values" masīvā ir vismaz 1 elements
        while (this.currentState.values.length >= 1) {
            let valueString = "";
            playerPointsElement.innerHTML = this.currentState.playerScore;
            computerPointsElement.innerHTML = this.currentState.computerScore;
            
            // Veido skaitļu virkni ar atsevišķu <p></p> tagu katram skaitlim
            for (let i = 0; i < this.currentState.values.length; i++) {
                valueString += `<p tabindex='0' class='virkneElement e${i}' id='toggleNumber'>${this.currentState.values[i]}<span class=\"mini-font\"><i>${i}</i></span></p>`;
            }
            // Ievieto skaitļu virkni 
            valuesArrayElement.innerHTML = valueString;
    
            // Pievieno onClick funkcionalitāti skaitļiem, lai uzklikšķinot uz tiem, saglabājas index(jeb kārtas numurs)
            document.querySelectorAll('.virkneElement').forEach((paragraph, index) => {
                paragraph.addEventListener('click', function() {
                    // Saglabājam kārtas numuru
                    self.selectedParagraphIndex = index;
                    // Izsauc toggleP() kad tiek uzklikšķināts
                    self.toggleP(index);
                });
            });
    

            if (this.humanPlayer == true) {
                // Ja gājienu veic spēlētājs, tiek izsaukta playerMove metode
                const { valueOne } = await this.playerMove();
                 // Spēles stāvoklis tiek atjaunināts, balstoties uz spēlētāja izvēli (pirmā saskaitāmā skaitļa indeksu, kas tiek glabāts mainīgajā valueOne
                this.currentState = State.computeState(this.currentState, valueOne, this.humanPlayer);
                 // Spēles koks tiek veidots dziļāk, sākot no šī jauniegūtā spēles stāvokļa
                if(this.currentState.values.length >= 19){
                    this.gameTree.buildTree(this.currentState, 4, false);
                }else{
                    this.gameTree.buildTree(this.currentState, 5, false);
                }
                // Pirms MI gājiena pašreizējais stāvoklis tiek saglabāts kā iepriekšējais, jo arī MI izsauks computeState metodi, 
                // tā pat kā playerMove - balstoties uz pirmā saskaitāmā skaitļa indeksu, kas jāzivēlas, lai sasniegtu vēlamo stāvokli -
                // protams, indeksa izvēle attiecas uz stāvokli, kas tika izveidots cilvēka gājiena rezultātā (skat. computerMove)
                this.previousState = this.currentState;
            } else {
                // Ja ir MI kārta veikt gājienu, izsaukta computerMove metode
                const { valueOne } = await this.computerMove();
                 // Tiek atjaunināts spēles stāvoklis, balstoties uz iegūto informāciju
                this.currentState = State.computeState(this.previousState, valueOne, this.humanPlayer);
            }
    
            this.humanPlayer = !this.humanPlayer; // Tiek nomainīts spēlētājs
    
            // Nepieciešams lai izvadītu beigu stāvokli, nevis tikai spēles beigu rezultātu (Lai rādītos tikai 1 elements beigās, nevis 2(kā bija pirms tā))
            if (this.currentState.values.length === 1) {
                let valueString = "";
                playerPointsElement.innerHTML = this.currentState.playerScore;
                computerPointsElement.innerHTML = this.currentState.computerScore;

                for (let i = 0; i < this.currentState.values.length; i++) {
                    valueString += `<p tabindex='0' class='virkneElement e${i}' id='toggleNumber'>${this.currentState.values[i]}<span class=\"mini-font\"><i>${i}</i></span></p>`;
                }
                valuesArrayElement.innerHTML = valueString;
                // Apstādina ciklu pēc tā, kad spēle beidzās, un tika izvadīts gala stāvoklis
                break; 
            }
        }
        
        // Izsauc spēles beigu metodi, kas paziņo spēles iznākumu
        this.winner();

        // Parāda spēles restarta pogu spēles beigās
        var restartGameButton = document.getElementById("restart");
        restartGameButton.style.display = "flex";

    }
    winner() { // Izvada spēles iznākuma (uzvara/zaudējums/neizšķirts) paziņojumu
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
        const index = this.selectedParagraphIndex;
        this.selectedParagraphIndex = null;

        //pagaidām jāievada tikai pirmo elementu, valueTwo ir izvēlētais + 1
        outputElement.innerHTML = "Izvēlies savu skaitļu pāri!";

        return new Promise(resolve => {
            document.getElementById("okButton").addEventListener("click", function() {
                // Nosaka kuru skaitļu pāri izvēlējās spēlētājs
                let valueOne = index !== null ? parseInt(document.getElementById("textField").value.trim()) : parseInt(document.getElementById("textField").value.trim());
                let valueTwo = valueOne + 1;
                resolve({ valueOne, valueTwo });

            });
        });
    }
    
    async computerMove() {
        // Balstoties uz spēlētāja izvēli, tiek izsaukta minimaksa vai alfa-beta algoritms
        if (this.alphabeta == false) {
            // Pašreizējam spēles stāvoklim tiek izsaukts minimax un iegūts labākais spēles stāvoklis
            const bestMove = this.gameTree.minimax(this.currentState, 2, !this.humanPlayer);
            // Izmantojot informāciju par labāko spēles stāvokli, MI, tā pat kā cilvēks, veic gājienu balstoties uz pirmā saskaitāmā 
            // skaitļa indeksu (State objekts vienmēr glabā šo informāciju)
            const valueOne = bestMove.node.firstNumAddr;
            return {valueOne};
        } else {
            // Ja izvēlēts alfa-beta aloritms gājiena loģika ir tāda pati, tikai izsaukts attiecīgais algoritms
            const bestMove = this.gameTree.alphabeta(this.currentState, 3, Number.NEGATIVE_INFINITY,  Number.POSITIVE_INFINITY, !this.humanPlayer); 
            this.currentState = bestMove.node; // nomaina atrasto node ar labāko vērtējumu uz currentState
            const valueOne = bestMove.node.firstNumAddr; 
            return {valueOne};
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

    // Funkcija spēles stāvokļa (State) aprēķināšanai
    static computeState(initialState, firstNumAddr, human) {
        let playerScore = initialState.playerScore;
        let computerScore = initialState.computerScore;
        const stringValues = initialState.values.toString(); //Pārveidojam skaitļu virkni no objekta par string
        const values = stringValues.split(',').map(Number);     //un atpakaļ
        //Kāpēc? Lai JS liek virkni adresē, kas NAV vecāka objekta virknes adrese. Citādi vecāka elementa virkne arī tiks mainīta.
        
        // Gājienā izvēlēto indeksu summa
        const sum = values[firstNumAddr] + values[firstNumAddr + 1];
        
        // Attiecīgi dotajai spēles loģikai, aizvieto izvēlēto skaitļu pāri ar 1 / 2 / 3
        if (sum > 7) {
            values.splice(firstNumAddr, 2, 1);
        } else if (sum < 7) {
            values.splice(firstNumAddr, 2, 3);
        } else if (sum == 7 ) {
            values.splice(firstNumAddr, 2, 2);
        }
        
        // Aprēķina spēlētāju punktu izmaiņas pēc veiktā gājiena
        playerScore += human? (sum>7 ? 2: sum === 7? -1: 0) :(sum<8 ? -1: 0)
        computerScore += !human? (sum>7 ? 2: sum === 7? -1: 0) :(sum<8 ? -1: 0)
        
        // Atgriež jauno State
        const computedState = new State(playerScore, computerScore, values, firstNumAddr);
        return computedState;
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
        }
    }

    buildTree(initialState, depth, human, visited = new Set()) { //Spēles koka īstenā būvēšana + visited set
        const initialStateStr = JSON.stringify(initialState);
    
        if (this.tree.has(initialStateStr) === false) {   //Ja vecāka virsotnes vēl nav kokā, ieliekam to
            this.tree.set(initialStateStr, []);
        }
    
        if (depth === 0 || visited.has(initialStateStr)) { //parbaudam vai state ir apskatits
            return; 
        }

        visited.add(initialStateStr); //ja nav bijis, tad pec apskatisanas pievienojam so setam ar apskatitajiem state
    
        for (let i = 0; i < initialState.values.length - 1; i++) {
            const childState = State.computeState(initialState, i, human); //Aprēķinam vienu (1) pēcteci sākuma stāvoklim
            this.addPath(initialState, childState); //Pievienojam ceļu no sākotnējā stāvokļa uz pēctečiem BET NE OTRĀDI
            this.buildTree(childState, depth - 1, !human, visited); //Būvējam koku tālāk no šī pēcteča, apvēršam spēlētāja bool
        }
    }
    
    // Heiristiskā novērtēšana
    evaluateState(state) {
        let evaluation = 0;
    
        // Labākie stāvokļi ir tie, kuros MI un spēlētāja punktu skaita atšķirība ir lielāka (un pozitīva)
        const scoreDifference = state.computerScore - state.playerScore;
        evaluation += scoreDifference; 

        // Labākie stāvokļi ir tie, kur ir vairāk par 1 pāri, kuru summa ir lielāka par 7
        // Sliktāki ir tie stāvokļi, kur ir viens šāds pāris, jo tad spēlētājs to saskaitīs un iegūs 2 punktus sev, un MI vairs šādas iespējas nebūs
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
        const nodeStr = JSON.stringify(node);
        const children = this.tree.get(nodeStr);

        if (!children || children.length === 0 || depth === 0) {
            const evaluation = this.evaluateState(node);
            return { evaluation, node };
        }
    
        let bestEvaluation = null;
        let bestNode = null;
        if (isMaximizingPlayer) {
            bestEvaluation = Number.NEGATIVE_INFINITY;
        } else {
            bestEvaluation = Number.POSITIVE_INFINITY;
        }
    
        for (const child of children) {
            const childStr = JSON.stringify(child);
            const result = this.minimax(child, depth - 1, !isMaximizingPlayer,);
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

