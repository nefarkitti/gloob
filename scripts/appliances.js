
function procAppliances(t) {

    let applis = data.appliances

    if (applis.includes('Hamster Wheel')) {

        if (t % 10 == 0) {

            if (pet.tiredness <= 50) {

                data.balance += 30

            }

        }

    }

    if (applis.includes('Laundering Business')) {

        if (t % 20 == 0) {

            if (Math.random()*100 <= 30) {

                data.balance += 50

            }

        }

    }

}