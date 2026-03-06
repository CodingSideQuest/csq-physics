
export class Area {

    private a: [number, number]
    private b: [number, number]

    constructor(a: [number, number], b: [number, number]) {
        this.a = [Math.min(a[0], b[0]), Math.min(a[1], b[1])]
        this.b = [Math.max(a[0], b[0]), Math.max(a[1], b[1])]
    }

    public containsX(x: number): boolean {
        return x >= this.getWest() && x < this.getEast()
    }

    public containsY(y: number): boolean {
        return y >= this.getSouth() && y < this.getNorth()
    }

    public containsPoint(x: number, y: number): boolean {
        return this.containsX(x) && this.containsY(y)
    }

    public intersectsCircle(x: number, y: number, r: number): boolean {
        
        if (this.containsPoint(x, y)) return true
        if (this.containsX(x) && (this.containsY(y + r) || this.containsY(y - r))) return true
        if (this.containsY(y) && (this.containsX(x + r) || this.containsX(x - r))) return true
        
        // Use square distances for slight performance improvement
        // Check if the circle contains a corner
        const r2 = r ** 2
        if ((x - this.getWest()) ** 2 + (y - this.getSouth()) ** 2 < r2) return true
        if ((x - this.getWest()) ** 2 + (y - this.getNorth()) ** 2 < r2) return true
        if ((x - this.getEast()) ** 2 + (y - this.getSouth()) ** 2 < r2) return true
        if ((x - this.getEast()) ** 2 + (y - this.getNorth()) ** 2 < r2) return true

        return false
    }

    public getWidth(): number {
        return this.getEast() - this.getWest()
    }

    public getHeight(): number {
        return this.getNorth() - this.getSouth()
    }

    public getWest(): number {
        return this.a[0]
    }

    public getEast(): number {
        return this.b[0]
    }

    public getSouth(): number {
        return this.a[1]
    }

    public getNorth(): number {
        return this.b[1]
    }

    public setA(a: [number, number]) {
        this.a = a
    }

    public setB(b: [number, number]) {
        this.b = b
    }

    public getA(): [number, number] {
        return this.a
    }

    public getB(): [number, number] {
        return this.b
    }
}