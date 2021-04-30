const dinner = {
    meal: 'hello vue3'
}

const handler = {
    get(target, prop) {
        return target[prop]
    }
}

