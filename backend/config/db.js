import mongoose from "mongoose";
const connectdb=(url)=>{
    mongoose.connect(url).then(()=>{
            console.log("Connected to database")
        }).catch((Error)=>{

        console.log('Unable to connect to database: ' ,Error)
    })
    
}
 export{connectdb}