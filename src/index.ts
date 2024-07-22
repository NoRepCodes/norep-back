import express from 'express'
import routeGuest from './routes/guest.routes'
import routeEvent from './routes/event.routes'
import routeUser from './routes/user.routes'
//@ts-ignore
import cors from 'cors'
import './db'
const app = express()

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: "*",
}));



app.use(routeEvent)
app.use(routeUser)
app.use(routeGuest)

app.listen(process.env.PORT || 4000, () => {
    console.log('Server listen on port', 4000)
})

// TO DO ✅ ❌ ⏳ ❓
/**
 * Migrate everything to Ts: ⏳
 * - Event controller + router ✅  
 * - - Create Event ✅
 * - - Update Event ✅
 * - - Delete Event ✅
 * 
 * - - Create Category ➰ Update Event
 * - - Update Category ➰ Update Event
 * - - Delete Category ➰ Update Event
 * 
 * - - Create Wod ✅
 * - - Update Wod ✅
 * - - Delete Wod ⏳
 * 
 * - - Create Team -- Evaluate if there is captain|gt > 1 user, to see if name? captain?
 * - - - - Check if there is users in other teams 
 * 
 * - - Update Team ❓
 * - - Delete Team ❓
 * 
 * - - Create Result ✅
 * - - Update Result ✅
 * - - Delete Result
 * 
 * - - Get User Records ⏳
 * 
 * 
 * - Guest controller + router ⏳  
 * - User controller + router ✅
 * 
 * - Event Types ✅
 * - User Types ✅
 * 
 * -- SEE VERCEL USAGE AND TAKE ACTIONS
 * - REDUCE BANDWITH COMPRESSING IMAGES
 * 
 * // {
//     "version": 2,
//     "builds": [
//       {
//         "src": "./index.js",
//         "use": "@vercel/node"
//       }
//     ],
//     "routes": [
//       {
//         "src": "/(.*)",
//         "dest": "/"
//       }
//     ]
// }
 */