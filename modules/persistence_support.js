
async function simplePromise() {
    return Promise.resolve({resolved:"Promise"});
}

module.exports = {
    simplePromise: simplePromise
}