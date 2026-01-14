require ("dotenv").config() ;
const express = require ("express") ;  // hook type of mongoDB 
const cors = require ("cors") ;   // Cors - permitted to run in localhost:5173-->frontend and localhost:3000 -->backend
const port = process.env.PORT || 3000 ;


const app = express() ;
app.use(cors()) ;
app.use(express.json())   // thats needed for post data on mongo



// MongoDB --> Atlas --> Security --> Database & Network Access --> Add new Database user -- > pass copy 
// MongoDB --> Atlas --> Security --> Database & Network Access --> IP access list --> 0000
// MongoDB --> Atlas --> Database --> Clusters --> Connect --> Drivers --> Code cpy
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const Order_Collections = myDatabase.collection("Order_Items") ; 


    // ****************My Part of this copy pasted code from mongo p- 1 = data transfer from front to back = Called POST SERVICE **********************
    // Post Add Listings data to backend 
    app.post('/dashboard/addlisting' , async(req , res) => {
        const dataBackEnd = req.body ;  // body = accepting data from frontend addListingFormgData
        const date = new Date() ;
        dataBackEnd.createdAt = date ;
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

    // ****** Recent Lisitngs ***************/
    app.get('/recent', async (reqRL, resRL) => {
      const resultRL = await PawsNest_addListings.find().sort({ createdAt: -1 }).limit(6).toArray();
        resRL.send(resultRL);
    });



    

    // post
    app.post('/fulldata' , async(req2 , res2) => {
    const dataBackEnd2 = req2.body ; 
    console.log(dataBackEnd2) ;
    // insert to mongo
    const result2 = await PawsNest_addListings.insertMany(dataBackEnd2) ;
    res2.send(result2) ; })

    // get
    app.get('/fulldata' ,async(req2 , res2) => {
      const {category} = req2.query ;
      const query = {} ;
      if(category) {
        query.category = category ;
      }
      const resultFullD = await PawsNest_addListings.find(query).toArray() ;
      res2.send(resultFullD) ;
    })



    // get specifiq id for listing details
    app.get("/dashboard/updatelistings/:id" , async(req3 , res3) => {
      const id = req3.params;
      console.log(id) ;

      const query = {_id: new ObjectId(id)}; // click kora :id datatbase er _id er shathe match kore dekhbe kontar shathe matched hy
      const matchedItemm = await PawsNest_addListings.findOne(query)  ;
      res3.send(matchedItemm) ;
    })





    // post--> order data from listing details page to backend
    app.post('/myorders' , async(req3_1 , res3_1) => {
      const dataBackEnd3_1 = req3_1.body ; 
      console.log(dataBackEnd3_1) ;
      // insert to database
      const result3_1 = await Order_Collections.insertOne(dataBackEnd3_1) ;
      res3_1.send(result3_1) ;
    })

    // get order data
    app.get('/myorders' , async(req3_1 , res3_1) => {
      const email = req3_1.query.email ;
      console.log("Logged in User's Email:", email);
      const query = {Email:email} ;  // dtatbase e Email:....
      const resOrderD = await Order_Collections.find(query).toArray() ;
      res3_1.send(resOrderD) ;
    }) 




    // get by email--->my listings page task
    app.get('/mylistings', async (req4, res4) => {
    const {email} = req4.query;
    const query = { email: email };  
    console.log(query) ;
    const result4 = await PawsNest_addListings.find(query).toArray();
    res4.send(result4);
    })





    // update
    app.put('/updatelistings/:id' , async(req5 , res5) => {
      const dataBackEnd5 = req5.body ;
      console.log(dataBackEnd5) ;

      const id = req5.params.id ;
      const query = {_id: new ObjectId(id)};
      const updated_Data = {
        $set: dataBackEnd5  
      }
      const result5 = await PawsNest_addListings.updateOne(query , updated_Data) ;
      res5.send(result5) ;
    })


    // Delete
    app.delete('/delete/:id' , async(req6 , res6) => {
      const id = req6.params;
      const query = {_id: new ObjectId(id)};
      const result6 = await PawsNest_addListings.deleteOne(query) ;
      res6.send(result6) ;
    })


    // get 
    app.get("/stats", async (req, res) => {
    const totalPets = await PawsNest_addListings.countDocuments();
    const totalAdoptions = await Order_Collections.countDocuments({Price:0});
    res.send({ totalPets, totalAdoptions, families:totalAdoptions });
  });







    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
