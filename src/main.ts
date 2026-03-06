
import "./css/styles.css"
import "./css/performance.css"
import "./css/properties.css"

import { Engine } from "./engine/Engine"

const canvas = document.querySelector(".viewport") as HTMLCanvasElement
export const engine = new Engine(canvas)
engine.accessGravitySystem().setStrength(1e-5)

function frame() {
    engine.update(1)
    engine.render()
    requestAnimationFrame(frame)
}

async function main() {
    await engine.begin()
    requestAnimationFrame(frame)
}

main()