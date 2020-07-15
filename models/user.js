//db connection
const { get } = require('../utils/db');

class User {
    
    async getAll(){
            
        const users = get().collection('users').find({}).toArray();
        return users;            
        
    }
    
    async getOne(criteria){
    
        const user = get().collection('users').findOne(criteria);
        return user;
    
    }
    
    async createOne(userObj){
            
        const doc = await get().collection("users").insertOne({
            email: userObj.email,
            password: userObj.password,
            role: "user"
        });    
        
        return doc.ops[0];            

    }
    
    async updateOne(myquery, newvalues){
        const doc = await get().collection("users").findOneAndUpdate(myquery, newvalues, { returnOriginal: false }); 
        return doc.value; 
    }
}

module.exports = User;
