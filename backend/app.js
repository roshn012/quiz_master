const express=require('express')
const app=express()
const port=5000
require('dotenv').config()
const cors=require('cors')
app.use(cors())
const jwt=require('jsonwebtoken')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const connectDB=require('./connection')


const questionRoute=require('./routes/questionRoute')
const quizRoute=require('./routes/quizRoutes')
const resultRoute=require('./routes/resultRoutes')
const feedbackRoute=require('./routes/feedbackRoutes')
const authRoute=require('./routes/authRoutes')
const adminRoute=require('./routes/adminRoutes')
const aiRoute=require('./routes/aiRoutes')
connectDB()

app.use('/quizzes',quizRoute)
app.use('/questions',questionRoute)
app.use('/results',resultRoute)
app.use('/feedback',feedbackRoute)
app.use('/user',authRoute)
app.use('/admin',adminRoute)
app.use('/ai', aiRoute)
const path = require('path')
// This serves the built React app (which we will copy into a 'build' folder)
app.use(express.static(path.join(__dirname, 'build')));

// This makes sure that any non-API route serves the React app
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(port,()=>{
    console.log(`app is listening at ${port}`)
})