// const { Schema, model } = require('mongoose')
import { Schema, model, SchemaTypes } from 'mongoose'
const objId = SchemaTypes.ObjectId

const EventSchema = new Schema({
    name: String,
    since: Number,
    until: Number,
    place: String,
    secure_url: String,
    public_id: String,
    updating: Boolean,
    accesible:Boolean,
    partners: Array,
    categories: [{
        type: new Schema({
            name: String,
            wods: [{
                name: String,
                time_cap: Number,
                amount_cap: Number,
                amount_type: String,
                wod_type: Number,
            },]
        },{ timestamps: true })
    }],
},
    {
        timestamps: true,
    }
);
/// WODS GUIDE 1=AMRAP 2=FORTIME 3=RM 4=CIRCUIT

// EventSchema.methods.changeName = function () {
//     return this.name = 'Testing here'
// }

export default model('Event', EventSchema)

