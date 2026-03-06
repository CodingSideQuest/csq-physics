
import { engine } from "../main"

const fpsTick = document.querySelector(".fps .tick") as HTMLImageElement
const fpsNumber = document.querySelector(".fps-number")!
const ballCountNumber = document.querySelector(".breakdown-wrapper .ball-count .value")!
const simulationNumber = document.querySelector(".breakdown-wrapper .simulation .value")!
const renderNumber = document.querySelector(".breakdown-wrapper .render .value")!
const totalNumber = document.querySelector(".breakdown-wrapper .total .value")!


setInterval(() => {
    const performance = engine.accessPerformanceSystem()
    const ballCount = performance.getLatest("ballCount")
    const simulation = performance.getAverage("simulation", 6)
    const render = performance.getAverage("render", 6)
    const total = performance.getAverage("total", 6)

    ballCountNumber.textContent = `${ballCount}`
    simulationNumber.textContent = `${simulation.toFixed(1)}`
    renderNumber.textContent = `${render.toFixed(1)}`
    totalNumber.textContent = `${total.toFixed(1)}`

    const fps = Math.min(1000, 1000 / total)
    fpsNumber.textContent = `${fps.toFixed(0)}`

    const rotation = 270 * Math.min(1, fps / 60) - 125
    fpsTick.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`
}, 100)