import express from 'npm:express'
import "jsr:@std/dotenv/load";
import routeGuest from './routes/guest.routes.ts'
import routeEvent from './routes/event.routes.ts'
import routeUser from './routes/user.routes.ts'
//@ts-ignore av
// import cors from 'cors'
import './db.ts'
const app = express()

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
// app.use(cors({
//     origin: "*",
// }));



app.use(routeEvent)
app.use(routeUser)
app.use(routeGuest)

app.listen(Deno.env.get("PORT") || 4000, () => {
    console.log('Server listen on port', 4000)
})

/**
deno run -A --watch src/index.ts
 */
// TO DO ✅ ❌ ⏳ ❓
/**
 * 
 */