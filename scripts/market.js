let sleeppopup

function convertValueIntoTriangles(val) {

    let finalString = ""

    let tri = "▲"
    if (val < 0) {
        tri = "▼"
    }

    for (let i = 0; i < Math.ceil(Math.abs(val) / 10); i++) {

        finalString += tri

    }

    return finalString

}

let getPrice = 0
let healthVal = 0
let happyVal = 0
let tiredVal = 0
let dirtVal = 0

function updateSleepPricing(val) {

    let lst = document.getElementById("sleepList")

    document.getElementById("sleepSec").innerHTML = `${10 * val} seconds`

    getPrice = ((15 * val) + (10 * val)) - 10
    healthVal = 3 * val
    happyVal = 3 * val
    tiredVal = -15 * val
    dirtVal = 2.5 * val

    lst.innerHTML = `
    <span>Price: <font color='green'>$${getPrice}</font></span>
<font color='green'>Health ${convertValueIntoTriangles(healthVal)}</font>
<font color='green'>Happiness ${convertValueIntoTriangles(happyVal)}</font>
<font color='green'>Tiredness ${convertValueIntoTriangles(tiredVal)}</font>
<font color='darkred'>Dirt ${convertValueIntoTriangles(dirtVal)}</font>
    
    `

}

function purchaseSleep() {

    if (data.balance >= getPrice) {

        sleeppopup.remove()

        data.balance -= getPrice

        pet.health += healthVal
        pet.happiness += happyVal
        pet.tiredness += tiredVal
        pet.dirt += dirtVal

        updatePetDisplay()

    } else {

        let err = popup("gloob", `You don't have enough money!`)
        setTimeout(() => {
            err.remove()
        }, 1000);

    }

}

function purchase(item) {

    if (item.class == "appliance") {

        console.log("purchasing")

        data.balance -= item.price

        data.appliances.push(item.name)

        switch (item.name.toLowerCase()) {
            case "hamster wheel":
                break
            default:
                break
        }

    } else if (item.class == "care") {

        data.balance -= item.price

        for (const [key, value] of Object.entries(item.effects)) {
            if (key in pet) {
                pet[key] += value
            }
        }

        switch (item.name.toLowerCase()) {

            case "sleep":
                data.balance += item.price
                sleeppopup = popup("Gloob Sleeping", `
                    <p>Please choose how long you'd want your Gloob to sleep.</p>
                    <div class="buttons center">
                        <div class="field-row" style="width: 200px">
  <input id="sleeprange" type="range" min="1" max="10" value="1" oninput="updateSleepPricing(this.value)" onchange="updateSleepPricing(this.value)" />
</div></div><br>
<div class='buttons center' id="sleepSec">10 seconds</div>
<div id="sleepList">
<span>Price: <font color='green'>$15</font></span>
<font color='green'>Health ▲</font>
<font color='green'>Happiness ▲</font>
<font color='green'>Tiredness ▼</font>
<font color='darkred'>Dirt ▲</font>
</div>
<br>
<div class="buttons center"><button onclick="purchaseSleep()">Confirm</button><button onclick='sleeppopup.remove()'>Cancel</button></div>
                    `)

                updateSleepPricing(document.getElementById("sleeprange").value)

                break
            default:
                break
        }

    } else if (item.class == "food") {

        data.balance -= item.price

        for (const [key, value] of Object.entries(item.effects)) {
            if (key in pet) {
                pet[key] += value
                if (key == "hunger" && data.appliances.includes("Oven")) {
                    pet[key] += value * 1.25
                } else {
                    pet[key] += value
                }
            }
        }

        switch (item.name.toLowerCase()) {

            case "rotting food":

                let n = variant.name.toLowerCase()

                if (n == "moss ball" || n == "mold colony" || n == "violet") {

                    for (const [key, value] of Object.entries(item.effects)) {
                        if (key in pet) {
                            pet[key] += value * -1
                        }
                    }
                    for (const [key, value] of Object.entries(item.effects)) {
                        if (key in pet) {
                            pet[key] += value * -1
                        }
                    }

                }

                break
            case "soup":
                if (Math.random() * 100 <= 10) {
                    pet.diseases.splice(getRandomInt(pet.diseases.length - 1), 1)
                }
                if (variant.name.toLowerCase() == "carbunj") {
                    pet.dirt += 8
                }
                break
            case "coffee":

                if (variant.name.toLowerCase() == "coffee") {
                    pet.happiness -= 30
                }
                if (variant.name.toLowerCase() == "brain") {
                    pet.happiness += 10
                }

                break
            case "maw of gluttony":
                if (Math.random() * 100 <= 10) {
                    addDisease("random", pet.diseases)
                }
                break
            case "refreshing brew":
                DISEASE_LIST.forEach(disease => {
                    addDisease(disease, pet.diseases)
                })
                break
            default:
                break

        }

    }

    updatePetDisplay()

}