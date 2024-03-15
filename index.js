import express from 'express'
import router from './src/routes/search.routes'
import cors from 'cors'
import './db'
const app = express()

// new try
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: "*",
}));



app.use(router)

app.listen(4000, () => {
    console.log('Server listen on port', 4000)
})