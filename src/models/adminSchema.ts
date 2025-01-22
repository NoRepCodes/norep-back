import { Schema, model } from 'npm:mongoose'

const AdminSchema = new Schema({
    username: String,
    password: String,
},
    {
        timestamps: true,
    }
);

export default model('Admin', AdminSchema)

