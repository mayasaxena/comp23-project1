function Game() {}
Game.prototype = {
    start: function() {
        var game = new Phaser.Game(640, 480, Phaser.AUTO, '');
        game.state.add("MainMenu", MainMenu);
        game.state.add("Lobby", Lobby);
        game.state.start("MainMenu");
    }
};

var game = new Game();
game.start();
