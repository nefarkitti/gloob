const petui = document.getElementById("petui")

let hunger = document.getElementById("pethunger")
let thirst = document.getElementById("petthirst")
let dirt = document.getElementById("petdirt")
let race = document.getElementById("petrace")
let age = document.getElementById("petage")
let health = document.getElementById("pethealth")
let tiredness = document.getElementById("pettiredness")
let happiness = document.getElementById("pethappiness")

let statuslist = document.getElementById("statuslist")
let diseaselist = document.getElementById("diseaselist")

const tab = document.getElementById("title")

let pet
let debugmult = 1

const decay = {

    "hunger": -0.5,
    "thirst": -1,
    "dirt": 1,
    "tiredness": 1,
    "happiness": -0.5

}

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

    pet.hunger = clamp(pet.hunger, -10, 100)
    pet.thirst = clamp(pet.thirst, 0, 100)
    pet.dirt = clamp(pet.dirt, 0, 100)
    pet.tiredness = clamp(pet.tiredness, 0, 110)
    pet.happiness = clamp(pet.happiness, -10, 100)
    pet.health = clamp(pet.health, 0, 100)

    health.style.width = `${pet.health}%`
    hunger.style.width = `${pet.hunger}%`
    thirst.style.width = `${pet.thirst}%`
    dirt.style.width = `${pet.dirt}%`
    tiredness.style.width = `${pet.tiredness}%`
    happiness.style.width = `${pet.happiness}%`
    race.innerText = variants[pet.variant].name.toUpperCase()

    let t = convertSeconds(pet.age)
    age.innerText = `${t.d}d ${t.h}h ${t.m}m ${t.s}s`

}

let diseaseTick = 0
function tick() {

    diseaseTick++

    tab.innerText = pet.name

    let diseaseMults = {
        "health": 1,
        "hunger": 1,
        "thirst": 1,
        "dirt": 1,
        "tiredness": 1,
        "happiness": 1
    }

    statuslist.innerHTML = ``
    diseaselist.innerHTML = ``

    let variant = variants[pet.variant]

    data.last = Date.now()

    pet.diseases.forEach(disease => {
        diseaselist.innerHTML += `<span>${disease.toUpperCase()}</span>`
        setDiseaseMult(disease, diseaseMults)
    });

    pet.age += 1

    pet.hunger += decay.hunger * (variant.hungermult * diseaseMults.hunger)
    pet.thirst += decay.thirst * (variant.thirstmult * diseaseMults.thirst)
    pet.dirt += decay.dirt * (variant.dirtmult * diseaseMults.dirt)
    pet.tiredness += decay.tiredness * (variant.tiredmult * diseaseMults.tiredness)
    pet.happiness += decay.happiness * (variant.happymult * diseaseMults.happiness)

    let healthProfit = 1

    if (pet.hunger <= 50) {
        healthProfit -= 1
        statuslist.innerHTML += `<span>STARVING</span>`
        tab.innerText = ["Starving", tab.innerText].join(' ');
    }
    if (pet.thirst <= 60) {
        healthProfit -= 1
        statuslist.innerHTML += `<span>PARCHED</span>`
        tab.innerText = ["Parched", tab.innerText].join(' ');
    }
    if (pet.dirt >= 30) {
        healthProfit -= 1
        statuslist.innerHTML += `<span>DIRTY</span>`
        tab.innerText = ["Dirty", tab.innerText].join(' ');
    }
    if (pet.dirt >= 60) {
        healthProfit -= 1
    }
    if (pet.tiredness >= 30) {
        healthProfit -= 1
    }
    if (pet.tiredness >= 50) {
        statuslist.innerHTML += `<span>SLEEPY</span>`
        tab.innerText = ["Sleepy", tab.innerText].join(' ');
    }
    if (pet.tiredness >= 60) {
        healthProfit -= 1
    }
    if (pet.tiredness >= 100) {
        healthProfit -= 2
    }
    if (pet.happiness <= 50) {
        statuslist.innerHTML += `<span>SAD</span>`
        tab.innerText = ["Sad", tab.innerText].join(' ');
    } else if (pet.happiness <= 25) {
        statuslist.innerHTML += `<span>DEPRESSED</span>`
        tab.innerText = ["Depressed", tab.innerText].join(' ');
    } else if (pet.happiness <= 10) {
        statuslist.innerHTML += `<span>MISERABLE</span>`
        tab.innerText = ["Miserable", tab.innerText].join(' ');
    }

    pet.health += healthProfit

    if (diseaseTick >= 20) {
        diseaseTick = 0
        if (getRandomInt(100) <= ((100 - pet.health) / 2)) {
            addDisease(DISEASE_LIST[getRandomInt(DISEASE_LIST.length - 1)], pet.diseases)
        }
    }

    updatePetDisplay()

    if (pet.hunger <= -10) {
        pet.state = "dead"
    }
    if (pet.thirst <= 0) {
        pet.state = "dead"
    }
    if (pet.tiredness >= 110) {
        pet.state = "dead"
    }
    if (pet.happiness <= -10) {
        pet.state = "dead"
    }

    save()

    if (pet.state != "dead") {
        setTimeout(() => {
            tick()
        }, 1000);
    } else {

        statuslist.innerHTML = `<span>DEAD</span>`
        tab.innerText = `Dead ${pet.name}`
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

    tab.innerText = pet.name

    document.getElementById("petname").innerText = pet.name

    let since = Math.round((Date.now() - data.last) / 1000)

    if (since >= 3 && pet.state != "dead") {

        console.log(`you've been gone for ${since} seconds`)

        pet.age += since

        pet.hunger += decay.hunger * variant.hungermult
        pet.thirst += decay.thirst * variant.thirstmult
        pet.dirt += decay.dirt * variant.dirtmult
        pet.tiredness += decay.tiredness * variant.tiredmult
        pet.happiness += decay.happiness * variant.happymult

        let err = popup("gloob", `You've been gone for ${since} seconds!`)
        setTimeout(() => {
            err.remove()
        }, 1000);

    }

    updatePetDisplay()

    tick()

}