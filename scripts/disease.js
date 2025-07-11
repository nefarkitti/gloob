const DISEASE_LIST = [
    "Leech Seed",
    "Leukemia",
    "Tape Worm",
    "Lazy"
]

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function addDisease(disease, diseases) {

    if (disease == "random") {
        disease = DISEASE_LIST[getRandomInt(DISEASE_LIST.length - 1)]
    }

    if (!diseases.includes(disease)) {

        if (data.appliances.includes("Slot Machine")) {
            data.balance += 100
        }

        diseases.push(disease)
    }

}

function setDiseaseMult(disease, mults) {

    switch (disease) {
        case "Leech Seed":
            mults.thirst += 1
            break
        case "Leukemia":
            // positive health in half
            break
        case "Lazy":
            mults.tiredness += 1.5
        case "Tape Worm":
            mults.hunger += 1
            break
        default:
            break
    }

    return mults

}