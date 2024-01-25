import Event from "../models/eventSchema"
import Team from "../models/teamSchema"
import { deleteImage, deleteImages, uploadImage, uploadImages } from "../helpers/uploadImages";
import moment from "moment/moment";
import dotenv from 'dotenv'
dotenv.config()

export const test = (req, res) => {


    console.log('#test')
    res.send('Proximamente No rep!!!')
    // res.send(process.env.MONGODB_URI)
}

export const createEvent = async (req, res) => {
    console.log('#createEvent')
    try {
        const { name, since, until, place, base64, categories, } = req.body
        const { secure_url, public_id } = await uploadImage(base64)
        const result = await Event.create({ name, 
            since:moment(since).unix(), 
            until:moment(until).unix(),
             place, image_url: secure_url, image_id: public_id, categories, wods: [],updating:false })
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(400).json({ msg: error.message })
    }
}
export const deleteEvent = async (req, res) => {
    console.log('#deleteEvent')
    try {
        const { _id, password } = req.body
        const result = await Event.deleteOne({ _id })
        if (result.deletedCount > 0) return res.send(result)
        else return res.status(404).json({ msg: 'Evento no encontrado' })

    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
    res.send('ok')
}
export const updateEvent = async (req, res) => {
    console.log('#updateEvent')
    try {
        const { _id, name, since, until, place, image } = req.body
        const result = await Event.findOneAndUpdate({ _id }, { name, since, until, place, image }, { new: true })
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
export const getEvents = async (req, res) => {
    console.log('#getEvents')
    try {
        const events = await Event.find()
        res.send(events)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
export const getEventsPlusTeams = async (req, res) => {
    console.log('#getEventsPlusTeams')
    try {
        const events = await Event.find()
        const teams = await Team.find()

        let data = [events, teams]
        res.send(data)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

// export const getStart = async (req,res)=>{
//     console.log('#getStart')
//     try {
//         const events = await Event.find()

//         let data = [events,+moment()]
//         res.send(data)
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
//     }
// }

export const getEventsHome = async (req, res) => {
    console.log('#getEventsHome')
    try {
        const events = await Event.find()
        // let today = moment()
        // let ongoing = []
        // let future = []
        // events.forEach(event => {
        //     let days = moment.unix(event.until).diff(today, 'days')
        //     if (days <= 7 && days >= 0) ongoing.push(event)
        //     else if (days > 7) future.push(event)
        // })

        let data = [events, +moment()]
        res.send(data)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}


export const updateCategory = async (req, res) => {
    console.log('#updateCategory')
    try {
        const { event_id, category_id, name } = req.body
        const query = { _id: event_id, 'categories._id': category_id }
        const result = await Event.findOneAndUpdate(query, {
            $set: { "categories.$.name": name }
        }, { new: true })
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const addCategory = async (req, res) => {
    console.log('#addCategory')
    try {
        const { event_id, name } = req.body
        const query = { _id: event_id }
        const result = await Event.findOneAndUpdate(query, {
            $push: { categories: { name } }
        }, { new: true })
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const deleteCategory = async (req, res) => {
    console.log('#deleteCategory')
    try {
        const { event_id, category_id } = req.body
        const query = { _id: event_id }
        const result = await Event.findOneAndUpdate(query, {
            $pull: { categories: { _id: category_id } }
        }, { new: true })
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const updateWods = async (req, res) => {
    console.log('#updateWods')
    try {
        const { event_id, category_id, wods } = req.body
        const query = { _id: event_id, 'categories._id': category_id }
        const result = await Event.findOneAndUpdate(query, {
            $set: { "categories.$.wods": wods }
        }, { new: true })
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

const uploadTeam = async (event_id, category_id, team)=>{
    return new Promise(async (res, rej) => {
        res(await Team.create({event_id, category_id, name:team.name,box:team.box,wods:[]}))
      })
}

export const addTeams = async (req, res) => {
    console.log('#addTeams')
    try {
        const { event_id, category_id, teams } = req.body

        let results = await Promise.all(teams.map(team => uploadTeam(event_id, category_id, team)))
        // const result = await Team.create({ event_id, category_id, name, wods: [] })
        // console.log(results)
        // const newResult = results.map((r,i)=>{
        //     console.log(r)
        //     return {}
        // })
        res.send(results)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const deleteTeam = async (req, res) => {
    console.log('#deleteTeam')
    try {
        const { _id } = req.body
        const result = await Team.deleteOne({ _id })
        if (result.deletedCount > 0) return res.send(result)
        else return res.status(404).json({ msg: 'Equipo no encontrado' })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
export const updateTeam = async (req, res) => {
    console.log('#updateTeam')
    try {
        const { _id, name } = req.body
        const result = await Team.findOneAndUpdate({ _id }, { name }, { new: true })
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const addWods = async (req, res) => {
    console.log('#addWods')
    try {
        const { teams, wod_index } = req.body

        const updateTeam = (team) => {
            const {_id,...wod} = team
            return new Promise(async (res, rej) => {
                res(await Team.findOneAndUpdate({ _id }, {
                    $set: { [`wods.${wod_index}`]: wod }
                }, { new: true }))
            })
        }
        let results = await Promise.all(teams.map(team => updateTeam(team)))
        res.send(results)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
export const findTeams = async (req, res) => {
    console.log('#findTeams')
    try {
        const { event_id } = req.body
        const result = await Team.find({ event_id })
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const toggleUpdating = async (req, res) => {
    console.log('#toggleUpdating')
    try {
        const { event_id,state } = req.body
        const result = await Event.findOneAndUpdate({_id: event_id},{$set:{updating:state}})
        res.send(result)
        
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}



// export const namehere = async (req,res)=>{
//     console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
//     }
// }
//     res.send('ok')
// }
