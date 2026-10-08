const REGIONS_GRID = document.getElementById("regions-grid")
const ITEMS_GRID = document.getElementById("items-grid")
const ITEMS_DISPLAY = document.getElementById("items-display")

let REGIONS_LIST
let ITEMS_LIST

REGIONS_GRID.innerHTML = ``
ITEMS_GRID.innerHTML = ``

let explorepopup

let regioni = 0
function loadRegions(REGIONS, items) {
    REGIONS_LIST = REGIONS
    ITEMS_LIST = items
    REGIONS.forEach(region => {
        regioni++
        REGIONS_GRID.innerHTML += `
        <article role="tabpanel">
                                    <h5 style="margin-top:0px;">${region.name}</h5>
                                    <button class="btn" onclick="venture('${regioni - 1}')">VENTURE</button>
                                    <div class="effects" id="${region.name}-${regioni}">
                                    </div>
                                </article>
        `

        region.lines.forEach(line => {
            document.getElementById(`${region.name}-${regioni}`).innerHTML += line
        })

    });
}

function venture(id) {

    let exploring = REGIONS_LIST[id]
    console.log(`exploring ${exploring.name}`)

    if (pet.tiredness + exploring.cost.tiredness > 100) {

        let fail = popup("Gloob Walk", `<span>Your Gloob is too tired to explore this area!</span>`)
        setTimeout(() => {
            fail.remove()
        }, 1000);

        return
    }

    explorepopup = popup("Gloob Walk", `
        <span>You went for a walk at ${exploring.name}</span> <br>
        <span>You obtained some items!</span> <br>
        <div class="buttons center"><button onclick="closeExplore()">Close</button></div>
        `)

    for (const [key, value] of Object.entries(exploring.cost)) {
        if (key in pet) {
            pet[key] += value
        }
    }

    let pool = exploring.items

    let roll = getRandomIntInclusive(exploring.drops[0], exploring.drops[1])
    console.log(exploring.drops)
    for (let i = 0; i < roll; i++) {
        let getItem = weightedRNG(pool)
        addItemToInv(getItem)
        console.log(getItem)
    }

    ITEMS_DISPLAY.innerHTML += `<font color='red'> (!!!)</font>`

    updatePetDisplay()

}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function updateItemsDisplay() {

    ITEMS_GRID.innerHTML = ``

    let i = 0
    let total = 0
    for (const [item, count] of Object.entries(data.items)) {
        i++
        total += count
        ITEMS_GRID.innerHTML += `
                <article role="tabpanel">
                                    <h5 style="margin-top:0px;">${ITEMS_LIST[item].name}</h5>
                                    <span style="color: green;">$${ITEMS_LIST[item].sell}</span>
                                    <button class="btn" onclick="useItem('${item}')">USE</button>
                                    <button class="btn" onclick="sellItem('${item}')">SELL</button>
                                    <div class="effects" id="${item}-${i}">
                                    </div>
                                    <div style="margin-top:5px;" class="effects" id="">
                                        <span style="font-size:12px;text-align:right;"><b>x${count}</b></span>
                                    </div>
                                </article>
        `

        ITEMS_LIST[item].lines.forEach(effect => {
            document.getElementById(`${item}-${i}`).innerHTML += effect
        })
    }

    ITEMS_DISPLAY.innerHTML = `Items (${total})`

}

function clearnotif() {
    updateItemsDisplay()
}

function useItem(item) {
    if (item in data.items) {

        for (const [key, value] of Object.entries(ITEMS_LIST[item].effects)) {
            if (key in pet) {
                pet[key] += value
            }
        }

        data.items[item] -= 1
        if (data.items[item] == 0) {
            delete data.items[item]
        }
    }

    updateItemsDisplay()
    updatePetDisplay()
}

function sellItem(item) {

    if (item in data.items) {
        data.balance += ITEMS_LIST[item].sell
        data.items[item] -= 1
        if (data.items[item] == 0) {
            delete data.items[item]
        }
    }

    updateItemsDisplay()
    updatePetDisplay()

}

function addItemToInv(item) {

    if (item in data.items) {
        data.items[item] += 1
    } else {
        data.items[item] = 1
    }
    updateItemsDisplay()

}

function closeExplore() {
    explorepopup.remove()
}

function weightedRNG(obj) {
    let result = undefined;
    let total = 0;

    for (const property in obj) {
        total += obj[property];
    }

    let index = Math.random() * total;

    for (const property in obj) {
        const value = obj[property];
        if (index < value) {
            result = property;
            break;
        } else {
            index -= value;
        }
    }

    return result;
}

function capitalize(s) {
    return String(s[0]).toUpperCase() + String(s).slice(1);
}