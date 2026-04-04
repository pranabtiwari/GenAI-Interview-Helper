import express from "express"
import user from '../routes/user.routes.js'
import page from '../routes/page.routes.js'
import interView from '../routes/interview.routes.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api', user)
app.use('/api', page)
app.use('/api', interView)

app.get("/", (req, res)=> {
    res.send("hello")
})

export default app