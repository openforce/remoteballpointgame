class BallBasket {
    constructor(x, y, ui) {
        this.radius = 30;
        this.ballRadius = 7;
        this.ballColor = 'red';
        this.x = x;
        this.y = y;
        this.ui = ui;
    }
    update(timeDiff) {
    }
    draw() {
        if (!this.ui)
            return;
        //Basket
        if (drawColliders)
            this.drawBasketColider();
        drawCyrcle(this.x, this.y, this.radius, 'chocolate');
        //balls
        for (var i = -12; i <= 12; i += 12) {
            for (var j = -12; j <= 12; j += 12) {
                drawCyrcle(this.x + i, this.y + j, this.ballRadius, this.ballColor);
            }
        }
    }
    drawBasketColider() {
        drawCyrcle(this.x, this.y, this.radius + 1, 'blue');
    }
}
//# sourceMappingURL=BallBasket.js.map