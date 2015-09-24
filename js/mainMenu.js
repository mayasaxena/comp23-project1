function MainMenu() {};

MainMenu.prototype = {

    preload: function() {
        // load preloader assets
        console.log("mainmenu");
    },

    create: function() {
        // setup game environment
        // scale, input etc..
        // Loads lobby, need to do similar to switch levels
            this.game.state.start('Lobby');
    }
    
};