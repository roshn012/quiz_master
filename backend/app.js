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
connectDB()

app.use('/quizzes',quizRoute)
app.use('/questions',questionRoute)
app.use('/results',resultRoute)
app.use('/feedback',feedbackRoute)
app.use('/user',authRoute)
app.use('/admin',adminRoute)

app.listen(port,()=>{
    console.log(`app is listening at ${port}`)
})