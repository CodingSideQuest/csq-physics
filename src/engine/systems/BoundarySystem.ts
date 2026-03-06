import { Area } from "../../util/Area";
import { Ball } from "../Ball";

export class BoundarySystem extends Area {

    private restitution: number

    constructor(area: Area, restitution: number = 1) {
        super(area.getA(), area.getB())
        this.restitution = restitution
    }

    public apply(ball: Ball) {
        const x = ball.getX()
        const y = ball.getY()
        const radius = ball.getRadius()

        if (x - radius <= this.getWest()) {
            ball.setX(this.getWest() + radius)
            ball.vx = Math.abs(ball.vx) * this.restitution
        }

        if (x + radius >= this.getEast()) {
            ball.setX(this.getEast() - radius)
            ball.vx = -Math.abs(ball.vx) * this.restitution
        }

        if (y - radius <= this.getSouth()) {
            ball.setY(this.getSouth() + radius)
            ball.vy = Math.abs(ball.vy) * this.restitution
        }

        if (y + radius >= this.getNorth()) {
            ball.setY(this.getNorth() - radius)
            ball.vy = -Math.abs(ball.vy) * this.restitution
        }
    }

    public getRestitution(): number {
        return this.restitution
    }

    public setRestitution(restitution: number) {
        this.restitution = restitution
    }
}