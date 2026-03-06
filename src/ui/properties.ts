
import { engine } from "../main"

// Gravity Settings

// Direction Interface
const directionNumber = document.querySelector(".direction-number") as HTMLSpanElement
const directionPointer = document.querySelector(".direction-interface .pointer") as HTMLButtonElement
const directionCircle = document.querySelector(".direction-interface .outer-circle") as HTMLDivElement
const autoRotate = directionCircle.querySelector(".toggle") as HTMLButtonElement

setInterval(() => {
    const t = engine.accessGravitySystem().getDirection()
    directionNumber.textContent = `${(t * 180 / Math.PI).toFixed(0)} deg`
    directionPointer.style.left = `${(Math.cos(t) + 1) * 50}%`
    directionPointer.style.bottom = `${(Math.sin(t) + 1) * 50}%`
}, 20)

autoRotate.addEventListener("click", () => {
    autoRotate.classList.toggle("active")
    engine.accessGravitySystem().toggleAutoRotate()
})

let movingDirection = false
let center = { x: 0, y: 0 }

directionPointer.addEventListener("mousedown", () => {
    movingDirection = true

    const { x, y } = directionCircle.getBoundingClientRect()
    center = { x: x + 108.5 / 2, y: innerHeight - y - 108.5 / 2 }
})

window.addEventListener("mousemove", e => {
    if (!movingDirection) return;

    const mx = e.clientX
    const my = innerHeight - e.clientY
    
    let theta = Math.atan2(my - center.y, mx - center.x)
    theta = theta < 0 ? 2 * Math.PI + theta : theta

    theta = theta * 180 / Math.PI // Convert to degrees for next few operations
    theta = Math.round(theta); // Round to nearest degree
    [0, 45, 90, 135, 180, 225, 270, 315].forEach(snap => theta = Math.abs(snap - theta) <= 5 ? snap : theta) // Snap to nearby clean values
    theta = theta * Math.PI / 180 // Convert back to radians

    engine.accessGravitySystem().setDirection(theta)
})

window.addEventListener("mouseup", () => {
    movingDirection = false
})

// Strength Interface
const strengthNumber = document.querySelector(".strength-number") as HTMLSpanElement
strengthNumber.textContent = "1.00e-5"
const strengthBtns = document.querySelectorAll(".strength-interface button")
strengthBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        
        let n = parseInt([...btn.classList.values()].find(className => !Number.isNaN(parseInt(className)))!)
        btn.classList.add("active")
        
        for (let i = 0; i < strengthBtns.length; ++i) {
            if (i + 1 <= n) strengthBtns[i].classList.add("active")
            else strengthBtns[i].classList.remove("active")
        }

        let strength = n ** 3 * 10 ** -5
        let exp = Math.floor(Math.log10(strength))
        strengthNumber.textContent = `${(strength / (10 ** exp)).toFixed(2)}e${exp}`
        engine.accessGravitySystem().setStrength(strength)
    })
})
