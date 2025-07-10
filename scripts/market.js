
function purchase(item) {

    if (item.class == "appliance") {

        switch (item.name.toLowerCase()) {
            case "hamster wheel":
                break
            default:
                break
        }

    } else if (item.class == "care") {

        switch (item.name.toLowerCase()) {
            case "hamster wheel":
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

        updatePetDisplay()

    }

}