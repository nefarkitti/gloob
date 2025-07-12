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

let balanceEl = document.getElementById("balance")

let careMarket = document.getElementById("petmarket")
let foodMarket = document.getElementById("foodmarket")
let applianceMarket = document.getElementById("applianceMarket")

const tab = document.getElementById("title")

let pet
let debugmult = 1
let variant

const decay = {

    "hunger": -0.5,
    "thirst": -1,
    "dirt": 1,
    "tiredness": 1,
    "happiness": -0.5

}

function getFoodCount() {

    let ob = {}

    pet.recentfoods.forEach(fooditem=>{

        if (fooditem in ob) {
            ob[fooditem] += 1
        } else {
            ob[fooditem] = 1
        }

    })

    return ob

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

function attemptPurchase(type, index) {

    if (type == "food") {

        let item = FOODS[index]

        if (data.balance >= item.price) {

            purchase(item)

        }

    }
    if (type == "care") {

        let item = CARES[index]

        if (data.balance >= item.price) {

            purchase(item)

        }

    }
    if (type == "appliance") {

        console.log("buying appliance")

        let item = APPLIANCES[index]

        if (!data.appliances.includes(item.name)) {

            console.log("not present")

            if (data.balance >= item.price) {

                console.log("afforable")

                purchase(item)

            }

        }

    }

}

let diseaseMults = {
    "health": 1,
    "hunger": 1,
    "thirst": 1,
    "dirt": 1,
    "tiredness": 1,
    "happiness": 1
}

function updatePetDisplay() {

    diseaselist.innerHTML = ``

    pet.diseases.forEach(disease => {
        diseaselist.innerHTML += `<span>${disease.toUpperCase()}</span>`
        setDiseaseMult(disease, diseaseMults)
    });

    pet.hunger = clamp(pet.hunger, -10, 100)
    pet.thirst = clamp(pet.thirst, 0, 100)
    pet.dirt = clamp(pet.dirt, -50, 100)
    pet.tiredness = clamp(pet.tiredness, -50, 110)
    pet.happiness = clamp(pet.happiness, -10, 100)
    pet.health = clamp(pet.health, 0, 100)

    health.style.width = `${clamp(pet.health, 0, 100)}%`
    hunger.style.width = `${clamp(pet.hunger, 0, 100)}%`
    thirst.style.width = `${clamp(pet.thirst, 0, 100)}%`
    dirt.style.width = `${clamp(pet.dirt, 0, 100)}%`
    tiredness.style.width = `${clamp(pet.tiredness, 0, 100)}%`
    happiness.style.width = `${clamp(pet.happiness, 0, 100)}%`
    race.innerText = variants[pet.variant].name.toUpperCase()

    let t = convertSeconds(pet.age)
    age.innerText = `${t.h}h ${t.m}m ${t.s}s`

    balanceEl.innerHTML = `<span style="color: green;">$${Math.floor(data.balance)}</span>`

    careMarket.innerHTML = ``
    foodMarket.innerHTML = ``
    applianceMarket.innerHTML = ``
    let carei = 0
    let foodi = 0
    let appi = 0
    CARES.forEach(care => {
        careMarket.innerHTML += `
        <article role="tabpanel">
                                    <h5>${care.name}</h5>
                                    <span style="color: green;">$${care.price}</span>
                                    <button class="buybtn" onclick="attemptPurchase('care', ${carei})">BUY</button>
                                    <div class="effects" id="care-${carei}">
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                    </div>
                                </article>
        `

        document.getElementById(`care-${carei}`).innerHTML = ``

        care.lines.forEach(line => {
            document.getElementById(`care-${carei}`).innerHTML += `<span>${line}</span>`
        });

        carei++
    })
    FOODS.forEach(food => {
        foodMarket.innerHTML += `
        <article role="tabpanel">
                                    <h5>${food.name}</h5>
                                    <span style="color: green;">$${food.price}</span>
                                    <button class="buybtn" onclick="attemptPurchase('food', ${foodi})">BUY</button>
                                    <div class="effects" id="food-${foodi}">
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                    </div>
                                </article>
        `

        document.getElementById(`food-${foodi}`).innerHTML = ``

        food.lines.forEach(line => {
            document.getElementById(`food-${foodi}`).innerHTML += `<span>${line}</span>`
        });

        foodi++
    })
    APPLIANCES.forEach(appliance => {
        let disable = ""
        let hiddentext = ""
        let buttontext = "BUY"
        if (data.appliances.includes(appliance.name)) {
            disable = "disabled"
            buttontext = "PURCHASED"
            hiddentext = "display:none;"
        }
        applianceMarket.innerHTML += `
        <article role="tabpanel">
                                    <h5>${appliance.name}</h5>
                                    <span style="color: green;${hiddentext}">$${appliance.price}</span>
                                    <button class="buybtn" onclick="attemptPurchase('appliance', ${appi})" ${disable}>${buttontext}</button>
                                    <div class="effects" id="appliance-${appi}">
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                        <span>DEATH</span>
                                    </div>
                                </article>
        `

        document.getElementById(`appliance-${appi}`).innerHTML = ``

        appliance.lines.forEach(line => {
            document.getElementById(`appliance-${appi}`).innerHTML += `<span>${line}</span>`
        });

        appi++
    })

}

let ticks = 0
let clone = "ALIVE"
function tick() {

    //addMessage("hey")

    ticks++
    if (ticks > 1024) {
        ticks = 1
    }

    //updateStocks()
    procAppliances(ticks)

    tab.innerText = pet.name

    diseaseMults = {
        "health": 1,
        "hunger": 1,
        "thirst": 1,
        "dirt": 1,
        "tiredness": 1,
        "happiness": 1
    }

    if (data.appliances.includes("Enclosure Decor")) {
        diseaseMults.happiness -= 0.15
    }
    if (data.appliances.includes("Cactus")) {
        diseaseMults.happiness -= 0.1
        diseaseMults.tiredness -= 0.1
    }
    if (data.appliances.includes("AC")) {
        diseaseMults.thirst -= 0.25
    }

    statuslist.innerHTML = ``
    diseaselist.innerHTML = ``

    variant = variants[pet.variant]

    data.last = Date.now()

    pet.diseases.forEach(disease => {
        diseaselist.innerHTML += `<span>${disease.toUpperCase()}</span>`
        setDiseaseMult(disease, diseaseMults)
    });

    pet.age += 1

    pet.hunger += decay.hunger * (variant.hungermult * diseaseMults.hunger * debugmult)
    pet.thirst += decay.thirst * (variant.thirstmult * diseaseMults.thirst * debugmult)
    pet.dirt += decay.dirt * (variant.dirtmult * diseaseMults.dirt * debugmult)
    pet.tiredness += decay.tiredness * (variant.tiredmult * diseaseMults.tiredness * debugmult)
    pet.happiness += decay.happiness * (variant.happymult * diseaseMults.happiness * debugmult)

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

    if (pet.diseases.includes("Cold")) {
        healthProfit -= 1
    }

    if (pet.diseases.includes("Mold Poisoning")) {
        if (healthProfit >= 1) {
            healthProfit *= 0.8
        }
    }
    if (pet.diseases.includes("Leukemia")) {
        if (healthProfit >= 1) {
            healthProfit *= 0.5
            healthProfit -= 1
        }
    }

    pet.health += healthProfit

    if (ticks % 20 == 0) {
        if (getRandomInt(100) <= ((100 - pet.health) / 2)) {
            addDisease(DISEASE_LIST[getRandomInt(DISEASE_LIST.length - 1)], pet.diseases)
        }
    }

    data.balance += 3

    if (data.appliances.includes("Gloob Cloning")) {

        if (ticks % 20 == 0) {

            if (clone == "ALIVE") {
                pet.happiness += 30
            } else if (clone == "DEAD") {
                pet.happiness -= 15
            }

        }

        if (ticks % 60 == 0) {

            if (Math.random() >= 0.5) {
                clone = "ALIVE"
            } else {
                clone = "DEAD"
            }

        }

    }
    if (data.appliances.includes("Cactus")) {
        data.balance += 2
    }
    if (data.appliances.includes("The Cube")) {
        data.balance += 25
    }
    if (data.appliances.includes("A Whole Fucking Chicken")) {
        data.balance += 25
    }
    if (data.appliances.includes("Slot Machine")) {

        if (pet.health <= 75) {
            data.balance += 5
        }
        if (pet.health <= 50) {
            data.balance += 5
        }
        if (pet.health <= 25) {
            data.balance += 5
        }
        if (pet.health <= 0) {
            data.balance += 5
        }

    }

    if (pet.diseases.includes("Gacha Fan") && ticks % 20 == 0) {

        if (Math.random() * 100 <= 25) {
            if (data.balance >= 200) {
                data.balance -= 200
                 pet.happiness += getRandomInt(10) + 10
            } else {
                pet.happiness -= getRandomInt(10) + 10
            }
        }

    }

    updatePetDisplay()

    let cod = []

    if (pet.hunger <= -10) {
        pet.state = "dead"
        cod.push("Starvation (didn't eat enough)")
    }
    if (pet.thirst <= 0) {
        pet.state = "dead"
        cod.push("Dehydration (didn't drink enough)")
    }
    if (pet.tiredness >= 110) {
        pet.state = "dead"
        cod.push("Exhaustion (too much tiredness)")
    }
    if (pet.happiness <= -10) {
        pet.state = "dead"
        cod.push("Anguish (too little happiness)")
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
            <p>${pet.name} has died. It died to:</p>
            <ul id="reasonsofdeath">
            </ul>
            <div class="buttons">
            <button onclick="reset()">Accept</button><button onclick="reset()">Mourn</button>
            </div>
            `
            , null, "<img src='assets/tombstone.gif'>")

        cod.forEach(reason => {
            document.getElementById("reasonsofdeath").innerHTML += `<li>${reason}</li>`
        })

    }

}

function startgame() {

    console.log(data)

    petui.style.display = ""

    pet = data.pet

    variant = variants[pet.variant]

    if ("icon" in variant) {
        document.getElementById("pet-icon").src = `assets/pets/${variant.name.toLowerCase()}.png`
    } else {
        document.getElementById("pet-icon").remove()
    }

    tab.innerText = pet.name

    document.getElementById("petname").innerText = pet.name

    let since = Math.round((Date.now() - data.last) / 1000)

    if (since >= 3 && pet.state != "dead") {

        console.log(`you've been gone for ${since} seconds`)

        pet.age += since

        data.balance += (3 * since) * 0.05

        pet.hunger += (decay.hunger * variant.hungermult) * 0.2
        pet.thirst += (decay.thirst * variant.thirstmult) * 0.2
        pet.dirt += (decay.dirt * variant.dirtmult) * 0.2
        pet.tiredness += (decay.tiredness * variant.tiredmult) * 0.2
        pet.happiness += (decay.happiness * variant.happymult) * 0.2

        let err = popup("gloob", `You've been gone for ${since} seconds!`)
        setTimeout(() => {
            err.remove()
        }, 1000);

    }

    updatePetDisplay()

    tick()

}

/*https://botoxparty.github.io/XP.css/*/
const tabs = document.querySelectorAll("menu[role=tablist]");

for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];

    const tabButtons = tab.querySelectorAll("menu[role=tablist] > button");

    tabButtons.forEach((btn) =>
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            tabButtons.forEach((button) => {
                if (
                    button.getAttribute("aria-controls") ===
                    e.target.getAttribute("aria-controls")
                ) {
                    button.setAttribute("aria-selected", true);
                    openTab(e, tab);
                } else {
                    button.setAttribute("aria-selected", false);
                }
            });
        })
    );
}
function openTab(event, tab) {
    const articles = tab.parentNode.querySelectorAll('[role="tabpanel"]');
    articles.forEach((p) => {
        p.setAttribute("hidden", true);
    });
    const article = tab.parentNode.querySelector(
        `[role="tabpanel"]#${event.target.getAttribute("aria-controls")}`
    );
    article.removeAttribute("hidden");
}
