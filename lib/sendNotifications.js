const webpush = require('web-push');

module.exports = function ({ username, subscription }) {
    if (subscription) {


        const payload = JSON.stringify({
            title: `Hello ${username}`,
            body: `
            One of your favourite products has recently change.
            You can check it in your favourite section.
        `,
        })

        webpush.sendNotification(subscription, payload)
            .then(result => console.log(result))
            .catch(e => console.log(e))
    }
}