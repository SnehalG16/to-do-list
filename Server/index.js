const express=require("express")
const fs=require("fs")
const app=express()
var cors = require('cors')  
app.use(express.json())
app.use(cors());

// get data
app.get("/getdata",(req,res)=>{
  fs.readFile("./db.json","utf-8",(err,data)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.send(data)
        }
  })  
})

// post data
app.post("/postdata", (req, res) => {
    fs.readFile("./db.json", "utf-8", (err, data) => {
        if (err) {
            res.send(err);
        } else {
            let products = JSON.parse(data);
            const newProduct = req.body;
            newProduct.id = products.length + 1;
            products.push(newProduct);

            fs.writeFile("./db.json", JSON.stringify(products), (err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send("product added ..!");
                    res.send({ id: newProduct.id });
                }
            })
        }
    })
});

// delete data 
app.delete("/deletproduct/:productid",(req,res)=>{

    const {productid}=req.params;
    fs.readFile("./db.json","utf-8",(err,data)=>{
        if(err)
        {
            res.send(err)
        }
        else
        {
            let newdata=JSON.parse(data)
            newdata=newdata.filter((el)=>el.id!=productid)
            fs.writeFile("./db.json",JSON.stringify(newdata),(err)=>{
                if(err)
                {
                    res.send(err)
                }
                else
                {
                    res.send("product deleted")
                }
            })
        }
    })
    console.log(productid)

})

// update data
// petch
app.patch("/updateproduct/:productid",(req,res)=>{
    let {productid}= req.params
    fs.readFile("./db.json", "utf-8" ,(err,data)=>{
        let newdata=JSON.parse(data);
        const index=newdata.findIndex((el)=>el.id==productid)
        if(index!=-1)
        {
        newdata[index]={...newdata[index],...req.body};
        fs.writeFile("./db.json",JSON.stringify(newdata),(err)=>{
            if(err)
            {
                res.send(err)
            }
            else
            {
                res.send("product updated")
            }
        })
        }
        else
        {
            res.send("product not matched")
        }       
    })
 

})

// update single product in form
app.get("/getproduct/:id", (req, res) => {
    const { id } = req.params;
    
    fs.readFile("./db.json", "utf-8", (err, data) => {
        if (err) {
            res.send(err);
        } else {
            const products = JSON.parse(data);
            const product = products.find(item => item.id == id);
            
            if (product) {
                res.send(product);
            } else {
                res.send("Product not found");
            }
        }
    })
});

app.listen(8080,()=>{
    console.log("server is running on 8080 port")
})