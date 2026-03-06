
import { BallStore } from "./Ball"
import { Area } from "../util/Area"

import { Renderer } from "./graphics/Renderer"
import { BoundarySystem } from "./systems/BoundarySystem"
import { GravitySystem } from "./systems/GravitySystem"
import { CollisionSystem } from "./systems/CollisionSystem"
import { PerformanceSystem } from "./systems/PerformanceSystem"
import { GridSystem } from "./systems/GridSystem"

let screenArea = new Area([-innerWidth / 2, -innerHeight / 2], [innerWidth / 2, innerHeight / 2])
const maxBalls = 1000
const ballRadiusRange = [5, 10]

export class Engine {

    private renderer: Renderer
    private ballStore: BallStore = new BallStore()

    private grid: GridSystem = new GridSystem(screenArea, ballRadiusRange[1] * 2)
    private boundary: BoundarySystem = new BoundarySystem(screenArea, 0.98)
    private gravity: GravitySystem = new GravitySystem(0.025)
    private collision: CollisionSystem = new CollisionSystem(0.98)
    private performance: PerformanceSystem = new PerformanceSystem()
    
    private tick: number = 0

    constructor (canvas: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas, this.ballStore)
    }

    public async begin() {
        await this.renderer.init()

        /*
        // A
        this.ballStore.createBall({
            x: -100,
            y: 0,
            vx: 1,
            vy: 0,
            radius: 20,
            color: [1, 0, 0],
        })

        // B
        this.ballStore.createBall({
            x: 100,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 10,
            color: [0, 1, 0],
        })*/
    }

    public update(steps: number = 1) {

        for (let i = 0; i < steps; ++i) {

            if (this.ballCount() < maxBalls) {
                this.ballStore.createBall({
                    x: (Math.random() - 0.5) * innerWidth,
                    y: (Math.random() - 0.5) * innerHeight,
                    vx: Math.random() * 2 - 1,
                    vy: Math.random() * 2 - 1,
                    radius: Math.random() * (ballRadiusRange[1] - ballRadiusRange[0]) + ballRadiusRange[0],
                    color: randomColor(),
                })
            }

            let simTime = performance.now()

            // Apply O(n) operations, then add to grid
            for (let i = 0; i < this.ballStore.length(); ++i) {
                const a = this.ballStore.getBall(i)!
                this.gravity.apply(a)
                this.boundary.apply(a)
                this.grid.add(a)
            }

            // Go through grid and do O(n^2) operations (just collisions)
            for (let x = 0; x < this.grid.getWidthInCells(); ++x) {
                for (let y = 0; y < this.grid.getHeightInCells(); ++y) {
                    const cell = this.grid.getCell(x, y)!

                    for (let i = 0; i < cell.ballCount(); ++i) {
                        const a = cell.getBall(i)!

                        for (let j = i + 1; j < cell.ballCount(); ++j) {
                            const b = cell.getBall(j)!

                            if (this.collision.isColliding(a, b)) {
                                this.collision.apply(a, b)
                            }
                        }
                    }
                }
            }

            // Go through balls again, update their positions
            for (let i = 0; i < this.ballStore.length(); ++i) {
                const a = this.ballStore.getBall(i)!
                a.updatePosition()
            }

            this.grid.clear()

            simTime = performance.now() - simTime

            this.performance.sample({
                render: 0,
                simulation: simTime,
                ballCount: this.ballCount(),
            })

            this.tick += 1
        }
    }

    public render() {
        this.renderer.render()
    }

    public getTick(): number {
        return this.tick
    }

    public ballCount(): number {
        return this.ballStore.length()
    }

    public accessBoundarySystem(): BoundarySystem {
        return this.boundary
    }

    public accessGravitySystem(): GravitySystem {
        return this.gravity
    }

    public accessCollisionSystem(): CollisionSystem {
        return this.collision
    }

    public accessPerformanceSystem(): PerformanceSystem {
        return this.performance
    }
}

function randomColor(): [number, number, number] {
    return [
        Math.random(),
        Math.random(),
        Math.random(),
    ]
}