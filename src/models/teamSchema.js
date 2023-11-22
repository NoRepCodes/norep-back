import { Schema, model, SchemaTypes } from 'mongoose'
const objId = SchemaTypes.ObjectId

const TeamSchema = new Schema({
    name: String,
    category_id: String,
    event_id: String,
    wods:[{
        points:Number,
        amount:Number,
        amount_type:String,
    }]
},
    {
        timestamps: true,
    }
);

export default model('Team', TeamSchema)

