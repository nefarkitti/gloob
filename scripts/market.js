
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

            case "pills":
                break
            default:
                break
        }

    } else if (item.class == "food") {

        data.balance -= item.price

        for (const [key, value] of Object.entries(item.effects)) {
            if (key in pet) {
                pet[key] += value
            }
        }

    }

    updatePetDisplay()

}