import { Ball } from "../Ball"

export class GravitySystem {

    public static readonly STRENGTH_EARTH: number = 9.80665

    private strength: number
    private direction: number = 3 * Math.PI / 2
    private autoRotate: boolean = false

    constructor(strength: number) {
        this.strength = strength

        setInterval(() => {
            if (this.autoRotate) {
                this.direction += Math.PI / 180
            }
        }, 100)
    }

    public apply(ball: Ball) {
        ball.vx += this.strength * Math.cos(this.direction)
        ball.vy += this.strength * Math.sin(this.direction)
    }

    public setStrength(strength: number) {
        this.strength = strength
    }

    public setDirection(direction: number) {
        this.direction = direction
    }

    public getStrength(): number {
        return this.strength
    }

    public getDirection(): number {
        return this.direction
    }

    public getAutoRotate(): boolean {
        return this.autoRotate
    }

    public setAutoRotate(autoRotate: boolean) {
        this.autoRotate = autoRotate
    }

    public toggleAutoRotate() {
        this.autoRotate = !this.autoRotate
    }
}