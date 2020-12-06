import { GameEngine } from '../engine/GameEngine';
import { Game } from '../game/Game';

import { TempColliderRect } from '../gameObjectLibrary/TempCollider';
import { ICollidableCircle } from '../interfaces/ICollidable';
import { IColliderRectList } from '../interfaces/IColliderList';
import { CollisionUtils } from '../utils/CollisionUtils1';


export class MeetingRoom {

    game: Game;

    colliders: IColliderRectList;

    constructor(game: Game) {

        this.game = game;

        this.colliders = {};

        this.colliders['colliderUp'] = new TempColliderRect(0, 0, GameEngine.CANVAS_WIDTH, 80);
        this.colliders['colliderRight'] = new TempColliderRect(GameEngine.CANVAS_WIDTH - 80, 0, 80, GameEngine.CANVAS_HEIGHT);
        this.colliders['colliderDown'] = new TempColliderRect(0, GameEngine.CANVAS_HEIGHT - 100, GameEngine.CANVAS_WIDTH, 100);
        this.colliders['colliderLeft'] = new TempColliderRect(0, 0, 80, GameEngine.CANVAS_HEIGHT);

        this.colliders['doorCollider'] = new TempColliderRect(GameEngine.CANVAS_WIDTH - 80, 160, 20, 105);

        this.colliders['caseCollider'] = new TempColliderRect(GameEngine.CANVAS_WIDTH - 105, 300, 50, 210);

    }

    public checkCollisionsCyrcle(cyrcle: ICollidableCircle) {

        for(var id in this.colliders){
            if (CollisionUtils.colCheckCircleRectCollider(cyrcle, this.colliders[id])) return true;
        }

        return false;

    }

    public update(timeDiff: number) {

    }

}