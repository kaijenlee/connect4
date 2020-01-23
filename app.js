var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");

var gameStatus = require("./stattracker");
var Game = require("./game");

var port = process.argv[2];
var app = express();

// app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

var server = http.createServer(app);
const wss = new websocket.Server({server});

//adding route
// app.get("/",indexRouter);
app.set('view engine', 'ejs')
app.get('/', function(req, res) {
    //example of data to render; here gameStatus is an object holding this information
    res.render('splash.ejs', { gamesInitialized: gameStatus.gamesInitialized, gamesCompleted: gameStatus.gamesCompleted, gamesAborted: gameStatus.gamesAborted, sinceDate: gameStatus.since });
})
app.get("/play",indexRouter);
app.get("/rules",indexRouter);
app.get("/back",indexRouter);

var websockets = {}; //property: websocket, value: game

// /*
//  * regularly clean up the websockets object
//  */
// setInterval(function() {
//   for (let i in websockets) {
//     if (Object.prototype.hasOwnProperty.call(websockets,i)) {
//       let gameObj = websockets[i];
//       //if the gameObj has a final status, the game is complete/aborted
//       if (gameObj.finalStatus != null) {
//         delete websockets[i];
//       }
//     }
//   }
// }, 50000);

var currentGame = new Game(gameStatus.gamesInitialized++);
// currentGame.getColumns().initialize();
var connectionID = 0; //each websocket receives a unique ID

wss.on("connection", function connection(ws){
  // every two players are added to the same game
  let con = ws;
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log(
    "Player %s placed in game %s as %s",
    con.id,
    currentGame.id,
    playerType
  );

  /*
   * inform the client about its assigned player type
   */
  con.send(playerType == "player1" ? messages.S_PLAYER_1 : messages.S_PLAYER_2);

  /*
   * Once two players have connected , a new game object is created
   * if a player leaves now, the game is aborted 
   */
  if (currentGame.hasTwoConnectedPlayers()){
    currentGame = new Game(gameStatus.gamesInitialized++);
  }

  /*
   * message coming in from a player
   * 1. determine the game object
   * 2. determine the opposing player (OP)
   * 3. send the message to OP 
   */
  con.on("message", function incoming(message){
    let oMsg = JSON.parse(message);

    let gameObj = websockets[con.id];
    let isPlayer1 = gameObj.player1 == con ? true:false; //to determine which player sent the message

    //Redirect message to player1 that their opponent has connected
    if(oMsg.type == messages.T_CONNECTED){
      gameObj.player1.send(message);
    }

    //client updateGame is called
    if(oMsg.type == messages.T_INSERTED){
      var insertedColumn = oMsg.data["column"];
      var insertedPlayerType = oMsg.data["playerType"];
      gameObj.getColumns().addToColumn(insertedColumn,insertedPlayerType);

      //send back to client which row has been added 
      let msg = messages.S_INSERTED_ROW;
      msg.data = gameObj.getColumns().getLatestInsertedRow(insertedColumn);
      con.send(JSON.stringify(msg));
      let sentPlayer = isPlayer1 ? "player1":"player2"
      console.log(String("[SERVER] Corresponding inserted row sent to " + sentPlayer + " in game " + currentGame.getId()));

    }

    //client completed the move
    if(oMsg.type == messages.T_MOVE_COMPLETED){

      gameObj.setStatus("CHIP INSERTED");
      //update corresponding clients which columns are full
      let msg = messages.S_COLUMN_FULL;
      msg.data = gameObj.getColumns().getFullColumns();
      gameObj.player1.send(JSON.stringify(msg));
      gameObj.player2.send(JSON.stringify(msg));

      //notify the clients to update their board 
      let msg1 = messages.S_UPDATE_VIEW;
      msg1.data = oMsg.data;
      gameObj.player1.send(JSON.stringify(msg1));
      gameObj.player2.send(JSON.stringify(msg1));

      //notify the clients the change of turn
      if(isPlayer1){
        gameObj.setTurn("player2");
        let msg2 = messages.S_CHANGE_TURN_TO_PLAYER2;
        gameObj.player1.send(msg2);
        gameObj.player2.send(msg2);

      } else {
        gameObj.setTurn("player1");
        let msg2 = messages.S_CHANGE_TURN_TO_PLAYER1;
        gameObj.player1.send(msg2);
        gameObj.player2.send(msg2);
      }
    }

    if(oMsg.type == messages.T_GAME_WON_BY) {
      console.log("[SERVER] winning message received");
      gameObj.setStatus(oMsg.data["winner"]);
      gameStatus.gamesCompleted++

      //since client detects if they won, forward message to opponent
        gameObj.player2.send(message);
        gameObj.player1.send(message);
    }

    // to be implemented what is sent from server 
  });

  con.on("close",function(code){
    // code 1001: closing initiated by client
    console.log(con.id + " disconnected. ");

    if(code == "1001"){
      // if game not already completed , abort the game. 
      let gameObj = websockets[con.id];

      if(gameObj.isValidTransition(gameObj.gameState, "ABORTED")){
        gameObj.setStatus("ABORTED");
        gameStatus.gamesAborted++;

        // Determining the remaining connection, and close it 
        try{
          gameObj.player1.close();
          gameObj.player1 = null; 
        } catch(e) {
          console.log("Player1 closing: " + e);
        }

        try{
          gameObj.player2.close();
          gameObj.player2 = null; 
        } catch(e) {
          console.log("Player2 closing: " + e);
        }
      }
    }
  });
});

server.listen(port);