var db = require('../config/connection')
var collection = require('../config/collections')
var objectId=require('mongodb').ObjectId
module.exports = {
    /* addProduct:(product,callback)=>{
        console.log(product)
        db.get().collection('product').insertOne(product).then((data)=>{
            
            console.log("start lIne",data,"endline")
            callback(data.insertedId)
            console.log(data.insertedId)

        })

        
    }, */

    addProduct: (product) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {


                resolve(data.insertedId)


            })

        })

    },


    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })

    },
    deleteProduct: (proId) => {
        console.log(proId)
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response) => {
                resolve(response)
            })
        })

    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })

        })

    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},
            {$set:{
                Name:proDetails.Name,
                Description:proDetails.Description,
                Price:proDetails.Price,
                Category:proDetails.Category

            }}).then((response)=>{
                resolve()

            })

        })
    }


}