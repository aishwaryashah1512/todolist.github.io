//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const _ = require("lodash"); //whenever we need to use any funtionality of lodash use _ to tap into it.

mongoose.connect("mongodb+srv://admin_shah:123456@crA@cluster0.xblpy.mongodb.net/todolistDB",{useNewUrlParser:true, useUnifiedTopology: true });

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//items collections............................................................

const itemsSchema=new mongoose.Schema
({
  name:String
});
const item=mongoose.model("item",itemsSchema);

const item1=new item({
  name:"Welcome to our Todolist."
});
const item2=new item({
  name:"Hit the + button to add a new task."
});
const item3=new item({
  name:"<-- Hit this to delete an item."
});

const defaultItems=[item1,item2,item3];

//get method for root.....................................

app.get("/", function(req, res)
{
 item.find({},function(err,items)
 {
   if(items.length===0)
   {
     item.insertMany(defaultItems,function(err)
     {
       if(err)
       {
         console.log(err);
       }
       else
       {
         console.log("done");
       }
     });
     res.redirect("/");
   }
   else
   {
   res.render("list",{listTitle:"Today",newListItems:items});
  }
});
});

//lists collections.............................................................

const listSchema=new mongoose.Schema
({
  name:String,
  items:[itemsSchema]
});

const list=mongoose.model("list",listSchema)

//CustomList-starts....................................................................

app.get("/:customListName",function(req,res)
{
  const customListName=_.capitalize(req.params.customListName);  //capitalize method in lodash helps to capitalize first letter and converts the rest to lowercase.
  list.findOne({name:customListName},function(err,foundList)
{
  if(!err)
{
list.countDocuments({name:customListName},function(err,count)
{
  if(!err)
  {
    if(count===0)
    {
      const newList=new list
      ({
        name:customListName,
        items:defaultItems
    });
    newList.save();
    res.render("list",{listTitle:customListName,newListItems:newList.items});
    }
    else
    {
  res.render("list",{listTitle:customListName,newListItems:foundList.items});
    }
    }
    });
  }
});
});


app.post("/",function(req,res)
 {
   var submitButton=req.body.list;
   var items=req.body.newItem;
  const item4=new item({name:items});
  if(submitButton==="Today")
  {
  item4.save();
  res.redirect("/");
   }
   else
   {
     list.findOne({name:submitButton},function(err,foundList)
   {
     foundList.items.push(item4);
     foundList.save();
     res.redirect("/"+submitButton);
   });
   }
 }
);

app.post("/delete",function(req,res)
{
const removeitem=req.body.deleteItem;
if(req.body.listname==="Today")
{
item.findByIdAndRemove(removeitem,function(err)
{
  if(err)
  {
    console.log(err);
  }
  else
  {
    console.log("success");
    res.redirect("/");
  }
});
}
else
{
list.findOneAndUpdate({name:req.body.listname},{$pull:{items:{_id:removeitem}}},function(err,foundList)   //$pull:helps in pulling out an elemnt from an array using the specified condition
{
  if(!err)
  {
    res.redirect("/"+req.body.listname);
  }
});
}
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,funtion()
{
  console.log("Server started on port 3000.");
});
