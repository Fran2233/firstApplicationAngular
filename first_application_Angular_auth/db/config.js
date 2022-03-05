const mongoose  = require("mongoose");



const dbConnection = async() =>{
    try {

        await mongoose.connect( process.env.DB,
            {
            usenewUrlParser: true,
            useUnifiedTopology:true,
            
        });

        console.log('DB online');


        
    } catch (error) {
        console.log(error);
        throw new Error('Error al innicar el server');
    }
}


module.exports={
    dbConnection
}


