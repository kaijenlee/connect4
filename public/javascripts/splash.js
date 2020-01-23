function getCookie() {
    var cookiesArray = document.cookie.split('; ');
    var cookies=[];
    
    for(var i=0; i < cookiesArray.length; i++) {
        var cookie = cookiesArray[i].split("=");
        cookies[cookie[0]]=cookie[1];
    }
    return cookies;
}

var nCookies = getCookie();
if(nCookies["gamesPlayed"] == undefined || nCookies["gamesPlayed"] == null ||nCookies["gamesPlayed"] < 1){
    document.getElementById("numGamesPlayed").innerHTML = "You have not played this game before.";
} else if (nCookies["gamesPlayed"] == 1){
    document.getElementById("numGamesPlayed").innerHTML = "You have played 1 instance of this game";
} else {
    document.getElementById("numGamesPlayed").innerHTML = String("You have played "+ parseInt(nCookies["gamesPlayed"])+ " instance of this game");
}

