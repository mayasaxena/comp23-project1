var facingForwardIndex = 3;

function Lobby() {};

Lobby.prototype = {
    preload: function() {
        console.log("Lobby");
        this.game.load.image('player', 'assets/images/player_new.png');
        this.game.load.spritesheet('door_animation', 'assets/images/animation/risky_door_animation.png', 32, 32);
        this.game.load.spritesheet('walk', 'assets/images/animation/player_walk.png', 32, 32);
        this.game.load.image("ming", "assets/images/ming.png");
        this.game.load.image('file', 'assets/images/file.png');
        this.game.load.tilemap('background', 'assets/tilemaps/maps/lobby.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/risky_tileset.png');
        this.game.load.image('slow_tiles', 'assets/tilemaps/tiles/slow_tileset.png');
        this.game.load.audio('lobbyMusic', 'assets/audio/lobby_music.mp3');
    },

    create: function() {
        var lobbyData = JSON.parse(localStorage.getItem(this.game.state.current));
        if (lobbyData) {
            this.startX = lobbyData.x;
            this.startY = lobbyData.y;
            this.facing = lobbyData.facing;
            
        } else {
            this.startX = 4;
            this.startY = 5;
            this.facing = facingForwardIndex;
        }
        //music
        music = this.game.add.audio('lobbyMusic');
        music.play();

        this.map = this.game.add.tilemap('background');
        this.map.addTilesetImage('risky_tileset', 'tiles');

        this.floors = this.map.createLayer("Floor");
        this.obstacles = this.map.createLayer("Collisions");
        this.map.setCollisionByExclusion([], true, this.obstacles);

        this.player = new Player(this.game, this.startX * tileSize, this.startY * tileSize, this.facing);
        this.player.map = this.map
        this.player.obstacles = this.obstacles;
        this.player.handleDoor = this.handleDoor;
        this.player.handleAdmin = this.handleAdmin;

        this.admin = this.game.add.sprite(4 * tileSize, 2.75 * tileSize, "ming");
        this.objects = this.map.createLayer("Object");

        
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
        if (doorX == 2) {
            music.fadeOut(800);
            state = 'Level1Risky';
        } else if (doorX == 6) {
            music.fadeOut(800);
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
    },

    handleAdmin: function() {
        $("#dialog_box").show();
        $("#dialog_box").text("To add a class, you must find an administrator to sign off on your add form. There is one in each office, but finding them may pose a challenge.");
    }
};