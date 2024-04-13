import { Schema, model, SchemaTypes } from 'mongoose'
const objId = SchemaTypes.ObjectId

const TeamSchema = new Schema({
    name: String,
    category_id: String,
    event_id: String,
    box:String,
    wods:[{
        amount:Number,
        amount_type:String,
        time:Number,
        tiebrake:Number,
        penalty:Number
    }]
},
    {
        timestamps: true,
    }
);

export default model('Team', TeamSchema)

