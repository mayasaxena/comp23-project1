var playerSpeed = 32;
var tileSize = 32;
var backgroundX = 160;
var backgroundY = 220;

function Level1Risky() {
    this.player;
    this.chairs;
    this.cursors;
    this.xCoord;
    this.yCoord;
};

Level1Risky.prototype = {
    preload: function() {
        console.log("Risky but Rewarding");
        this.game.load.image('background', 'assets/images/map1.png');
        this.game.load.image('chair', 'assets/images/risky_chair.png');
        this.game.load.image('tree', 'assets/images/risky_tree.png');
        this.game.load.image('player', 'assets/images/sprite.png');
        // load all game assets
        // images, spritesheets, atlases, audio etc..
    },

    // var chairs;
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.add.sprite(backgroundX, backgroundY, 'background');
        
        this.chairs = this.game.add.group();
        this.chairs.enableBody = true;
        var chair = this.chairs.create(backgroundX + 1 * 32, backgroundY + 4, 'chair');
        chair.body.immovable = true;
        chair = this.chairs.create(backgroundX + 3 * 32, backgroundY + 4, 'chair');
        chair.body.immovable = true;


        this.player = this.game.add.sprite(backgroundX, backgroundY + 2 * 32, 'player');

        this.game.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;

        // this.cursors = this.game.input.keyboard.createCursorKeys();
        // this.game.input.keyboard.onUpCallback = function(event) {
        //     if (event.keyCode == Phaser.Keyboard.UP) {
        //         console.log("up");
        //         this.player.body.velocity.y = -playerSpeed;
        //     } else if (event.keyCode == Phaser.Keyboard.DOWN) {
        //         console.log("down");
        //         this.player.body.velocity.y = playerSpeed;
        //     } else if (event.keyCode == Phaser.Keyboard.LEFT) {
        //         console.log("left");
        //         this.player.body.velocity.x = -playerSpeed;
        //     } else if (event.keyCode == Phaser.Keyboard.RIGHT) {
        //         console.log("right");
        //         this.player.body.velocity.x = playerSpeed;
        //     }
        // };
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.upKey.onUp.add(this.onUp, this);
        this.upKey.onDown.add(this.onDown, this);

        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.downKey.onUp.add(this.onUp, this);
        this.downKey.onDown.add(this.onDown, this);

        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.leftKey.onUp.add(this.onUp, this);        
        this.leftKey.onDown.add(this.onDown, this);

        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.rightKey.onUp.add(this.onUp, this);        
        this.rightKey.onDown.add(this.onDown, this);

    },

    update: function() {
        this.game.physics.arcade.collide(this.player, this.chairs);
        this.xCoord = Math.floor(((this.player.x + tileSize / 2) - backgroundX) / tileSize);
        this.yCoord = Math.floor(((this.player.y + tileSize / 2) - backgroundY) / tileSize);

        //  Reset the players velocity (movement)
        // this.player.body.velocity.x = 0;
        // this.player.body.velocity.y = 0;

    // if (this.cursors.left.isDown) {
    //     //  Move to the left
    //     this.player.body.velocity.x -= playerSpeed;

    //     // this.player.animations.play('left');
    // } else if (this.cursors.right.isDown) {
    //     //  Move to the right
    //     this.player.body.velocity.x += playerSpeed;

    //     // this.player.animations.play('right');
    // } else if (this.cursors.up.isDown) {

    //     this.player.body.velocity.y -= playerSpeed;

    // } else if (this.cursors.down.isDown) {

    //     this.player.body.velocity.y += playerSpeed;

    // } else {

    // }
    
    },

    onDown: function(event) {

        if (event.keyCode == Phaser.Keyboard.UP) {
                this.player.body.velocity.y = -playerSpeed;
            } else if (event.keyCode == Phaser.Keyboard.DOWN) {
                this.player.body.velocity.y = playerSpeed;
            } else if (event.keyCode == Phaser.Keyboard.LEFT) {
                this.player.body.velocity.x = -playerSpeed;
            } else if (event.keyCode == Phaser.Keyboard.RIGHT) {
                this.player.body.velocity.x = playerSpeed;
            }
    },

    onUp: function(event) {
        var xOffset = 0;
        var yOffset = 0;
        if (event.keyCode == Phaser.Keyboard.UP) {
            yOffset = -1;
        } else if (event.keyCode == Phaser.Keyboard.DOWN) {
            yOffset = 1;
        } else if (event.keyCode == Phaser.Keyboard.LEFT) {
            xOffset = -1;
        } else if (event.keyCode == Phaser.Keyboard.RIGHT) {
            xOffset = 1;
        }
        
        console.log("x: " + this.xCoord + ", y: " + this.yCoord);
        this.player.x = (this.xCoord + xOffset) * tileSize + backgroundX;
        this.player.y = (this.yCoord + yOffset) * tileSize + backgroundY;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
    }
};

