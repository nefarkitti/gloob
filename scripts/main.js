const petui = document.getElementById("petui")

let pet

function clamp(val, min, max) {

    if (val < min) {
        val = min
    }
    if (val > max) {
        val = max
    }

    return val

}

function updatePetDisplay() {

    let hunger = document.getElementById("pethunger")
    let thirst = document.getElementById("petthirst")
    let dirt = document.getElementById("petdirt")

    pet.hunger = clamp(pet.hunger, -10, 100)
    pet.thirst = clamp(pet.thirst, 0, 100)
    pet.dirt = clamp(pet.dirt, 0 , 100)

    hunger.style.width = `${pet.hunger}%`
    thirst.style.width = `${pet.thirst}%`
    dirt.style.width = `${pet.dirt}%`

}

function tick() {

    console.log("tick")

    data.last = Date.now()

    pet.age += 1
    pet.hunger -= 0.5
    pet.thirst -= 1
    pet.dirt += 1

    updatePetDisplay()

    if (pet.hunger <= -10) {
        pet.state = "dead"
    }
    if (pet.thirst <= 0) {
        pet.state = "dead"
    }

    save()

    if (pet.state != "dead") {
        setTimeout(() => {
            tick()
        }, 1000);
    } else {

        pet.killed = Date.now()
        popup("gloob", `
            <p>${pet.name} has died.</p>
            <div class="buttons">
            <button onclick="reset()">Accept</button><button onclick="reset()">Mourn</button>
            </div>
            `
            , null, "<img src='assets/tombstone.gif'>")

    }

}

function startgame() {

    console.log(data)

    petui.style.display = ""

    pet = data.pet

    document.getElementById("petname").innerText = pet.name

    let since = Math.round((Date.now() - data.last) / 1000)

    if (since >= 2 && pet.state != "dead") {

        console.log(`you've been gone for ${since} seconds`)

        pet.hunger -= Math.ceil(since / 2)

        let err = popup("gloob", `You've been gone for ${since} seconds!`)
        setTimeout(() => {
            err.remove()
        }, 1000);

    }

    updatePetDisplay()

    tick()

}