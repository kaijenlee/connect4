// every game has two players, identified by their WebSocket
var game = function(gameID){
    this.player1 = null;
    this.player2 = null;
    this.turn = "player1";
    this.columns= new Column();
    // this.columns.initialize();
    this.id = gameID;
    this.gameState = "0 JOINED" // "player1" or "player2" means respective players won, "ABORTED" means the game was aborted
};

//Different states of the game 
game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINED"] = 0;
game.prototype.transitionStates["1 JOINED"] = 1;
game.prototype.transitionStates["2 JOINED"] = 2; 
game.prototype.transitionStates["CHIP INSERTED"] = 3; 
game.prototype.transitionStates["player1"] = 4; // Player 1 won
game.prototype.transitionStates["player2"] = 5; // Player 2 won
game.prototype.transitionStates["ABORTED"]= 6;

// valid transitions between game states
game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0], // 0 JOINED
    [1, 0, 1, 0, 0, 0, 0], // 1 JOINED , the player can still leave the game
    [0, 0, 0, 1, 0, 0, 1], // 2 JOINED, game commences, 
    [0, 0, 0, 1, 1, 1, 1], // A chip has been inserted
    [0, 0, 0, 0, 0, 0, 0], // Player 1 won
    [0, 0, 0, 0, 0, 0, 0], // Player 2 won 
    [0, 0, 0, 0, 0, 0, 0] // ABORTED
];
game.prototype.getId =function(){
    return this.id;
}
game.prototype.isValidTransition = function(from, to) {
    console.assert(
        typeof from == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof from
    );
    console.assert(
        typeof to == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof to
    );
    console.assert(
        from in game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state",
        arguments.callee.name,
        from
    );
    console.assert(
        to in game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state",
        arguments.callee.name,
        to
    ); 

    let i, j;
      if (!(from in game.prototype.transitionStates)) {
        return false;
    } else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    } else {
        j = game.prototype.transitionStates[to];
    }

    return game.prototype.transitionMatrix[i][j] > 0;

};

game.prototype.isValidState = function(s){
    return s in game.prototype.transitionStates;
};

game.prototype.setStatus = function(w){
    console.assert(
        typeof w == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof w
    );

    if (
        game.prototype.isValidState(w) &&
        game.prototype.isValidTransition(this.gameState, w)
    ) {
        this.gameState = w; 
        console.log("[STATUS] %s", this.gameState);
    } else {
        return new Error(
            "Impossible to change status from %s to %s",
            this.gameState,
            w
        );
    }
};

game.prototype.getColumns = function() {
    return this.columns;
}

game.prototype.getTurn = function() {
    return this.turn; 
}

game.prototype.setTurn = function(p){
    console.assert(
        typeof p == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof p
    );
    this.turn = p;
}

game.prototype.hasTwoConnectedPlayers = function(){
    return this.gameState == "2 JOINED"
}

game.prototype.addPlayer = function(p) {
    console.assert(
        p instanceof Object,
        "%s: Expecting an object (WebSocket), got a %s",
        arguments.callee.name,
        typeof p
    );

    if(this.gameState != "0 JOINED" && this.gameState != "1 JOINED") {
        return new Error(
            "Invalid call to addPlayer as current state is %s",
            this.gameState
        );
    }

    // revise the game state (????)
    var error = this.setStatus("1 JOINED");
    if(error instanceof Error) {
        this.setStatus("2 JOINED");
    } 

    if (this.player1 == null){
        this.player1 = p; 
        return "player1";
    } else {
        this.player2 = p; 
        return "player2";
    }
};

function Column(){
    // this.columns = undefined; 

    // this.initialize = function() {
        this.columns ={
            column1: {num:0, chip: []},
            column2: {num:0, chip: []},
            column3: {num:0, chip: []},
            column4: {num:0, chip: []},
            column4: {num:0, chip: []},
            column5: {num:0, chip: []},
            column6: {num:0, chip: []},
            column7: {num:0, chip: []}
        };
    // };

    //Is it a valid column?
    // this.isColumn = function(inputcolumn){
    //     console.assert(typeof inputcolumn === "string", "Single string expected");
    //     return Object.prototype.hasOwnProperty(this.columns, inputcolumn);
    // };

    this.isColumnAvailable = function(inputcolumn){
        console.assert(typeof inputcolumn === "string", "Single string expected");
        return this.isColumn(inputcolumn) && this.columns[inputcolumn].num <= 3;   
    };

    this.makeColumnUnavailable = function(inputcolumn) {
        console.assert(typeof inputcolumn === "string", "Single string expected");
        if(this.isColumn(inputcolumn)){

            //vvisually switch off the UI element by simply adding a classname
            document.getElementById(inputcolumn).className += "columnFULL"
        }
    };

    this.getLatestInsertedRow = function(inputcolumn) {
        console.assert(typeof inputcolumn === "string", "Single string expected");

        return this.columns[inputcolumn]["num"]; //may be wrong
   
    };

    this.getFullColumns = function(){
        var fullColumns = [];
        for(let i = 1; i<= 7; i++){
            let fullColumn = String("column" + i);
            if(this.columns[fullColumn]["num"] >=6 ){
                fullColumns.push(fullColumn);
            }
        }
        return fullColumns;
    };

    this.addToColumn = function(inputcolumn,player){
        console.assert(typeof inputcolumn === "string", "Single string expected");
        console.assert(typeof player === "string", "Single string expected");
        this.columns[inputcolumn]["num"]++;
        this.columns[inputcolumn]["chip"].push(player);
    };
}

module.exports = game;
