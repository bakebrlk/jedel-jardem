const admin = require('firebase-admin')
const serviceAccount = require('./firebase-key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'zhanshuak-6969.firebasestorage.app',
})

const bucket = admin.storage().bucket()
module.exports = bucket
