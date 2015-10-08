function Game() {}
Game.prototype = {
    start: function() {
        var game = new Phaser.Game(600, 480, Phaser.AUTO, '');
        game.state.add("MainMenu", MainMenu);
        game.state.add("Lobby", Lobby);
        game.state.add("Level1Risky", Level1Risky);
        game.state.add("Office", Office);
        game.state.add("Level1Slow", Level1Slow);
        game.state.start("MainMenu");
    }
};

var game = new Game();
localStorage.clear();
game.start();
