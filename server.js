const express=require('express')
const mysql2=require('mysql2')
const bodyparse=require('body-parser')
const cors=require('cors')
require('dotenv').config();

const app = express()
const port = process.env.PORT ||3005; //server


//Middleware
app.use(cors())
app.use(bodyparse.json())

//MySQL

/*const db=mysql2.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'dhanushdb'
    })*/
   const db = mysql2.createConnection(process.env.MYSQL_URL);
db.connect((err)=>{
    if(!err)
        console.log('DB connected')
    else
    console.log('DB not connected')
})

//APIs

//Create table

app.get("/createtable",(req,res)=>{
    let sql='create table posts(id int auto_increment,title varchar(100),body text,primary key(id))';
    db.query(sql,(err,results)=>{
        if(!err)
            console.log('Table created')
        res.send('Table created')
        })
})
//Insert data
app.post("/addpost",(req,res)=>{
    let post={title:req.body.title,body:req.body.body};
    let sql='insert into posts SET ?';
    db.query(sql,post,(err,results)=>{
        if(!err)
            console.log('Post added')
        res.send('Post added')
        })
})
//getPosts
app.get("/getposts",(req,res)=>{
    let sql='select * from posts';
    db.query(sql,(err,results)=>{
        if(!err)
            console.log('Posts fetched')
        res.json(results)
        })
        })

//get post by ID

app.get('/getposts',(req,res)=>{
    let sql=`select * from posts where id=${req.params.id}`;
    db.query(sql,(err,results)=>{
        if(!err)
            console.log('Post fetched')
        res.json(results)
        })
})
//update posts
app.put('/updatepost/:id',(req,res)=>{
    const {id}=req.params;
    const {title,body}=req.body;
    let sql=`update posts set title=?,body=? where id=?`;
    db.query(sql,[title,body,id],(err,results)=>{
        if(!err)
            console.log('Post updated')
        res.send('Post updated')
        })
})
//delete post
app.delete('/deletepost/:id',(req,res)=>{
    const {id}=req.params;
    let sql=`delete from posts where id=?`;
    db.query(sql,[id],(err,results)=>{
        if(err)throw err;
        res.send('Post deleted')
        })
    })

app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})
