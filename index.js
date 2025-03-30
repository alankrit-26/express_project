import express from 'express'
import readline from 'readline'
import {PORT} from './p.js'

const r1=readline.createInterface({
    input:process.stdin,
    output:process.stdout
})
const app=express();
app.get('/contact',(req,res)=>{
    return res.send(`<h1>I want to see how page work on user input</h1>`)
})
// const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server Started at PORT ${PORT}`)
})