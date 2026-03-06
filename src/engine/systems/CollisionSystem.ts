
import * as VecMath from "../../util/VecMath"
import { Ball } from "../Ball";

export class CollisionSystem {
    
    private restitution: number

    constructor(restitution: number = 1) {
        this.restitution = restitution
    }

    public isColliding(a: Ball, b: Ball): boolean {
        return (b.getX() - a.getX()) ** 2 + (b.getY() - a.getY()) ** 2 < (a.getRadius() + b.getRadius()) ** 2
    }

    public apply(a: Ball, b: Ball) {

        const collisionVector = [b.getX() - a.getX(), b.getY() - a.getY()] as [number, number]
        const collisionNormal = VecMath.normal(collisionVector)

        // IMPORTANT TO PREVENT MOMENTUM LOSS
        const tangent: [number, number] = [
            -collisionNormal[1],
             collisionNormal[0],
        ]

        // Velocities along the normal
        const v1 = VecMath.dot(collisionNormal, [a.vx, a.vy])
        const v2 = VecMath.dot(collisionNormal, [b.vx, b.vy])

        const v1t = VecMath.dot(tangent, [a.vx, a.vy])
        const v2t = VecMath.dot(tangent, [b.vx, b.vy])

        if (v1 - v2 <= 0) {
            return
        }

        const v1final = v1 * (a.getMass() - b.getMass()) / (a.getMass() + b.getMass()) + 2 * v2 * b.getMass() / (a.getMass() + b.getMass())
        const v2final = v1 * 2 * a.getMass() / (a.getMass() + b.getMass()) + v2 * (b.getMass() - a.getMass()) / (a.getMass() + b.getMass())

        a.vx = collisionNormal[0] * v1final * this.restitution + tangent[0] * v1t
        a.vy = collisionNormal[1] * v1final * this.restitution + tangent[1] * v1t
        b.vx = collisionNormal[0] * v2final * this.restitution + tangent[0] * v2t
        b.vy = collisionNormal[1] * v2final * this.restitution + tangent[1] * v2t

        const penetration = a.getRadius() + b.getRadius() - VecMath.length(collisionVector)
        a.setX(a.getX() - collisionNormal[0] * penetration * a.getMass() / (a.getMass() + b.getMass()))
        a.setY(a.getY() - collisionNormal[1] * penetration * a.getMass() / (a.getMass() + b.getMass()))
        b.setX(b.getX() + collisionNormal[0] * penetration * b.getMass() / (a.getMass() + b.getMass()))
        b.setY(b.getY() + collisionNormal[1] * penetration * b.getMass() / (a.getMass() + b.getMass()))

    }

    public getRestitution(): number {
        return this.restitution
    }

    public setRestitution(restitution: number) {
        this.restitution = restitution
    }
}