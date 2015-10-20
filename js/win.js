function Win() {};

Win.prototype = {
    create: function() {
        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, this.game.width * 2, this.game.height);
        graphics.alpha = 1;
        graphics.endFill();
        var tween = this.game.add.tween(graphics).to({ alpha: 0 }, 500);
        tween.start();
        
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "YOU WIN!", style);
        text.anchor.set(0.5);
    }
}