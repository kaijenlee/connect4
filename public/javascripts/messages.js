(function(exports) {
    /*
     * Client to server: game is complete, the winner is ...
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
      type: exports.T_GAME_WON_BY,
      data: null
    };
  
    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.O_GAME_ABORTED = {
      type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);
  

    /*
     * Server to client: set as player1
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_1 = {
      type: exports.T_PLAYER_TYPE,
      data: "player1"
    };
    exports.S_PLAYER_1 = JSON.stringify(exports.O_PLAYER_1);
  
    /*
     * Server to client: set as player2
     */
    exports.O_PLAYER_2 = {
      type: exports.T_PLAYER_TYPE,
      data: "player2"
    };
    exports.S_PLAYER_2 = JSON.stringify(exports.O_PLAYER_2);
    
    /*
     * Opponent connected and is sent to the server to notify player1 to start game
     */
    exports.T_CONNECTED = "CONNECTED";
    exports.O_CONNECTED = {
      type: exports.T_CONNECTED,
    };
      
    /*
     * Player  to server OR server to Opposing Player: Chip inserted/move made
     */
    exports.T_INSERTED = "INSERT-A-CHIP";
    exports.O_INSERTED = {
      type: exports.T_INSERTED,
      data: null
    };
  
    /*
     * Server to client: informing which row the chip was inserted 
     */    
    exports.T_INSERTED_ROW = "INSERTED-ROW";
    exports.S_INSERTED_ROW = {
        type: exports.T_INSERTED_ROW,
        data: null
    };

    /*
     * Client to server: informing that they have completed their move -server switches turn and notifies clients to update their view
     */
    exports.T_MOVE_COMPLETED = "MOVE-COMPLETED";
    exports.O_MOVE_COMPLETED = {
        type: exports.T_MOVE_COMPLETED,
        data : null 
    };

    /*
     * Server to ALL clients within the same game : notify of which column is full;
     */
    exports.T_COLUMN_FULL = "COLUMN_FULL";
    exports.S_COLUMN_FULL = {
        type: exports.T_COLUMN_FULL,
        data: null
    };

    /*
     * Server to ALL clients within the same game : notify both clients to update view
     */
    exports.T_UPDATE_VIEW = "UPDATE_VIEW";
    exports.S_UPDATE_VIEW = {
        type: exports.T_UPDATE_VIEW,
        data: null
    };

    /*
     * Server to clients: notifying of turn change 
     */
    exports.T_CHANGE_TURN_TO = "CHANGE_TURN_TO"
    exports.O_CHANGE_TURN_TO_PLAYER1 = {
        type: exports.T_CHANGE_TURN_TO,
        data: "player1"
    };
    exports.O_CHANGE_TURN_TO_PLAYER2 = {
        type: exports.T_CHANGE_TURN_TO,
        data: "player2" 
    };
    exports.S_CHANGE_TURN_TO_PLAYER1 = JSON.stringify(exports.O_CHANGE_TURN_TO_PLAYER1); 
    exports.S_CHANGE_TURN_TO_PLAYER2 = JSON.stringify(exports.O_CHANGE_TURN_TO_PLAYER2);
  })(typeof exports === "undefined" ? (this.Messages = {}) : exports);
  //if exports is undefined, we are on the client; else the server
  