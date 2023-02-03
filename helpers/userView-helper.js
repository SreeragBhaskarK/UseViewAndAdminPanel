var db = require('../config/connection')
var collection = require('../config/collections')
var objectId=require('mongodb').ObjectId

module.exports={
    doUserView:()=>{
        return new Promise(async(resolve,reject)=>{
            let userView = await db.get().collection(collection.USER_COLLECTION).find().toArray()

            resolve(userView)
        })
    },
    deleteUserView: (userId) => {
        
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)}).then((response) => {
                resolve(response)
            })
        })

    },
}
