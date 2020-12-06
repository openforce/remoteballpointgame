import { ICollidableCircle, ICollidableRect } from '../interfaces/ICollidable';
import { GeometryUtils } from './GeometryUtils1';

export class CollisionUtils {

    /***************************************
    # Calculates collisions between 
    # a point and a cirle
    ***************************************/
    public static colCheckCirlcePoint(pX: number, pY: number, cX: number, cY: number, cR: number): boolean {
        var a = pX - cX;
        var b = pY - cY;

        var c = Math.sqrt(a * a + b * b);

        if (c < cR) return true;
        else return false;
    }

    /***************************************
    # Calculates collisions between circles
    ***************************************/
    public static colCheckCirlces(aX: number, aY: number, aR: number, cX: number, cY: number, cR: number): boolean {
        var a = Math.abs(aX - cX);
        var b = Math.abs(aY - cY);
        var dist = Math.sqrt((a * a) + (b * b));

        return dist < aR + cR;
    }

    public static colCheckCircleColliders(circleA: ICollidableCircle, circleB: ICollidableCircle) {
        return CollisionUtils.colCheckCirlces(circleA.x, circleA.y, circleA.radius, circleB.x, circleB.y, circleB.radius);
    }

    /***************************************
    # Calculates collisions 
    # between a circle and a rect
    ***************************************/
    public static colCheckCircleRect(cX: number, cY: number, cR: number, rX: number, rY: number, rW: number, rH: number) {
        var distX = Math.abs(cX - rX - rW / 2);
        var distY = Math.abs(cY - rY - rH / 2);

        if (distX > (rW / 2 + cR)) { return false; }
        if (distY > (rH / 2 + cR)) { return false; }

        if (distX <= (rW / 2)) { return true; }
        if (distY <= (rH / 2)) { return true; }

        var dx = distX - rW / 2;
        var dy = distY - rH / 2;
        return (dx * dx + dy * dy <= (cR * cR));
    }

    public static colCheckCircleRectCollider(circle: ICollidableCircle, rect: ICollidableRect) {
        return CollisionUtils.colCheckCircleRect(circle.x, circle.y, circle.radius, rect.x, rect.y, rect.width, rect.height);
    }

    public static colCheckCircleRectRotation(circle:ICollidableCircle, rect: ICollidableRect) {
        
        var cx, cy;
        var angleOfRad = GeometryUtils.degreeToRad(0); //rotation of rect
        var rectCenterX = rect.x + rect.width / 2;
        var rectCenterY = rect.y + rect.height / 2;

        var rotateCircleX = Math.cos(angleOfRad) * (circle.x - rectCenterX) - Math.sin(angleOfRad) * (circle.y - rectCenterY) + rectCenterX;
        var rotateCircleY = Math.sin(angleOfRad) * (circle.x - rectCenterX) + Math.cos(angleOfRad) * (circle.y - rectCenterY) + rectCenterY;


        if (rotateCircleX < rect.x) {
            cx = rect.x;
        } else if (rotateCircleX > rect.x + rect.width) {
            cx = rect.x + rect.width;
        } else {
            cx = rotateCircleX;
        }

        if (rotateCircleY < rect.y) {
            cy = rect.y;
        } else if (rotateCircleY > rect.y + rect.height) {
            cy = rect.y + rect.height;
        } else {
            cy = rotateCircleY;
        }
       
        if (GeometryUtils.getDistance(rotateCircleX, rotateCircleY, cx, cy) < circle.radius) {
            return true;
        }

        return false;

    }

    /***************************************
    # Calculates collisions between rect objects
    ***************************************/
    public static colCheck(shapeA: ICollidableRect, shapeB: ICollidableRect): string {
        // get the vectors to check against
        var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
            vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
            // add the half widths and half heights of the objects
            hWidths = (shapeA.width / 2) + (shapeB.width / 2),
            hHeights = (shapeA.height / 2) + (shapeB.height / 2),
            colDir = null;

        // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
            // figures out on which side we are colliding (top, bottom, left, or right)
            var oX = hWidths - Math.abs(vX),
                oY = hHeights - Math.abs(vY);
            if (oX >= oY) {
                if (vY > 0) {
                    colDir = "t";
                    //shapeA.y += oY;
                } else {
                    colDir = "b";
                    //shapeA.y -= oY;
                }
            } else {
                if (vX > 0) {
                    colDir = "l";
                    //shapeA.x += oX;
                } else {
                    colDir = "r";
                    //shapeA.x -= oX;
                }
            }
        }
        return colDir;
    }

    /***************************************
    # Calculates collisions between objects
    # but do not let them overlap
    ***************************************/
    public static colCheckWithShapeReset(shapeA: ICollidableRect, shapeB: ICollidableRect): string {
        // get the vectors to check against
        var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
            vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
            // add the half widths and half heights of the objects
            hWidths = (shapeA.width / 2) + (shapeB.width / 2),
            hHeights = (shapeA.height / 2) + (shapeB.height / 2),
            colDir = null;

        // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
            // figures out on which side we are colliding (top, bottom, left, or right)
            var oX = hWidths - Math.abs(vX),
                oY = hHeights - Math.abs(vY);
            if (oX >= oY) {
                if (vY > 0) {
                    colDir = "t";
                    shapeA.y += oY;
                } else {
                    colDir = "b";
                    shapeA.y -= oY;
                }
            } else {
                if (vX > 0) {
                    colDir = "l";
                    shapeA.x += oX;
                } else {
                    colDir = "r";
                    shapeA.x -= oX;
                }
            }
        }
        return colDir;
    }

    /***************************************
    # Calculates collisions between 2 lines
    # returns the point of collision
    ***************************************/
    public static checkLineCollision(p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number) {

        var d1x = p1x - p0x,
            d1y = p1y - p0y,
            d2x = p3x - p2x,
            d2y = p3y - p2y,

            // determinator
            d = d1x * d2y - d2x * d1y,
            px, py, s, t;

        // continue if intersecting/is not parallel
        if (d) {

            px = p0x - p2x;
            py = p0y - p2y;

            s = (d1x * py - d1y * px) / d;
            if (s >= 0 && s <= 1) {

                // if s was in range, calc t
                t = (d2x * py - d2y * px) / d;
                if (t >= 0 && t <= 1) {
                    return {
                        x: p0x + (t * d1x),
                        y: p0y + (t * d1y)
                    }
                }
            }
        }

        return null
    }

}



