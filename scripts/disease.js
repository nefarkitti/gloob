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
        case "Leukemia":
            // positive health in half
        case "Tape Worm":
            mults.hunger += 1
    }

    return mults

}