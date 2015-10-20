function Office() {} 

Office.prototype = {
    preload: function() {
        console.log("Office");
        this.game.load.tilemap('office', 'assets/tilemaps/maps/office.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.json("offices", 'assets/level_json/risky_admin_locations.json');
        this.game.load.image("target", "assets/images/target.png");
        this.game.load.image("a", "assets/images/admin_a.png");
        this.game.load.image("b", "assets/images/admin_b.png");
        this.game.load.image("c", "assets/images/admin_c.png");
        this.game.load.image("d", "assets/images/admin_d.png");
        this.game.load.image("e", "assets/images/admin_e.png");
    },

    create: function() {
        var officeData = JSON.parse(localStorage.getItem(this.game.state.current));
        if (officeData) {
            this.startX = officeData.x;
            this.startY = officeData.y;
            this.facing = officeData.facing;
            
        } else {
            this.startX = 2;
            this.startY = 4;
            this.facing = facingForwardIndex;
        }

        var adminData = JSON.parse(localStorage.getItem(this.game.state.current + "DoorNum"));
        if (adminData !== undefined) {
            var office = this.game.cache.getJSON("offices").locations[adminData];
        }

        this.map = this.game.add.tilemap('office');
        this.map.addTilesetImage('risky_tileset', 'tiles');

        this.floors = this.map.createLayer("Floor");
        this.obstacles = this.map.createLayer("Collisions");

        this.map.setCollisionByExclusion([], true, this.obstacles);

        this.player = new Player(this.game, this.startX * tileSize, this.startY * tileSize, this.facing);
        this.player.map = this.map
        this.player.obstacles = this.obstacles;
        this.player.handleDoor = this.handleDoor;

        this.game.camera.bounds = null;
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);
        this.game.renderer.renderSession.roundPixels = true;

        this.admin = this.game.add.sprite(2 * tileSize, 3 * tileSize, office.admin);
        this.player.office = office;
        this.player.handleAdmin = this.handleAdmin;

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
    },

    handleAdmin: function() {
        if (this.office.text) {
            $("#dialog_box").show();
            $("#dialog_box").text(this.office.text);
        }

        if (this.office.admin === "target") {
            console.log("Won!");
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0x000000);
            graphics.drawRect(0, 0, 1280, this.game.height);
            graphics.alpha = 0;
            graphics.endFill();
            
            var fadeOut = this.game.add.tween(graphics).to({ alpha: 1 }, 500).delay(3000);   

            fadeOut.onComplete.add(function() {
                $("#dialog_box").hide();
                this.game.state.start("Win");
            }, this);

            fadeOut.start();
        }
    }
}