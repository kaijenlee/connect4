/* Game-state constructor  (Design.p 1) */

function GameState(sb, ss, ps, socket){
    this.playerType = null;
    this.statusBar = sb; 
    this.turn = "player1";
    this.fullColumn =[];
    this.inserted = [];
    this.highestRowInserted = 0;
    this.latestFilledSlot = {
        player: null,
        column: null,
        row: null,
    }
    this.pointer = ps;
    this.winningPlayer = null;
    
    this.getPlayerType = function(){
        return this.playerType;
    };

    this.setPlayerType = function(p){
        console.assert(
            typeof p == "string",
            "%s: Expecting a string, got a %s",
            arguments.callee.name,
            typeof p
        );
        this.playerType = p;
    };

    this.setTurn = function(p){
        console.assert(
            typeof p == "string",
            "%s: Expecting a string, got a %s",
            arguments.callee.name,
            typeof p
        );
        this.turn = p;
    };

    this.getPointer = function() {
        return this.pointer;
    };

    this.setWinner = function(p) {
        this.winningPlayer = p;
    };

    this.getWinner = function(){
        return this.winningPlayer;
    };

    this.setLatestFilledSlot = function(p,c,r){
        console.assert(
            typeof p == "string",
            "%s: Expecting a string, got a %s",
            arguments.callee.name,
            typeof p
        );
        console.assert(
            typeof c == "string",
            "%s: Expecting a string, got a %s",
            arguments.callee.name,
            typeof c
        );
        console.assert(
            typeof r == "string",
            "%s: Expecting a string, got a %s",
            arguments.callee.name,
            typeof r
        );

        this.latestFilledSlot["player"] = p;
        this.latestFilledSlot["column"] = c;
        this.latestFilledSlot["row"] = r;

    }

    this.getLatestFilledColumn = function(){
        return this.latestFilledSlot["column"];
    };

    this.getLatestFilledRow = function() {
        return this.latestFilledSlot["row"];
    };

    this.getLatestFilledType = function() {
        return this.latestFilledSlot["player"];
    };

    this.closeSocket = function(){
        
        socket.close();

    }

    this.getInserted = function(){
        return this.inserted;
    };

    this.setFullColumn = function(c){
        console.assert(
            Array.isArray(c),
            "%s: Expecting an Array",
            arguments.callee.name
        );
        this.fullColumn = c;
    };

    this.getFullColumn = function() {
        return this.fullColumn;
    }

    this.whoWon = function(){
        //to check only check total amt of insertion > 3
        let amountConnected = 0;
        let columnName = null;
        let increased = false;
        if(this.inserted.length >= 4){
            
            
            //horizonally connected
            for(let i = 1; i <= this.highestRowInserted; i++){
                for(let j = 1; j <= 7; j++){
                    columnName = String("column" + j);
                    for(let k = 0; k< this.inserted.length; k++){
                        if(this.inserted[k]["column"] == columnName && this.inserted[k]["row"] == i){
                            amountConnected++;
                            increased = true;
                            break;
                        }
                    }
                    
                    if (amountConnected == 4){
                        return true;
                    }

                    if(increased == false){
                        amountConnected = 0;
                    
                    }
                    increased = false;
                }
            }

            
            if(this.highestRowInserted >= 4){
                amountConnected = 0; //initialise
                increased = false; 
                //check for vertically connect
                for(let i = 1; i<= 7; i++){
                    columnName = String("column" + i);
                    for(let j = 1; j <= this.highestRowInserted; j++){
                        for(let k = 0; k < this.inserted.length; k++){
                            if(this.inserted[k]["column"] == columnName && this.inserted[k]["row"] == j){
                                amountConnected++;
                                increased = true;
                                break;
                            }
                        }
                        if (amountConnected == 4){
                            return true;
                        }
    
                        if(increased == false){
                            amountConnected = 0;
                        }
                        increased = false;
                    }

                }

                //check for diagonally corrected (/)
                for(let i = 1; (i+3)<= this.highestRowInserted;i++){
                    for(let j = 1 ; j <= 4; j++){
                        columnName = String("column" + j);
                        for(let k = 0 ; k < this.inserted.length; k++){
                            if(this.inserted[k]["column"] == columnName && this.inserted[k]["row"] == i){
                                for(let l = 0; l <this.inserted.length; l++){
                                    columnName = String("column" + (j+1));
                                    if(this.inserted[l]["column"] == columnName && this.inserted[l]["row"] == (i+1)){
                                        for(let m = 0; l <this.inserted.length; m++){
                                            columnName = String("column" + (j+2));
                                            if(this.inserted[m]["column"] == columnName && this.inserted[m]["row"] == (i+2)){
                                                for(let o = 0; l <this.inserted.length; o++){
                                                    columnName = String("column" + (j+3)); 
                                                    if(this.inserted[o]["column"] == columnName && this.inserted[o]["row"] == (i+3)){
                                                        return true;
                                                    }
                                                } 
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
                //check for diagonally corrected (\)
                for(let i = 1; (i+3)<= this.highestRowInserted;i++){
                    for(let j = 8 ; j >= 4; j--){
                        columnName = String("column" + j);
                        for(let k = 0 ; k < this.inserted.length; k++){
                            if(this.inserted[k]["column"] == columnName && this.inserted[k]["row"] == i){
                                for(let l = 0; l <this.inserted.length; l++){
                                    columnName = String("column" + (j-1));
                                    if(this.inserted[l]["column"] == columnName && this.inserted[l]["row"] == (i+1)){
                                        for(let m = 0; l <this.inserted.length; m++){
                                            columnName = String("column" + (j-2));
                                            if(this.inserted[m]["column"] == columnName && this.inserted[m]["row"] == (i+2)){
                                                for(let o = 0; l <this.inserted.length; o++){
                                                    columnName = String("column" + (j-3)); 
                                                    if(this.inserted[o]["column"] == columnName && this.inserted[o]["row"] == (i+3)){
                                                        return true;
                                                    }
                                                } 
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }

            return false;

        } else { 
            return false;
        }
    };

    this.setLatestInsertedRow = function(r) {
        console.assert(
            typeof r == "number",
            "%s: Expecting a number, got a %s",
            arguments.callee.name,
            typeof r
        )
        this.inserted[this.inserted.length - 1]["row"] = r;
        if( r  > this.highestRowInserted){
            this.highestRowInserted = r;
        }
    };

    this.updateGame = function(clickedColumn){ 
        //to be implemented 
        console.assert(
            typeof clickedColumn == "string",
            "%s: Expecting a string, got a %s",
            arguments.callee.name,
            typeof clickedColumn
        );
        
        

        // this.amountinserted++;
        var outgoingMsg = Messages.O_INSERTED;
        outgoingMsg.data = {column:clickedColumn, playerType: this.playerType};
        socket.send(JSON.stringify(outgoingMsg));

        // wait for information from the server regarding row added - done in socket.message 
        //client updates the inserted array 
        this.inserted.push({column:clickedColumn, row: null});
        
        //continued at receiving T_INSERTED_ROW
          
    };
};

function ConnectBoard(gs){
    //create reference for eventlistener function 
    var obj = {
        singleClick: function(e) {
                                    var clickedColumn = e.currentTarget.id;
            
                                    gs.updateGame(clickedColumn);
                                    new Audio("../data/pop.wav").play();                               
                                }
    };

    var elements = document.getElementsByClassName("column");

    this.enableListeners = function(){
        
        Array.from(elements).forEach(function(el){
            el.addEventListener("click",obj.singleClick);    
        });
    };

    this.disableListeners = function(){
        Array.from(elements).forEach(function(el1){
            el1.removeEventListener("click",obj.singleClick, false);
        });
    };
};

function setCookie(cvalue) {
    document.cookie = String("gamesPlayed=" + cvalue + ";");
}

function getCookie() {
    var cookiesArray = document.cookie.split('; ');
    var cookies=[];
    
    for(var i=0; i < cookiesArray.length; i++) {
        var cookie = cookiesArray[i].split("=");
        cookies[cookie[0]]=cookie[1];
    }
    return cookies;
  }

//Timer 
var startTime, endTime;

function startNow() {
  startTime = new Date();
};

function timeNow() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);

  document.getElementById("theTimer").innerHTML = String(seconds + " s");
//   return String(seconds + " seconds");
}

//set everthing up, including the WebSocket
(function setup(){
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);

    /*
     * initialise all UI elements of the game:
     * - the board
     * - status bar
     * 
     * the GameState object coordinates everything
    */
   
   var sb = new StatusBar; //example in ui-right
   var ss = new Slots; // ss - slotstatus for updating view 
   var ps = new Pointer; // ps - pointerstatus for hovering 

   var gs = new GameState(sb, ss, ps, socket);
   var cb = new ConnectBoard(gs);

    socket.onmessage = function(event){
        let incomingMsg = JSON.parse(event.data);


        
        //set player type 
        if (incomingMsg.type == Messages.T_PLAYER_TYPE){
           gs.setPlayerType(incomingMsg.data); // should be "player1" or "player2"

            // creating cookies
            if( getCookie() != null && !isNaN(getCookie()["gamesPlayed"])){
                var numGamesPlayed = parseInt(getCookie()["gamesPlayed"]) + 1;
                setCookie(numGamesPlayed);
            } else {
                setCookie(1,14);
            }

           if(gs.getPlayerType() == "player1"){
               sb.setStatus(Status["Waiting"]);
           } else {
               startNow();
               timeNow();
               sb.setStatus(Status["player2Intro"]);
               let msg = Messages.O_CONNECTED;
               socket.send(JSON.stringify(msg));
           }
        }

        //Opponent Connected
        if (incomingMsg.type == Messages.T_CONNECTED){
            startNow();
            timeNow();
            sb.setStatus(Status["player1Intro"]);
            cb.enableListeners();
        }

        //Receiving corresponding inserted row 
        if (incomingMsg.type == Messages.T_INSERTED_ROW){
            gs.setLatestInsertedRow(incomingMsg.data);


                    //is the game complete?
            
            let temp = gs.whoWon();
            let winner;
            setTimeout(function(){
                winner = temp;
                if(winner){
                    timeNow();
                    gs.setWinner(gs.getPlayerType());
                    let uColumn = gs.getInserted()[gs.getInserted().length -1]["column"].match(/\d+/g).map(Number);
                    let uRow = gs.getInserted()[gs.getInserted().length -1]["row"] + 64;
                    let uSlot = String(String.fromCharCode(uRow) +  uColumn[0]);
                    let uStatus =  "row" + gs.getPlayerType();
                    ss.setSlot(uSlot,uStatus);
                    let alertString = Status["gameWon"];

                    alertString += Status["playAgain"];
                    sb.setStatus(alertString);
    
                    //alerting both side of the respective winner and loser 
                    let finalMsg = Messages.O_GAME_WON_BY;
                    finalMsg.data = {
                        winner:gs.getPlayerType(),
                        row: gs.getInserted()[gs.getInserted().length -1]["row"],
                        column: gs.getInserted()[gs.getInserted().length -1]["column"],
                    };
                    socket.send(JSON.stringify(finalMsg));
    
                } else {
                    //client updates server that they have completed their move, where server then notifies both players to update their view 
                    let outgoingMsg = Messages.O_MOVE_COMPLETED; //does this create a new instance of message? 
                    outgoingMsg.data = {
                        player: gs.getPlayerType(), 
                        row: gs.getInserted()[gs.getInserted().length -1]["row"],
                        column: gs.getInserted()[gs.getInserted().length -1]["column"],
                    };
                    socket.send(JSON.stringify(outgoingMsg)); 
                
                }
    
            },100);


        }

        if (incomingMsg.type == Messages.T_CHANGE_TURN_TO){
            if(gs.getPlayerType() == incomingMsg.data) {
                cb.enableListeners();
                sb.setStatus(Status["itsYourTurn"]);

            } else {
                cb.disableListeners();
                sb.setStatus(Status["notYourTurn"]);
            }
            timeNow();
        }

        if (incomingMsg.type == Messages.T_COLUMN_FULL){
            gs.setFullColumn(incomingMsg.data);
            gs.getFullColumn().forEach(function(fullcolumn){
                let uPointer = String("pointer" + fullcolumn.match(/\d+/g).map(Number)[0]);
                document.getElementById(fullcolumn).className = "fullcolumn";
                document.getElementById(uPointer).className = "pointerFull"; 
            });
        }

        if (incomingMsg.type == Messages.T_UPDATE_VIEW){
            // gs.setLatestFilledSlot(incomingMsg.data["player"],incomingMsg.data["column"],incomingMsg.data["row"]);
            let uColumn = incomingMsg.data["column"].match(/\d+/g).map(Number);
            let uRow = incomingMsg.data["row"] + 64;
            let uSlot = String(String.fromCharCode(uRow) +  uColumn[0]);
            let uStatus =  "row" + incomingMsg.data["player"];
            ss.setSlot(uSlot,uStatus);
            
        }

        if (incomingMsg.type == Messages.T_GAME_WON_BY){
            if(incomingMsg.data["winner"] == gs.getPlayerType()){
                new Audio("../data/clap.wav").play();
                socket.close();
            } else {
                timeNow();
                gs.setWinner(incomingMsg.data["winner"]);
                //finalview update
                let uColumn = incomingMsg.data["column"].match(/\d+/g).map(Number);
                let uRow = incomingMsg.data["row"] + 64;
                let uSlot = String(String.fromCharCode(uRow) +  uColumn[0]);
                let uStatus =  "row" + incomingMsg.data["winner"];
                ss.setSlot(uSlot,uStatus);
                new Audio("../data/sigh.wav").play();
                sb.setStatus(Status["gameLost"] + Status["playAgain"]);
                socket.close();

            }


        } 
    };


    socket.onopen = function() {
        socket.send("{}");
    };

    //server sends a close event only if the game is aborted from some side
    socket.onclose = function(){
        if(gs.getWinner() == null){
            sb.setStatus(Status["aborted"]);
        }
    };

})(); //execute immediately

// this.diagonalWinMatrix= [
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0],
//         [1, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 1],
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 0, 0, 1]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [1, 0, 0, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0]
//     ],
//     [
        
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0],
//         [1, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 1],
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 0, 0, 1],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 0],
//         [1, 0, 0, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
        
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0],
//         [1, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 0, 0, 0, 1],
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 0, 0, 1],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 0, 0, 1, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [0, 1, 0, 0, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 1, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ],
//     [
//         [1, 0, 0, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0],
//         [0, 0, 1, 0, 0, 0, 0],
//         [0, 0, 0, 1, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0]
//     ]
// ];