
import { Area } from "../../util/Area";
import { Ball } from "../Ball";

class Cell extends Area {

    private balls: Array<Ball> = []

    constructor(area: Area) {
        super(area.getA(), area.getB())
    }

    public add(ball: Ball) {
        this.balls.push(ball)
    }

    public clear() {
        if (this.balls.length)
            this.balls = []
    }

    public ballCount(): number {
        return this.balls.length
    }

    public getBall(index: number): Ball | undefined {
        return this.balls[index]
    }
}

export class GridSystem extends Area {

    private static readonly DEFAULT_CELL_SIZE: number = 6

    private area: Area
    private cellSize: number
    private grid: Array<Cell> = []

    constructor(area: Area, cellSize: number = GridSystem.DEFAULT_CELL_SIZE) {
        super(area.getA(), area.getB())
        this.area = area
        this.cellSize = cellSize

        // Create grid cells
        for (let x = 0; x < this.getWidthInCells(); ++x) {
            for (let y = 0; y < this.getHeightInCells(); ++y) {
                const bl = [x * cellSize + area.getWest(), y * cellSize + area.getSouth()] as [number, number]
                const tr = [(x + 1) * cellSize + area.getWest(), (y + 1) * cellSize + area.getSouth()] as [number, number]
                const cell = new Cell(new Area(bl, tr))
                this.grid.push(cell)
            }
        }
    }

    public add(ball: Ball) {
        const cellX = Math.floor((ball.getX() - this.area.getWest()) / this.cellSize)
        const cellY = Math.floor((ball.getY() - this.area.getSouth()) / this.cellSize)

        // Add ball to all cells it intersects
        for (let x = Math.max(0, cellX - 1); x < Math.min(this.getWidthInCells(), cellX + 2); ++x) {
            for (let y = Math.max(0, cellY - 1); y < Math.min(this.getHeightInCells(), cellY + 2); ++y) {
                const cell = this.getCell(x, y)!

                if (cell.intersectsCircle(ball.getX(), ball.getY(), ball.getRadius())) {
                    cell.add(ball)
                }
            }
        }
    }

    public clear() {
        for (const cell of this.grid) {
            cell.clear()
        }
    }

    public getCell(x: number, y: number): Cell | undefined {
        return this.grid.at(x * this.getHeightInCells() + y)
    }

    public getCellContaining(x: number, y: number): Cell | undefined {
        return this.getCell(x / this.cellSize, y / this.cellSize)
    }

    public getWidthInCells(): number {
        return Math.ceil(this.getWidth() / this.cellSize)
    }

    public getHeightInCells(): number {
        return Math.ceil(this.getHeight() / this.cellSize)
    }
}