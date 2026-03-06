
import "./performance"
import "./properties"

let infoContainer = document.querySelector(".info-container")!
let activeInfoBtn: HTMLButtonElement | null = null
let infoBtns = document.querySelectorAll(".info-btn") as NodeListOf<HTMLButtonElement>
infoBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            activeInfoBtn = null
        } else {
            toggleInfo(activeInfoBtn)
            activeInfoBtn = btn
        }

        toggleInfo(btn)
    })
})

function toggleInfo(btn: HTMLButtonElement | null) {
    if (!btn) return
    const name = btn.querySelector("img")!.className
    btn.classList.toggle("active")
    infoContainer.querySelector(`.${name}`)?.classList.toggle("active")
}




