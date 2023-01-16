var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require("bcrypt")

module.exports={
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })
            if (admin) {
                bcrypt.compare(adminData.pass, admin.pass).then((status) => {
                    if (status) {
                        console.log("login success")
                        response.admin = admin
                        response.status = true
                        resolve(response)

                    } else {
                        console.log("login failed")
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('login admin failed')
                resolve({ status: false })

            }
        })
    }
}