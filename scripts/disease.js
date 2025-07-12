const DISEASE_LIST = [
    "Leech Seed",
    "Leukemia",
    "Tape Worm",
    "Ate a Magnet",
    "Greed",
    "Cold",
    "Carbunj Flu",
    "Mold Poisoning",
    "Pharaoh's Curse",
    "Gacha Fan",
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
        case "Pharaoh's Curse":
            let disamount = 0.2 * pet.diseases.length
            mults.hunger += disamount
            mults.thirst += disamount
            mults.tiredness += disamount
            mults.dirt += disamount
            mults.happiness += disamount
            break
        case "Mold Poisoining":
            mults.hunger += 0.5
            break
        case "Carbunj Flu":
            if (pet.thirst <= 75) {
                mults.hunger += 0.5
                mults.happiness += 0.5
            }
            break
        case "Leech Seed":
            mults.thirst += 1
            break
        case "Cold":
            mults.tiredness += 1
            break
        case "Ate a Magnet":
            mults.dirt += 1
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