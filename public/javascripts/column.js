function Column(){
    this.columns = undefined; 

    this.initialize = function() {
        this.columns ={
            column1 : {num:0, chip: []},
            column2 : {num:0, chip: []},
            column3 : {num:0, chip: []},
            column4 : {num:0, chip: []},
            column4 : {num:0, chip: []},
            column5 : {num:0, chip: []},
            column6 : {num:0, chip: []},
            column7 : {num:0, chip: []}
        };
    };

    //Is it a valid column?
    this.isColumn = function(column){
        console.assert(typeof column === "string", "Single string expected");
        return Object.prototype.hasOwnProperty(this.columns, column);
    };

    this.isColumnAvailable = function(column){
        console.assert(typeof column === "string", "Single string expected");
        return this.isColumn(column) && this.columns[column].num <= 3;   
    };

    this.makeColumnUnavailable = function(column) {
        console.assert(typeof column === "string", "Single string expected");
        if(this.isColumn(column)){

            //vvisually switch off the UI element by simply adding a classname
            document.getElementById(column).className += "columnFULL"
        }
    };

    this.getLatestInsertedRow = function(column) {
        console.assert(typeof column === "string", "Single string expected");
        if(this.isColumn(column)) {
            return this.columns[column]["num"]; //may be wrong
        }
    };

    this.getFullColumns = function(){
        var fullColumns = [];
        var value = 0;
        this.columns.foreach(function(current){
            value++;
            if (current["num"] >= 4){
                fullColumns.push(str.toString("column" + value)); // may be wrong 
            }
        });
    };

    this.addToColumn = function(column,player){
        console.assert(typeof column === "string", "Single string expected");
        console.assert(typeof player === "string", "Single string expected");
        this.columns[column].num++;
        this.columns[column].chip.push(player);
    };
}

module.exports = Column;