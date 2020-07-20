const webpush = require('web-push');

module.exports = function(subscription) {
    const payload = JSON.stringify({
        title: 'Hello!',
        body: 'It works.',
    })
    
    webpush.sendNotification(subscription, payload)
        .then(result => console.log(result))
        .catch(e => console.log(e.stack))
}