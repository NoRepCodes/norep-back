import Event from "../models/eventSchema"
import Team from "../models/teamSchema"
import Admin from "../models/adminSchema"
import { deleteImage, deleteImages, uploadImage, uploadImages } from "../helpers/uploadImages";
import moment from "moment/moment";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()
const debug = false
export const test = (req, res) => {


    if (debug) console.log('#test')
    res.send('Proximamente No rep!!!')
    // res.send(process.env.MONGODB_URI_TEST)
}

export const createEvent = async (req, res) => {
    if (debug) console.log('#createEvent')
    try {
        const { name, since, until, place, accesible, base64, categories, partners: pimages } = req.body
        const { secure_url, public_id } = await uploadImage(base64)
        const partners = await uploadImages(pimages)
        const result = await Event.create({
            name,
            since: moment(since).unix(),
            until: moment(until).unix(),
            place, secure_url, public_id, accesible, categories, wods: [], partners, updating: false
        })
        res.send(result)
        // console.log(req.body)
        // res.status(400).json({ msg: 'test' })
    } catch (error) {
        console.log(error)
        res.status(400).json({ msg: error.message })
    }
}
export const deleteEvent = async (req, res) => {
    if (debug) console.log('#deleteEvent')
    try {
        const { event } = req.body
        const result = await Event.deleteOne({ _id: event._id })
        if (result.deletedCount > 0) {
            await deleteImage(event.public_id)
            let aux = []
            event.partners.forEach(p => {
                aux.push(p.public_id)
            });
            await deleteImages(aux)
            return res.send(result)
        }
        else return res.status(404).json({ msg: 'Evento no encontrado' })

    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
    res.send('ok')
}
export const updateEvent = async (req, res) => {
    if (debug) console.log('#updateEvent')
    try {
        const { name, since, until, place, accesible, image, categories, partners: pimages, toDelete, _id, categToDelete } = req.body
        const { secure_url, public_id } = await uploadImage(image)
        const partners = await uploadImages(pimages)
        await deleteImages(toDelete)
        console.log(categories)
        const result = await Event.findOneAndUpdate({ _id }, {
            $set: {
                name,
                since: moment(since).unix(),
                until: moment(until).unix(),
                place, secure_url, public_id, accesible, categories, partners
            }
        }, { new: true })
        await categToDelete.map(async (categ) => {
            await Team.deleteMany({ category_id: categ })
            return
        })

        res.send(result)
        // console.log(req.body)
        // res.status(400).json({ msg: 'test' })
    } catch (error) {
        console.log(error)
        res.status(400).json({ msg: error.message })
    }
}
export const getEvents = async (req, res) => {
    if (debug) console.log('#getEvents')
    try {
        const events = await Event.find()
        res.send(events)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
export const getEventsPlusTeams = async (req, res) => {
    if (debug) console.log('#getEventsPlusTeams')
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
//     if(debug) console.log('#getStart')
//     try {
//         const events = await Event.find()

//         let data = [events,+moment()]
//         res.send(data)
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
//     }
// }

export const getEventsHome = async (req, res) => {
    if (debug) console.log('#getEventsHome')
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
    if (debug) console.log('#updateCategory')
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
    if (debug) console.log('#addCategory')
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
    if (debug) console.log('#deleteCategory')
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
    if (debug) console.log('#updateWods')
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

const uploadTeam = async (event_id, category_id, team) => {
    return new Promise(async (res, rej) => {
        res(await Team.create({ event_id, category_id, name: team.name, box: team.box, wods: [] }))
    })
}
const removeTeam = async (_id) => {
    return new Promise(async (res, rej) => {
        res(await Team.findOneAndDelete({ _id }))
    })
}

const editTeam = async (category_id, team) => {
    return new Promise(async (res, rej) => {
        res(await Team.findOneAndUpdate({ category_id, _id: team._id }, {
            $set: {
                name: team.name,
                box: team.box,
            }
        }, { new: true }))
    })
}

export const addTeams = async (req, res) => {
    if (debug) console.log('#addTeams')
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
    if (debug) console.log('#deleteTeam')
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
    if (debug) console.log('#updateTeam')
    try {
        const { _id, name } = req.body
        const result = await Team.findOneAndUpdate({ _id }, { name }, { new: true })
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
export const editTeams = async (req, res) => {
    if (debug) console.log('#editTeams')
    try {
        const { event_id, category_id, teams, toDelete } = req.body
        await Promise.all(teams.map(async (team) => {
            if (team.new) await uploadTeam(event_id, category_id, team)
            else await editTeam(category_id, team)
        }))
        await Promise.all(toDelete.map(id => removeTeam(id)))

        const result = await Team.find({ event_id })
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const addWods = async (req, res) => {
    if (debug) console.log('#addWods')
    try {
        const { teams, wod_index } = req.body

        const updateTeam = (team) => {
            const { _id, ...wod } = team
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
    if (debug) console.log('#findTeams')
    try {
        const { event_id } = req.body
        const result = await Team.find({ event_id })
        res.send(result)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const toggleUpdating = async (req, res) => {
    if (debug) console.log('#toggleUpdating')
    try {
        const { event_id, state } = req.body
        const result = await Event.findOneAndUpdate({ _id: event_id }, { $set: { updating: state } })
        res.send(result)

    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}



export const createAdmin = async (req, res) => {
    if (debug) console.log('#createAdmin')
    try {
        const { username, pass } = req.body
        bcrypt.hash(pass, 7, async (err, hash) => {
            // Store hash in your password DB.
            console.log(hash)
            const result = await Admin.create({ username, password: hash })
            res.send(result)
        });
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const deleteAdmin = async (req, res) => {
    if (debug) console.log('#createAdmin')
    try {
        const { _id } = req.body
        const result = await Admin.delete({ _id })
        res.send(result)

    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const loginAdmin = async (req, res) => {
    if (debug) console.log('#loginAdmin')
    try {
        const { username, password } = req.body
        const adm = await Admin.findOne({ username })
        if (adm) {
            console.log('ok?0')
            bcrypt.compare(password, adm.password).then(function (result) {
                console.log('ok?1')
                if (result) {
                    res.send({
                        username: adm.username,
                        _id: adm._id
                    })
                } else {
                    res.status(404).json({ msg: 'Usuario o contraseña incorrectos' })
                }
            });

        }
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}




// export const namehere = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
//     }
// }
//     res.send('ok')
// }
