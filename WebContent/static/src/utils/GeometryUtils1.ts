export class GeometryUtils {

    public static getAngleBetweenToPoints(shootTargetX: number, shootTargetY: number, playerPosX: number, playerPosY: number) {
        var dx = shootTargetX - playerPosX;
        // Minus to correct for coord re-mapping
        var dy = (shootTargetY - playerPosY) * -1;

        var inRads = Math.atan2(dy, dx);

        // We need to map to coord system when 0 degree is at 3 O'clock, 270 at 12 O'clock
        if (inRads < 0)
            inRads = inRads + 2 * Math.PI;
        //inRads = Math.abs(inRads);
        //else
        //inRads = inRads + 2*Math.PI;
        //inRads = 2*Math.PI - inRads;

        //if (inRads < 0) inRads -= 2 * Math.PI;

        return this.radToDegree(inRads);
    }

    public static radToDegree(radValue: number) {
        var pi = Math.PI;
        var ra_de = radValue * (180 / pi);
        return ra_de;
    }
    public static degreeToRad(degreeValue: number) {
        var pi = Math.PI;
        var de_ra = degreeValue * (pi / 180);
        return de_ra;
    }

    public static getDistance(fromX: number, fromY: number, toX: number, toY: number) {
        var a = Math.abs(fromX - toX);
        var b = Math.abs(fromY - toY);

        return Math.sqrt((a * a) + (b * b));
    }

}



