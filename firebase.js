const admin = require('firebase-admin')

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    storageBucket: 'zhanshuak-6969.firebasestorage.app',
})

const bucket = admin.storage().bucket()
module.exports = bucket
