function Slots(){
    this.setSlot = function(slotId,slotStatus){
        document.getElementById(slotId).className = slotStatus;
    };
}

function StatusBar() {
    this.setStatus = function(status) {
      document.getElementById("statusbar").innerHTML = status;
    };
}

function Pointer() {
    this.turnOnPointer = function(pointer){

        //set the pointer to be turned on to on
        document.getElementById(pointer).className += "pointerOn";
    }

    this.turnOnFullPointer = function(pointer){

        //set the pointer to be turned on to on
        document.getElementById(pointer).className += "pointerOn pointerFull";
    }

    this.turnOffPointer = function(){

        var pointers = document.getElementsByClassName("pointerOn");
        for(let i = 0; i < pointers.length; i++) {
            pointers.item(i).className = "pointer";
        }

    }
}