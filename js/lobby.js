function Lobby() {};

Lobby.prototype = {
    preload: function() {
        console.log("Lobby");
        this.game.load.image('player', 'assets/images/player_new.png');
        this.game.load.spritesheet('door_animation', 'assets/images/animation/risky_door_animation.png', 32, 32);
        this.game.load.spritesheet('walk', 'assets/images/animation/player_front.png', 32, 32);

        this.game.load.tilemap('background', 'assets/tilemaps/maps/lobby.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/risky_tileset.png');
        this.game.load.image('slow_tiles', 'assets/tilemaps/tiles/slow_tileset.png');
    },

    create: function() {
        var lobbyData = JSON.parse(localStorage.getItem(this.game.state.current));
        if (lobbyData) {
            this.startX = lobbyData.x;
            this.startY = lobbyData.y;
            
        } else {
            this.startX = 4;
            this.startY = 5;
        }
        this.map = this.game.add.tilemap('background');
        this.map.addTilesetImage('risky_tileset', 'tiles');

        this.floors = this.map.createLayer("Floor");
        this.obstacles = this.map.createLayer("Collisions");

        this.map.setCollisionByExclusion([], true, this.obstacles);

        this.player = new Player(this.game, this.startX * tileSize, this.startY * tileSize);
        this.player.map = this.map
        this.player.obstacles = this.obstacles;
        this.player.handleDoor = this.handleDoor;

        this.game.camera.bounds = null;
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);
        this.game.renderer.renderSession.roundPixels = true;

        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, this.game.width * 2, this.game.height);
        graphics.alpha = 1;
        graphics.endFill();
        var tween = this.game.add.tween(graphics).to({ alpha: 0 }, 500);
        tween.start();
    },


    // handles both doors in the lobby
    handleDoor: function(doorX, doorY, goingIn, open) {
        var state;
        if(doorX == 2){
            state = 'Level1Risky';
        }
        else if(doorX == 6){
            state = 'Level1Slow';
        }
        if (goingIn && !open) {
            var newDoor = new Door(this.game, doorX * tileSize + backgroundX, doorY * tileSize + backgroundY);
            newDoor.open();
            // Put down placeholder tile to prevent movement onto door while opening
            this.map.putTile(11, doorX, doorY, this.obstacles);
            // Remove door obstacle so player can go through
            newDoor.events.onAnimationComplete.add(function() {
                this.map.removeTile(doorX, doorY, this.obstacles);
                this.goThroughDoor(doorX, doorY, state, goingIn);
            }, this);
        }
    }
};