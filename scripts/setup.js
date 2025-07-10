let data
let graveyard = []
let variants
let CARES
let FOODS
let APPLIANCES

let loader = popup("gloob", "<p>Loading... </p><progress style='width: 100%'></progress>")
let creator
let petnamer

let tempsave = {
    "owner": "",
    "petname": ""
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function reset() {
    graveyard.push(pet)

    if (graveyard.length >= 6) {
        graveyard.shift()
    }

    save()
    localStorage.removeItem('nefgloob')
    location.reload()
}

function handleGloobName() {

    let name = document.getElementById("gloobname").value

    if (name.length >= 1) {

        tempsave.petname = name

        petnamer.remove()

        data = {

            "owner": tempsave.owner,

            "last": Date.now(),

            "balance": 100,
            "appliances": [],

            "pet": {

                "name": tempsave.petname,
                "variant": getRandomInt(variants.length - 1),

                "state": "alive",

                "obtained": Date.now(),
                "killed": 0,
                "age": 0,
                "mood": 50,
                "hunger": 100,
                "thirst": 100,
                "dirt": 0,
                "tiredness": 0,
                "happiness": 100,
                "health": 100,

                "diseases": [],

            }

        }

        save()

        location.reload()

    } else {
        let err = popup("Error", "Please type in a valid name!", null, "<img src='assets/error.png'>")
        setTimeout(() => {
            err.remove()
        }, 1000);
    }

}

function handleContractClick() {

    let name = document.getElementById("contractee").value

    if (name.length >= 1) {

        tempsave.owner = name
        creator.remove()

        petnamer = popup("gloob", `
            <p>What would you like to name your Gloob?</p>
            <div class="buttons center">
            <input type="text" max-length="24" placeholder="Gloob Name Here" id="gloobname"><button id="submit">Submit</button>
            </div>
            `)

        document.getElementById("submit").setAttribute("onclick", "handleGloobName()")

    } else {
        let err = popup("Error", "Please type in a valid name!", null, "<img src='assets/error.png'>")
        setTimeout(() => {
            err.remove()
        }, 1000);
    }

}

function startup() {
    console.log("data didn't load, safe to assume new gloob required")
    loader.remove()

    creator = popup("gloob", `
            <p>You are about to hatch a new Gloob. Before doing so, please read and accept the <b>Terms of Service.</b></p>
            <section class="tabs" style="max-width: 500px">
  <menu role="tablist" aria-label="Sample Tabs">
    <button role="tab" aria-selected="true" aria-controls="tab-A">Terms of Service</button>
  </menu>
  <!-- the tab content -->
  <article role="tabpanel" id="tab-A">
    By accepting these terms, you agree to assume full responsibility for whatever happens to your Gloob during your time owning one.
    NyaCo is not and will not be responsible or liable for any mental, physical or virtual damage caused by the player or the Gloob during the player's
    ownership of the Gloob.
  </article>
</section>
<div class="buttons right">
<input tpye="text" placeholder="Your Name Here" maxlength="24" id="contractee"></input>
<button id="contract">Sign & Hatch</button></div>
            `,
        500)

    if (graveyard.length >= 1) {
        creator.appendChild(
            popup("gloob graveyard", `
            <p>Here you will always see the last 5 Goobs you killed.</p>
            `, 300, "", true)
        )
    }

    document.getElementById("contract").setAttribute("onclick", "handleContractClick()")
}

function load() {
    const getSave = localStorage.getItem("nefgloob");
    const getYard = localStorage.getItem("gloobgraveyard");
    try {
        if (getYard != null) {
            graveyard = JSON.parse(getYard)
        }
        if (getSave != null) {
            data = JSON.parse(getSave)
            console.log("save found!")
            setTimeout(() => {
                loader.remove()
                startgame()
            }, getRandomInt(500, 1500));
        } else {
            startup()
        }
    } catch (e) {
        startup()
    }
}
function save() {
    data = data
    graveyard = graveyard
    localStorage.setItem("nefgloob", JSON.stringify(data))
    localStorage.setItem("gloobgraveyard", JSON.stringify(graveyard))
}


axios.get("json/variants.json").then(res => {

    axios.get("json/care.json").then(cares => {

        axios.get("json/food.json").then(foods => {

            axios.get("json/appliances.json").then(appliances => {

                variants = res.data
                CARES = cares.data.sort((a, b) => a.price - b.price);
                FOODS = foods.data.sort((a, b) => a.price - b.price);
                APPLIANCES = appliances.data.sort((a, b) => a.price - b.price);

                console.log(variants)

                load()

            })

        })

    })

})