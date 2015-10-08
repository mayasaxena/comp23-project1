function Office() {} 

Office.prototype = {
    preload: function() {
        console.log("Office");
        this.game.load.tilemap('office', 'assets/tilemaps/maps/office.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function() {
        var officeData = JSON.parse(localStorage.getItem(this.game.state.current));
        if (officeData) {
            this.startX = officeData.x;
            this.startY = officeData.y;
            
        } else {
            this.startX = 2;
            this.startY = 4;
        }

        this.map = this.game.add.tilemap('office');
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

        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, this.game.width * 2, this.game.height);
        graphics.alpha = 1;
        graphics.endFill();
        var tween = this.game.add.tween(graphics).to({ alpha: 0 }, 500);
        tween.start();
    },

    // handleDoor is a Player function so 'this' is the player object
    handleDoor: function(doorX, doorY, goingIn, open) {
        var state = "Level1Risky";
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
        } else {
            this.goThroughDoor(doorX, doorY, state, goingIn);
        }
    }
}