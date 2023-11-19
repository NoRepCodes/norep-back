import User from "../models/userSchema"
import { deleteImage, deleteImages, uploadImage, uploadImages } from "../helpers/uploadImages";


export const test = (req, res) => {


    console.log('#test')
    res.send('Proximamente No rep!!!')
}


// export const namehere = async (req,res)=>{
//     console.log('#namehere')
//     res.send('ok')
// }
