class MeetingRoom {
    constructor(ui) {
        this.border = 100;
        this.ui = ui;
        if (ui) {
            this.spriteBG = new Image();
            this.spriteBG.src = "/static/resources/meetingRoom3.png";
            this.spriteBGWidth = 1024;
            this.spriteBGHeight = 768;
        }
    }
    update(timeDiff) {
    }
    draw() {
        if (!this.ui)
            return;
        //BG
        ctx.drawImage(this.spriteBG, 0, 0, this.spriteBGWidth, this.spriteBGHeight, // sprite cutout position and size
        0, 0, 900, 1000); // draw position and size
        if (drawColliders)
            this.drawBorder();
    }
    drawBorder() {
        //draw border
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.rect(this.border, this.border, CANVAS_WIDTH - this.border * 2, CANVAS_HEIGHT - this.border * 2);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }
}
//# sourceMappingURL=MeetingRoom.js.map