// const { Schema, model } = require('mongoose')
import { Schema, model, SchemaTypes } from 'mongoose'
const objId = SchemaTypes.ObjectId

const EventSchema = new Schema({
    name: String,
    since: String,
    until: String,
    place: String,
    image:String,
    categories: [{
        name: String,
        wods: [String]
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

