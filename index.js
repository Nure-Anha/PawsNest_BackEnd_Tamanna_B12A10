const express = require ("express") ;  // hook type of mongoDB 
const cors = require ("cors") ;   // Cors - permitted to run in localhost:5173-->frontend and localhost:3000 -->backend
require ("dotenv").config() ;
const port = process.env.PORT || 3000 ;


const app = express() ;
app.use(cors()) ;
app.use(express.json())   // thats needed for post data on mongo



// MongoDB --> Atlas --> Security --> Database & Network Access --> Add new Database user -- > pass copy 
// MongoDB --> Atlas --> Security --> Database & Network Access --> IP access list --> 0000
// MongoDB --> Atlas --> Database --> Clusters --> Connect --> Drivers --> Code cpy
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI; //pass copy = paste

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();




    // ****************My Part of this copy pasted code from mongo p- 2 = create datatbase on mongo and add data **********************
    const myDatabase = client.db('PawsNest_Database') ; // as like public folder of json file
    const PawsNest_addListings = myDatabase.collection("List_Items") ; // as like xy.json file in public folder


    // ****************My Part of this copy pasted code from mongo p- 1 = data transfer from front to back = Called POST SERVICE **********************
    app.post('/addlisting' , async(req , res) => {
        const dataBackEnd = req.body ;  // body = accepting data from frontend addListingFormgData
        // const date = new Date() ;
        // dataBackEnd.createdAt = date ;
        console.log(dataBackEnd) ;

        // p-2 = transfered data insert into database
        const result = await PawsNest_addListings.insertOne(dataBackEnd) ;
        res.send(result) ; // fronend e send korlam for console showup

    })

    // p-3 GET SERVICE to show in cards of frontend by geting the data of backend
    app.get('/addlisting' ,async(req , res) => {
      const result2 = await PawsNest_addListings.find().toArray() ;
      res.send(result2) ;
    })


    

    // post
    app.post('/fulldata' , async(req2 , res2) => {
    const dataBackEnd2 = req2.body ; 
    console.log(dataBackEnd2) ;
    // insert to mongo
    const result2 = await PawsNest_addListings.insertMany(dataBackEnd2) ;
    res2.send(result2) ; })

    // get
    app.get('/fulldata' ,async(req2 , res2) => {
      const resultFullD = await PawsNest_addListings.find().toArray() ;
      res2.send(resultFullD) ;
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();     need to remove or cmmnt out
  }
}





run().catch(console.dir);
app.get('/', (req,res) => {
  res.send('Hello, Developers') ;
}) 
app.listen(port , ()=>{
  console.log(`Server is Running on ${port}`) ;
}) ;
