import { Schema, model, SchemaTypes } from 'mongoose'
const objId = SchemaTypes.ObjectId

const AdminSchema = new Schema({
    username: String,
    password: String,
},
    {
        timestamps: true,
    }
);

export default model('Admin', AdminSchema)

