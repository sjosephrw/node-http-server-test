const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);

//have a look at this link also - https://stackoverflow.com/questions/24621940/how-to-properly-reuse-connection-to-mongodb-across-nodejs-application-and-module

//https://mrvautin.com/re-use-mongodb-database-connection-in-routes/
const mongoClient = require('mongodb').MongoClient;
const mongoDbUrl = DB;
let mongodb;

const connect = (callback) => {
    mongoClient.connect(mongoDbUrl, { useUnifiedTopology: true }, (err, db) => {
        if (err) console.log(err);
        console.log(`Connected to DB successfully`);
        
        //https://stackoverflow.com/questions/47658775/db-createcollection-is-not-a-function/47658885
        //https://stackoverflow.com/a/47658885
        let dbase = db.db("test");
        
        //https://stackoverflow.com/questions/30470415/listing-all-collections-in-a-mongo-database-within-a-nodejs-script
        dbase.listCollections().toArray(function(err, collInfos) {//********* 1) list all collections
            if (err) throw err;
            // collInfos is an array of collection info objects that look like:
            // { name: 'test', options: {} }
            
            //console.log(collInfos);
            
            //https://stackoverflow.com/questions/21023982/how-to-check-if-a-collection-exists-in-mongodb-native-nodejs-driver/40141321
            //https://stackoverflow.com/a/43866912
            if (!collInfos.map(c => c.name).includes('users')) {//*********2) if the collection does n't exist then create it 
                dbase.createCollection("users", function(err, result) {
                    if (err) throw err;
                    console.log("User collection has been created!");
                    // close the connection to db when you are done with it
                    db.close();
                }); 
            } 
        
        });
        
        //https://stackoverflow.com/questions/35019313/checking-if-an-index-exists-in-mongodb
        //https://stackoverflow.com/a/35020346
        //createIndex creates the index if it does not exist
        //dbase.collection('users').createIndex({ email: "text" }, function(err, result) {
          // if(err) throw err;
           //console.log('utils/db -> ', result);
        //});    
            
        mongodb = dbase;
        callback();
    });
}

const get = () => {
    return mongodb;
}

const close = () => {
    mongodb.close();
}

module.exports = {
    connect,
    get,
    close
};
