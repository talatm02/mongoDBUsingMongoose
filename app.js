const express = require('express');
const mongoose = require('mongoose');

const app = express();

//localhost mongo connection
mongoose.connect('mongodb://127.0.0.1:27017/school')

//if connection fail
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

//Student schmena
const studentSchema = mongoose.Schema({
    _id:Number,
    name:String,
    scores:Array
}) 

//Student Model to update
const Model = mongoose.model('Student', studentSchema);

//Get All Studentds
Model.find({},{scores:1},{lean:true},(err,students)=>{
    students.forEach((student) => {
        const index = student.scores
            .sort((prev,next)=>{return next.score < prev.score;}) //Sort the Scores of the Students in Ascending order
            .findIndex((item,index)=>{return item.type=="homework"}) //Find the lowest homeword score
        student.scores.splice(index,1); //removing it
        //Updating the Students Scores array with latest array.
        Model.update({_id:student._id},{$push:{scores:{ $each:student.scores,$slice: -3}}},(err, res)=>{
            if(err) console.log(err);
            console.log(res);
        })
    });
})

//Running server on port 3000
app.listen(3000,()=>{
    console.log("server started");
})