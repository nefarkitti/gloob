const DISEASE_LIST = [
    "Leech Seed",
    "Leukemia",
    "Tape Worm",
]

function addDisease(disease, diseases) {

    if (!diseases.includes(disease)) {
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
        case "Tape Worm":
            mults.hunger += 1
            break
        default:
            break
    }

    return mults

}