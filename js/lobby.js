var lobbyKey = 'Lobby';

function Lobby() {};

Lobby.prototype = {
    preload: function() {
        console.log("Lobby");
        this.game.load.image('player', 'assets/images/playersprite.png');
        this.game.load.spritesheet('door_animation', 'assets/images/animation/risky_door_animation.png', 32, 32);

        this.game.load.tilemap('background', 'assets/tilemaps/maps/lobby.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/risky_tileset.png');
    },

    create: function() {
        var lobbyData = JSON.parse(localStorage.getItem(lobbyKey));
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
    },

    // shutdown: function() {
    //     var lobbyData = {
    //         x: this.player.x / tileSize,
    //         y: this.player.y / tileSize
    //     }
    //     localStorage.setItem(lobbyKey, JSON.stringify(lobbyData));
    //     localStorage.setItem('x', this.player.x / tileSize);
    //     localStorage.setItem('y', this.player.y / tileSize);

    // },

    // handleDoor is a Player function so 'this' is the player object
    handleDoor: function(doorX, doorY, goingIn) {
        if (goingIn) {
        // Comment back in for other level
            // if (doorX == 2) {
                var state = "Level1Risky";
            // }
            var newDoor = new Door(this.game, doorX * tileSize + backgroundX, doorY * tileSize + backgroundY);
            newDoor.open();
            // Put down placeholder tile to prevent movement onto door while opening
            this.map.putTile(11, doorX, doorY, this.obstacles);
            // Remove door obstacle so player can go through
            newDoor.events.onAnimationComplete.add(function() {
                this.map.removeTile(doorX, doorY, this.obstacles);
                this.goThroughDoor(doorX, doorY, state);
            }, this);
        }
    }
};