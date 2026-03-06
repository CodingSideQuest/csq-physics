
type Sample = {
    render: number,
    simulation: number,
    ballCount: number,
}

export class PerformanceSystem {

    private static readonly TRACK_LENGTH: number = 600 // 10 seconds of frames

    private tracker: Array<Sample & { total: number }> = new Array(PerformanceSystem.TRACK_LENGTH)
    private index: number = 0

    constructor() {}

    public sample(sample: Sample) {
        this.tracker[this.index] = {
            total: sample.simulation + sample.render,
            ...sample
        }

        this.index = (this.index + 1) % PerformanceSystem.TRACK_LENGTH
    }

    public getLatest<T extends keyof Sample>(stat: T | "total"): number {
        const item = this.tracker.at(this.index - 1)
        return item ? item[stat] : 0
    }

    public getAverage<T extends (keyof Sample | "total")>(stat: T, span: number = PerformanceSystem.TRACK_LENGTH): number {
        let average = 0
        let count = 0

        for (let i = 0; i < span; ++i) {
            const item = this.tracker.at(this.index - i - 1)
            if (!item) continue

            average += item[stat]
            count++
        }
        
        return average
    }
}