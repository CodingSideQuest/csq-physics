
export function length(v: [number, number]): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1])
}

export function squareLength(v: [number, number]): number {
    return v[0] * v[0] + v[1] * v[1]
}

export function dot(a: [number, number], b: [number, number]): number {
    return a[0] * b[0] + a[1] * b[1]
}

export function normalize(v: [number, number]) {
    const mag = length(v) || 1
    v[0] /= mag
    v[1] /= mag
}

export function normal(v: [number, number]): [number, number] {
    const mag = length(v) || 1
    return [v[0] / mag, v[1] / mag]
}

