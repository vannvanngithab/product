//instantiation
//import express API framework
const express = require("express")
const app = express();
const moment  =require('moment')
//importing mysql
const mysql = require("mysql")
//port number
const PORT = process.env.PORT || 5000;

const logger = (req, res, next) =>{
   
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} : ${moment().format()}`)
    next()
}

app.use(logger)
//connection to mysql
const connection = mysql.createConnection({
    host: "bh0t018c0upb9xdjnplq-mysql.services.clever-cloud.com",
    user: "ud4pteckkbyvasp4",
    password: "kYxk3zPAECzsGNBsRmS3",
    database: "bh0t018c0upb9xdjnplq",
});

//initilization of connection
connection.connect();


//API - REPORT
//GET request and response are the parameters
app.get("/api/members", (req, res) =>{
    //create a query
    connection.query("SELECT * FROM userdata",(err, rows, fields)=>{
        //checking errors
        if(err) throw err;
        //response
        //key value pair
        res.json(rows);
    });
});

//API - REPORT - SEARCH
//passing the id parameter
//request - >>> front-end ID
app.get("/api/members/:id",(req, res)=>{
    const id=req.params.id; 
    connection.query(`SELECT * FROM userdata WHERE id='${id}'`, (err, rows, fields)=>{
        if(err) throw err;

        if(rows.length > 0){
            res.json(rows);
        }else{
            res.status(400).json({msg: `${id} id not found!`})
        }
    })
    //res.send(id);
})


//POST - CREATE
app.use(express.urlencoded({extended: false}))
app.post("/api/members", (req, res)=>{
    const id = req.body.id;
    const itemname = req.body.itemname;
    const unitPrice = req.body.unitPrice;
    const quantity = req.body.quantity;
    const supplier = req.body.supplier;
    connection.query(`INSERT INTO userdata (ID, Item_Name, Unit_Price, Quantity, Supplier) VALUES ('${id}','${itemname}', '${unitPrice}', '${quantity}','${supplier}')`, (err, rows, fields) =>{
        if(err) throw err;
        res.json({msg: `Successfully inserted`});
    })

})

//CRUD
//API
//PUT - UPDATE
app.use(express.urlencoded({ extended: false }));
app.put("/api/members", (req, res) => {
 const id = req.body.id;
    const itemname = req.body.itemname;
    const unitPrice = req.body.unitPrice;
    const quantity = req.body.quantity;
    const supplier = req.body.supplier;
  connection.query(
    `UPDATE userdata SET ID='${id}', Item_Name='${itemname}', Unit_Price='${unitPrice}', Quantity='${quantity}' , Supplier = '${supplier}' WHERE id='${id}'`,
    (err, rows, fields) => {
      if (err) throw err;
      res.json({ msg: `Successfully updated!` });
    }
  );
});

//DELETE API
app.use(express.urlencoded({ extended: false }));
app.delete("/api/members", (req, res) =>{
    const id=req.body.id;
    connection.query(`DELETE FROM userdata WHERE id='${id}'`, (err, rows, fields)=>{
        if(err) throw err
        res.json({msg: `Successfully deleted!`})
    })
})




app.listen(5000, () => {
    console.log(`Server is running in port ${PORT}`);
})
