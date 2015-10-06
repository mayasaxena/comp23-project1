function Office() {} 

Office.prototype = {
    preload: function() {
        console.log("Office");
        this.game.load.image('player', 'assets/images/playersprite.png');
        // this.game.load.spritesheet('door_animation', 'assets/images/animation/risky_door_animation.png', 32, 32);


        this.game.load.tilemap('background', 'assets/tilemaps/maps/office.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/risky_tileset.png');
    },

    create: function() {
        this.map = this.game.add.tilemap('background');
        this.map.addTilesetImage('risky_tileset', 'tiles');

        this.floors = this.map.createLayer("Floor");
        // this.objects = this.map.createLayer("Objects");
        this.obstacles = this.map.createLayer("Collisions");

        this.map.setCollisionByExclusion([], true, this.obstacles);

        this.player = new Player(this.game, tileSize * 2, tileSize * 4);
        this.player.map = this.map
        this.player.obstacles = this.obstacles;
        this.player.handleDoor = this.handleDoor;

        this.game.camera.bounds = null;
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);
        this.game.renderer.renderSession.roundPixels = true
    },
}