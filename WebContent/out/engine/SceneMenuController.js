class SceneMenuController {
    constructor() {
    }
    gotoSceneMenu() {
        gameEngine.navigation = nav_scene_menu;
        this.scene_chosen = null;
    }
    init() {
        //navigation = nav_scene_menu;
        this.scene_chosen = null;
        this.scenes = [];
        initScenes();
    }
    sceneMenu() {
        // UPDATE
        // space to start
        if (this.scene_chosen > 0)
            if (keys[32])
                null; //initScene();
        // goto menu on m
        if (keys[77])
            gameEngine.menuController.gotoMenu();
        // delete cookies with d
        if (keys[68])
            gameEngine.levelMenuController.deleteAllStats();
        // DRAW
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // Headline
        ctx.fillStyle = "red";
        ctx.font = "bold 50px Arial";
        ctx.fillText("SCENES", 100, 100);
        // draw scenes
        this.drawAllSceneIcons();
        // draw scenes Text
        ctx.fillStyle = "black";
        ctx.font = "bold 20px Arial";
        if (this.scene_chosen > 0) {
            ctx.fillText(this.scenes[this.scene_chosen - 1].text, 20, 250);
            // Navigation
            ctx.fillStyle = "black";
            ctx.font = "bold 20px Arial";
            ctx.fillText("Press Space to start scene", 20, 350);
        }
        // Navigation
        ctx.fillStyle = "black";
        ctx.font = "bold 20px Arial";
        ctx.fillText("Press M to return to the menu", 20, 400);
    }
    checkClick(mouseX, mouseY) {
        // loop all scenes
        for (var i = 0; i < this.scenes.length; i++) {
            var scene = this.scenes[i];
            if (mouseX > scene.x && mouseX < scene.x + 50
                && mouseY > scene.y && mouseY < scene.y + 50) {
                this.scene_chosen = scene.id;
                return;
            }
        }
    }
    drawAllSceneIcons() {
        // loop all scenes
        for (var i = 0; i < this.scenes.length; i++) {
            this.drawSceneIcon(this.scenes[i]);
        }
    }
    drawSceneIcon(scene) {
        if (this.scene_chosen == scene.id)
            ctx.fillStyle = "lime";
        else
            ctx.fillStyle = "black";
        ctx.fillRect(scene.x, scene.y, 50, 50);
        if (scene.unlocked)
            ctx.fillStyle = "green";
        else
            ctx.fillStyle = "red";
        ctx.fillRect(scene.x + 5, scene.y + 5, 40, 40);
        ctx.fillStyle = "black";
        ctx.font = "bold 30px Arial";
        ctx.fillText(String(scene.id), scene.x + 15, scene.y + 35);
    }
    loadSceneStats() {
        // loop scene and get stats
        for (var i = 0; i < this.scenes.length; i++) {
            var scene = this.scenes[i];
            var sceneCookie = getCookie("scene_" + scene.id);
            if (sceneCookie == "unlocked")
                scene.unlocked = true;
        }
    }
    unlockScene() {
        setCookie("scene_" + this.scene_chosen, "unlocked");
    }
}
//# sourceMappingURL=SceneMenuController.js.map