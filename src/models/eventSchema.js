// const { Schema, model } = require('mongoose')
import { Schema, model, SchemaTypes } from 'mongoose'
const objId = SchemaTypes.ObjectId

const EventSchema = new Schema({
    name: String,
    since: Number,
    until: Number,
    place: String,
    image_url: String,
    image_id: String,
    updating: Boolean,
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

// EventSchema.methods.changeName = function () {
//     return this.name = 'Testing here'
// }

export default model('Event', EventSchema)

