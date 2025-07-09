
function popup(title = "New Window", content = "No Content", width = 300, img = "", window = false) {

    const overlay = document.createElement("div")

    if (window) {
        overlay.classList.add("window")
        overlay.style.width = `${width}px`
        overlay.style.maxWidth = `${width}px`
        overlay.innerHTML = `<div class="title-bar">
                <div class="title-bar-text">${title}</div>
            </div>
            <div class="window-body">
                <div class="window-icon">
                ${img}
                </div>
                <div class="window-content">
                    ${content}
                </div>
            </div>`
    } else {
        overlay.classList.add("overlay")
        overlay.innerHTML = `
    <div class="window" style="width: ${width}px;max-width: ${width}px">
            <div class="title-bar">
                <div class="title-bar-text">${title}</div>
            </div>
            <div class="window-body">
                <div class="window-icon">
                ${img}
                </div>
                <div class="window-content">
                    ${content}
                </div>
            </div>
        </div>
    `

        document.body.appendChild(overlay);
    }

    return overlay

}