var tileSize = 32;
var tweenTime = 250;

function Level1Risky() {};

Level1Risky.prototype = {
    preload: function() {
        console.log("Risky but Rewarding");
        this.game.load.image('chair', 'assets/images/risky_chair.png');
        this.game.load.image('tree', 'assets/images/risky_tree.png');
        this.game.load.image('player', 'assets/images/playersprite.png');

        this.game.load.tilemap('background', 'assets/tilemaps/maps/risky.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/risky_tileset.png');
    },

    create: function() {
        this.map = this.game.add.tilemap('background');
        this.map.addTilesetImage('risky_tileset', 'tiles');
    
        var floors = this.map.createLayer("Floor");
        var objects = this.map.createLayer("Objects");
        this.obstacles = this.map.createLayer("Collisions");

        this.map.setCollisionByExclusion([2], true, this.obstacles);
        this.map.setCollision(0, true, this.obstacles);

        this.player = new Player(this.game, this.map, this.obstacles, 0, tileSize * 2);
    }
};



