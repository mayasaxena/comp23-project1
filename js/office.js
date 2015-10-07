var officeKey = 'Office'

function Office() {} 

Office.prototype = {
    preload: function() {
        console.log("Office");
        this.game.load.image('player', 'assets/images/playersprite.png');


        this.game.load.tilemap('background', 'assets/tilemaps/maps/office.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/risky_tileset.png');
    },

    create: function() {
        var officeData = JSON.parse(localStorage.getItem(officeKey));
        if (officeData) {
            this.startX = officeData.x;
            this.startY = officeData.y;
            
        } else {
            this.startX = 2;
            this.startY = 4;
        }

        this.map = this.game.add.tilemap('background');
        this.map.addTilesetImage('risky_tileset', 'tiles');

        this.floors = this.map.createLayer("Floor");
        // this.objects = this.map.createLayer("Objects");
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
    //     var officeData = {
    //         x: this.player.x / tileSize,
    //         y: this.player.y / tileSize
    //     }
    //     localStorage.setItem(officeKey, JSON.stringify(officeData));
    //     localStorage.setItem('x', this.player.x / tileSize);
    //     localStorage.setItem('y', this.player.y / tileSize);

    // },

    handleDoor: function(doorX, doorY, goingIn) {
        var state = "Level1Risky";
        if (goingIn) {
            var newDoor = new Door(this.game, doorX * tileSize + backgroundX, doorY * tileSize + backgroundY);
            newDoor.open();
            // Put down placeholder tile to prevent movement onto door while opening
            this.map.putTile(11, doorX, doorY, this.obstacles);
            // Remove door obstacle so player can go through
            newDoor.events.onAnimationComplete.add(function() {
                this.map.removeTile(doorX, doorY, this.obstacles);
                this.goThroughDoor(doorX, doorY, state);
            }, this);
        } else {
            this.goThroughDoor(doorX, doorY, state);
        }
    }
}