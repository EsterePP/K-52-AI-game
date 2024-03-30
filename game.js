const valuesArrayElement = document.getElementById("h1SkaitluVirkne");
const outputElement = document.getElementById("systemOutput");
const playerPointsElement = document.getElementById("playerPoints");
const computerPointsElement = document.getElementById("computerPoints");

class NumberGame {
    constructor() {
      this.isHumanCurrentPlayer = true;
      this.currentState = new State(0, 0, []);
      this.selectedParagraphIndex = null;
    }

    init() {
        let arrayLength = 0
        while (arrayLength < 5 || arrayLength > 25 || isNaN(arrayLength)) { // pagaidām atstāju uz 5 - 25
            arrayLength = prompt("Izvēlieties skaitļu virknes garumu (5-25):");
        }
        this.currentState = new State(0, 0, this.generateValues(arrayLength));
        this.startGame();
      }
    
    generateValues(arrayLength) {
        let values = [];
        for (let i = 0; i < arrayLength; i++) {
            let randomelem = Math.floor(Math.random() * 9) + 1;
            values.push(randomelem);
        }
        return values;
    }

    // Funkcija, kura do iespēju klikšķināt skaitļus, nevis rakstīt tos manuāli 
    toggleP = (index) => {
        console.log("Clicked index:", index); // Šo var izdēst 
        document.getElementById("textField").value = index;
        return index;
    };

    async startGame() {
        const self = this; // Nepieciešams lai realizētu skaitļa izvēli ar klikšķi
        while (this.currentState.values.length > 1) {
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
                    self.selectedParagraphIndex = index;
                    // Izsauc toggleP() kad tiek uzklikšķināts
                    self.toggleP(index);
                });
            });

            // pagaidām spēli vienmēr iesāk spēlētājs
            if (this.isHumanCurrentPlayer == true) {
                const { valueOne, valueTwo } = await this.playerMove();
                this.currentState = State.computeState(this.currentState, valueOne, this.isHumanCurrentPlayer);
            } else {
                let [valueOne, valueTwo] = this.computerMove();
                this.currentState = State.computeState(this.currentState, valueOne, this.isHumanCurrentPlayer);
            }

            this.isHumanCurrentPlayer = !this.isHumanCurrentPlayer;
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
        const index = this.selectedParagraphIndex;
        this.selectedParagraphIndex = null;

        //pagaidām jāievada tikai pirmo elementu, valueTwo ir izvēlētais + 1
        outputElement.innerHTML = "Izvēlies savu skaitļu pāri!";

        return new Promise(resolve => {
            document.getElementById("okButton").addEventListener("click", function() {
                // Bišku pamainīju loģiku, lai strādātu ar skaitļu klikšķināšanu
                const valueOne = index !== null ? index : parseInt(document.getElementById("textField").value.trim());
                const valueTwo = valueOne + 1;
                resolve({ valueOne, valueTwo });
            });
        });
    }
    
    // pagaidām dators izvēlas random skaitļus, ar kuriem veikt gājienu. Realitātē šeit jāimplementē minimax un alpha beta apruning
    computerMove() {
        let index = Math.floor(Math.random() * (this.currentState.values.length - 1));
        return [index, index + 1];
    }
}

//Klases State un GameTree ar visu no tām izrietošo saturu izmurgoja Ēriks Lijurovs
// VAJAG SAVIENOT AR PĀRĒJO SPĒLI
class State{    //Spēles stāvoklis
    constructor(playerScore, computerScore, values){    //Sastāv no abu spēlētāju rezultātiem un skaitļu virknes
        this.playerScore = playerScore;
        this.computerScore = computerScore;
        this.values = values;
    }

    static computeState(initialState, firstNumAddr, human){    //Stāvokļa aprēķināšanas metode
        let playerScore = initialState.playerScore;
        let computerScore = initialState.computerScore;
        //SEKOJOŠAIS IR SLIKTS, NEĒRTS KODS, BET BEZ TĀ NEKAS NESTRĀDĀ
        const stringValues = initialState.values.toString(); //Pārveidojam skaitļu virkni no objekta par string
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

    // ARTŪRS - nomainīju buildtree nedaudz jo minimaxam radās kļūda, atkārtojās virsotnes
    // pievienoju checku kas parbauda vai jau ir apmeklets stavoklis un iznemu paths, izradas ka nav vajadzigs (hz bet strada)

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
    
    /* VECAIS BUILDTREE KODS (Atstasu katram gadijumam ja nu mans beigas izradas kludains)
    buildTree(initialState, depth, human){ 
        let paths = initialState.values.length - 1;  //Katram stāvoklim VIENMĒR būs virknes garums - 1 pēctecis
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
*/
    //arturs schizo minimax algoritms

    printTree() {   //metode kas printē koka šī brīža state
        console.log("Game Tree:");  //virsraksts
        for (const [stateStr, children] of this.tree) {  
            console.log(`State: ${stateStr}`);  //uzraksta speletaju punktus un si briza skaitlu virkni
            console.log("Children:");
            for (const child of children) {
                console.log(JSON.stringify(child)); //uzraksta apaks virsotnes (children)
            }
            console.log("---"); //linija prieks lasamibas
        }
    }

    evaluateState(state) { //metode kas aprekina vai virsotne uzvar computer vai player
        const scoreDifference = state.playerScore - state.computerScore;
        if (scoreDifference > 0) {
            return 1; // ja speletaja score - computer score > 0 tad uzvar speletajs un atgriez 1
        } else if (scoreDifference < 0) {
            return -1; // Ja speletaja score - computer score < 0 tad uzvar com un atgriez -1
        } else {
            return 0; // parejos gadijumos ir neizskirts un atgriez 0
        }
       
    }

    minimax(node, depth, isMinimizer) { //minimax algoritms ar virsotni, dzilumu un parbaudi vai ir minimizetajs

        const nodeStr = JSON.stringify(node); //dabu string no virsotnes
        const children = this.tree.get(JSON.stringify(node)); //dabujam apaksvirsotnes
        
        // ja ir apaksvirsotnes, tad ejam talak lidz beigam
        if (children) {
            for (const child of children) {
                this.minimax(child, depth + 1, !isMinimizer); //ar katru soli pievienojam +1 dzilumam un nomainam minimizer statusu
            }
        }

        // parbaudam, ja nav apaksvirsotnes tad sakam virsotnes novertesanu
        if (!children || children.length === 0) {
            // novertejam virsotni izmantojot ieprieks izveidoto evaluatestate
            node.evaluation = this.evaluateState(node);
            console.log("strupcela virsotne") //ta ka strupcela node, izvadam tekstu
        } else {
            //seit novertejam virsotni izmantojot tas apaksvirsotnes
            if (isMinimizer) {
                // ja atrodamies min limeni, tad izvelamies minimumu no apaksvirsotnem
                node.evaluation = Math.min(...children.map(child => child.evaluation));
                console.log("minimizer")
            } else {
                // ja atrodamies max limeni tad izvelamies maksimumu no apaksvirsotnem
                node.evaluation = Math.max(...children.map(child => child.evaluation));
                console.log("maximizer")
            }
        }

        // izvadam sis virsotnes novertejumu
        console.log(`Evaluation for state ${JSON.stringify(node)}: ${node.evaluation}`);
    }

    
    alphaBeta(node, depth, alpha = -Infinity, beta = Infinity, isMinimizer) {
        const nodeStr = JSON.stringify(node);
        const children = this.tree.get(nodeStr);
    
        if (!children || children.length === 0 || depth === 0) {
            // Ja nav bērnu vai sasniegts maksimālais dziļums, novērtē virsotni un atgriez novērtējumu
            node.evaluation = this.evaluateState(node);
            console.log(`Evaluation for state ${nodeStr}: ${node.evaluation}`);
            return node.evaluation;
        }
    
        if (isMinimizer) {
            // Ja mēs minimizējam, sākam ar sākotnējo lielumu "v"
            let value = Infinity;
            for (const child of children) {
                // Rekursīvi izsaucam alphaBeta uz bērnu virsotnēm
                value = Math.min(value, this.alphaBeta(child, depth - 1, alpha, beta, false));
                beta = Math.min(beta, value); // atjauninām beta vērtību
                console.log(`Minimizer: ${value}, Alpha: ${alpha}, Beta: ${beta}`);
                if (beta <= alpha) {
                    // Ja beta ir mazāks vai vienāds ar alfa, pārtraucam ciklu
                    console.log("Beta cut-off");
                    break;
                }
            }
            return value;
        } else {
            // Ja mēs maksimizējam, sākam ar sākotnējo lielumu "v"
            let value = -Infinity;
            for (const child of children) {
                // Rekursīvi izsaucam alphaBeta uz bērnu virsotnēm
                value = Math.max(value, this.alphaBeta(child, depth - 1, alpha, beta, true));
                alpha = Math.max(alpha, value); // atjauninām alpha vērtību
                console.log(`Maximizer: ${value}, Alpha: ${alpha}, Beta: ${beta}`);
                if (beta <= alpha) {
                    // Ja beta ir mazāks vai vienāds ar alfa, pārtraucam ciklu
                    console.log("Alpha cut-off");
                    break;
                }
            }
            return value;
        }
    }

//Sergejs - nu it kā šitas alfabetočkas funkcionalitāti implementēju, arī kkā patestēju (izmantojot to piemēru lejā, ko izveidoja Artūrs, nomainot minimax uz alphaBeta), it kā viss iet un cut off strādā
//Paliek uztaisīt iespēju izvēlēties algoritmu un kā uzrakstija Artūrs lai initialstate tiktu ņemts no random number ģeneratora
    
}

const game = new NumberGame();
game.init();


const initialState = new State(0, 0, [1, 2, 4, 1, 8]); // uztaisam piemera speles stavokli,
//  izmantoju situaciju kuru uzzimeju uz lapas un pareizi noverteju, meginaju lai dators izdara tapat.
// pec tam bus jaimplemente lai seit initialstate tiek nemts no taa random number generatora
const depth = 4; // seit ir dzilums lidz kuram mes buvejam koku
const human = true; // cilveks eksiste :)
const gameTree = new GameTree(initialState); //taisam koku

gameTree.buildTree(initialState, depth, human); // buvejam koku
gameTree.printTree(); // printejam koku browsera konsole
gameTree.minimax(initialState); //minimax algoritms tiek izsaukts

//-Artūrs kaut kā esmu sataisijis to minimaxu tagad sergejs meginas uztaisit alfa beta un tad atliks implementet
//lai stavoklis tiek generets randomā. Un tad hz ka bus jauztaisa lai dators iet pa -1 virsotnēm.
//Paldies par uzmanibu es eju gulet, es vnk vairs nevaru
//programmesana ir briesmiga
