function Game() {}
Game.prototype = {
    start: function() {
        var game = new Phaser.Game(600, 480, Phaser.AUTO, 'game');
        game.state.add("MainMenu", MainMenu);
        game.state.add("Lobby", Lobby);
        game.state.add("Level1Risky", Level1Risky);
        game.state.add("Office", Office);
        game.state.add("Level1Slow", Level1Slow);
        game.state.add("Win", Win);
        game.state.start("MainMenu");
    }
};

$(document).ready(function(){
    $("#dialog_box").hide();
});

var game = new Game();
localStorage.clear();
game.start();
