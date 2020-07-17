//db connection
const { get } = require('../utils/db');

class User {
    
    async getAll(){
            
        const users = get().collection('users').find({}).toArray();
        return users;            
        
    }
    
    //https://docs.mongodb.com/manual/reference/method/cursor.skip/
    async searchUser(query, pageNumber, nPerPage){
            
        const users = get().collection('users').find({
            "email": {
                $regex: query,
                $options: "i"
            }
        }).skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 ).limit( nPerPage ).toArray();//Without toArray() you can not get the search results;
        
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
    
    async deleteOne(myquery){
        await get().collection("users").deleteOne(myquery); 
    }
    
}

module.exports = User;
