var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require("bcrypt")
module.exports = {
    doSignUp: (userData) => {
        return new Promise(async (resolve, reject) => {



            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })

            let response = null
            if (user) {
                if (userData.email == user.email) {
                    
                    
                    response = false
                    resolve(response)

                    console.log(response, "..............")



                } else {

                    console.log('login failed')


                }
            } else {



                userData.pass = await bcrypt.hash(userData.pass, 10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(async (response) => {
                    let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
                    response.user = user
                    response.status = true
                    resolve(response)
                })

            }




        })


    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.pass, user.pass).then((status) => {
                    if (status) {
                        console.log("login success")
                        response.user = user
                        response.status = true
                        resolve(response)

                    } else {
                        console.log("login failed")
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('login user failed')
                resolve({ status: false })

            }


        })
    }
}