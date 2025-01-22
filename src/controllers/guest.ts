// deno-lint-ignore-file no-explicit-any
import Event from "../models/eventSchema.ts"
import Team from "../models/t.ts"
import { EventType } from "../types/event.t.ts";
import Wod from "../models/wodSchema.ts";
import { ReqRes } from "../helpers/utils.ts";
const debug = false


export const uri: ReqRes =  (_, res) => {
    if (debug) console.log('#test')

    // res.send(process.env.MONGODB_URI)
    res.send('ok')
}
export const test: ReqRes =  (_, res) => {
    if (debug) console.log('#test')

    // const result = await Event.find({ _id: "6656396c8f027cee3e114e68", 'categories.teams': { $exists: true, $type: 'array', $ne: [] } })
    // res.send('version 2.1.3')
    res.send('NOREP ONLINE')
    // res.send(Deno.env.get('MONGODB_URI'))
}

export const getEvents: ReqRes = async (_, res) => {
    if (debug) console.log('#getEvents')
    try {
        const events = await Event.find().lean()
        res.send(events)
    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}
export const getEventsPlusTeams: ReqRes = async (_, res) => {
    if (debug) console.log('#getEventsPlusTeams')
    try {
        const events = await Event.find()
        const teams = await Team.find()

        const data = [events, teams]
        res.send(data)
    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}

// export const getStart = async (req,res)=>{
//     if(debug) console.log('#getStart')
//     try {
//         const events = await Event.find()

//         let data = [events,+moment()]
//         res.send(data)
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
// }

export const getEventPlusWods: ReqRes = async (req, res) => {
    if (debug) console.log('#getEventPlusWods')
    try {
        const { _id } = req.query
        //@ts-ignore IDK MAN, IM SCARED
        const events: EventType[] = await Event.find().lean()
        // console.log(events)
        const event: EventType | undefined = events.find(ev => ev._id.toString() === _id)
        if (event === undefined) res.status(404).json({ msg: "Evento no encontrado" })
        else {
            const categories = event.categories.map(c => c._id)
            const wods = await Wod.find({ category_id: { '$in': categories } })
            // let data = [events, +moment()]
            res.send({ events, wods })
        }
        // res.send("ok")
    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}

export const getWods: ReqRes = async (req, res) => {
    if (debug) console.log('#getWods')
    try {
        const { categories } = req.body
        const wods = await Wod.find({ category_id: { '$in': categories } })
        res.send(wods)
        // res.send("ok")
    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}



export const toggleUpdating: ReqRes = async (req, res) => {
    if (debug) console.log('#toggleUpdating')
    try {
        const { event_id, state } = req.body
        const result = await Event.findOneAndUpdate({ _id: event_id }, { $set: { updating: state } })
        res.send(result)

    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}


export const searchTeam: ReqRes = async (req, res) => {
    if (debug) console.log('#loginAdmin')
    try {
        const { searchName } = req.body
        const result = await Team.find({
            name: new RegExp(searchName, "i")
        })
        res.send(result)

    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}

export const cleanDupl: ReqRes = async (_, res) => {
    if (debug) console.log('#cleanDupl')
    // res.send('ok')
    try {
        const result = await Team.find()
        result.forEach(teamx => {
            result.forEach(async (t) => {
                //@ts0ignore
                if (teamx.name === t.name && teamx.category_id === t.category_id && teamx.event_id === t.event_id) {
                    if (teamx.createdAt < t.createdAt) {
                        await Team.deleteOne({ _id: t._id })
                    }
                }

            })
        });
        res.send('ok')
    } catch (error:any) {
        res.status(400).json({ msg: error.message })
    }
}


export const getLatestEvent:ReqRes = async (_,res)=>{
    if(debug) console.log('#getLatestEvent')
    try {
        const result = await Event.find({}).sort({updatedAt:-1}).limit(1)
        res.send(result[0])
    } catch (error:any) {
        res.status(400).json({ msg: error.message })
    }

}
// export const namehere = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// }
