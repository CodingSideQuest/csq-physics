
export class Ball {

    public static readonly DEFAULT_RADIUS: number = 5
    public static readonly DEFAULT_COLOR: [number, number, number] = [1, 1, 1]
    
    private store: BallStore
    public index: number

    public vx: number = 0
    public vy: number = 0

    constructor(store: BallStore, index: number) {
        this.store = store
        this.index = index
    }

    public updatePosition() {
        this.setX(this.getX() + this.vx)
        this.setY(this.getY() + this.vy)
    }

    public getMass(): number {
        return Math.PI * this.getRadius() ** 2
        // return this.getRadius() / 10
    }

    public getIndex(): number {
        return this.index
    }

    public setX(v: number) {
        this.store.write(this.index, BallStore.X_INDEX_OFFSET, v)
    }

    public setY(v: number) {
        this.store.write(this.index, BallStore.Y_INDEX_OFFSET, v)
    }

    public setRadius(v: number) {
        this.store.write(this.index, BallStore.RADIUS_INDEX_OFFSET, v)
    }

    public setR(v: number) {
        this.store.write(this.index, BallStore.R_INDEX_OFFSET, v)
    }

    public setG(v: number) {
        this.store.write(this.index, BallStore.G_INDEX_OFFSET, v)
    }

    public setB(v: number) {
        this.store.write(this.index, BallStore.B_INDEX_OFFSET, v)
    }

    public getX(): number {
        return this.store.read(this.index, BallStore.X_INDEX_OFFSET)
    }

    public getY(): number {
        return this.store.read(this.index, BallStore.Y_INDEX_OFFSET)
    }

    public getRadius(): number {
        return this.store.read(this.index, BallStore.RADIUS_INDEX_OFFSET)
    }

    public getR(): number {
        return this.store.read(this.index, BallStore.R_INDEX_OFFSET)
    }

    public getG(): number {
        return this.store.read(this.index, BallStore.G_INDEX_OFFSET)
    }

    public getB(): number {
        return this.store.read(this.index, BallStore.B_INDEX_OFFSET)
    }
}

export class BallStore {

    public static readonly BALL_INDEX_SIZE: number = 6
    public static readonly X_INDEX_OFFSET: number = 0
    public static readonly Y_INDEX_OFFSET: number = 1 
    public static readonly RADIUS_INDEX_OFFSET: number = 2
    public static readonly R_INDEX_OFFSET: number = 3
    public static readonly G_INDEX_OFFSET: number = 4 
    public static readonly B_INDEX_OFFSET: number = 5

    private rawData: Float32Array = new Float32Array()
    private balls: Array<Ball> = []

    constructor () {}

    public getRawData(): Float32Array<ArrayBuffer> {
        return this.rawData as Float32Array<ArrayBuffer>
    }

    public capacity(): number {
        return this.rawData.length / BallStore.BALL_INDEX_SIZE
    }

    public length(): number {
        return this.balls.length
    }

    public resizeCapacity(capacity: number) {
        let newRawData = new Float32Array(capacity * BallStore.BALL_INDEX_SIZE)

        if (capacity > this.capacity()) {
            newRawData.set(this.rawData, 0)
        } else {
            newRawData.set(this.rawData.subarray(0, newRawData.length))
        }
        this.rawData = newRawData
    }

    public resizeLength(length: number) {
        this.resizeCapacity(2 ** Math.ceil(Math.log2(length) || 0))
    }

    public reserve(length: number) {
        if (this.length() + length > this.capacity()) {
            this.resizeLength(this.length() + length)
        }
    }

    public createBall({x, y, radius, color, vx, vy}: {x: number, y: number, radius?: number, color?: [number, number, number], vx?: number, vy?: number}): Ball {
        this.reserve(1)

        const [r, g, b] = color || Ball.DEFAULT_COLOR

        this.write(this.length(), BallStore.X_INDEX_OFFSET, x)
        this.write(this.length(), BallStore.Y_INDEX_OFFSET, y)
        this.write(this.length(), BallStore.RADIUS_INDEX_OFFSET, radius || Ball.DEFAULT_RADIUS)
        this.write(this.length(), BallStore.R_INDEX_OFFSET, r)
        this.write(this.length(), BallStore.G_INDEX_OFFSET, g)
        this.write(this.length(), BallStore.B_INDEX_OFFSET, b)

        const ball = new Ball(this, this.length())
        ball.vx = vx || 0
        ball.vy = vy || 0

        this.balls.push(ball)
        return ball
    }

    public removeBall(ball: Ball | number) {
        const index = typeof ball === "number" ? ball : ball.index

        // If the ball is not the last ball, swap remove with the last one
        if (index !== this.length() - 1) {
            // Copy memory from last index to swap index
            this.rawData.set(this.rawData.subarray((this.length() - 1) * BallStore.BALL_INDEX_SIZE, this.length() * BallStore.BALL_INDEX_SIZE), index * BallStore.BALL_INDEX_SIZE)

            // Correct ball pointers
            this.balls[index] = this.balls.pop()!
            this.balls[index].index = index
        } else {
            this.balls.pop()
        }

        // Check if we need to size down
        const minCapacity = 2 ** Math.ceil(Math.log2(this.length()) || 0)
        if (minCapacity !== this.capacity()) {
            this.resizeLength(this.length())
        }
    }

    public getBall(index: number): Ball | undefined {
        return this.balls.at(index)
    }

    public write(index: number, offset: number, value: number) {
        this.rawData[index * BallStore.BALL_INDEX_SIZE + offset] = value
    }

    public read(index: number, offset: number): number {
        return this.rawData[index * BallStore.BALL_INDEX_SIZE + offset]
    }
}