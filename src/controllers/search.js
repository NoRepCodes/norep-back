import Event from "../models/eventSchema"
import Team from "../models/teamSchema"
import { deleteImage, deleteImages, uploadImage, uploadImages } from "../helpers/uploadImages";


export const test = (req, res) => {


    console.log('#test')
    res.send('Proximamente No rep!!!')
}

export const createEvent = async (req, res) => {
    console.log('#createEvent')
    try {
        const { name, since, until, place, image, categories, wods } = req.body
        const result = await Event.create({ name, since, until, place, image, categories, wods })
        res.send(result)
    } catch (error) {
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
    console.log('#searchEvents')
    try {
        const events = await Event.find()
        res.send(events)
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



export const addTeam = async (req, res) => {
    console.log('#addTeam')
    try {
        const { event_id, category_id, name } = req.body
        const result = await Team.create({ event_id, category_id, name, wods: [] })
        res.send(result)
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
        const {_id, name } = req.body
        const result = await Team.findOneAndUpdate({_id},{name},{new:true})
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const addPoints = async (req, res) => {
    console.log('#addPoints')
    try {
        const { _id, wods } = req.body
        // const query = {_id:event_id,'categories._id':category_id,'cateogires.teams._id':team_id}
        const result = await Team.findOneAndUpdate({_id},{wods},{new:true})
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
