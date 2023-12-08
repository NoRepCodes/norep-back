import cloudinary from './cloudinary'

export const uploadImage = async (img) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(img, {})
  return { secure_url, public_id }
}

export const uploadImages = async (arrImages) => {
  const sendImg = (base64) => {
    return new Promise(async (res, rej) => {
      res(await uploadImage(base64))
    })
  }
  let images = await Promise.all(arrImages.map(img => sendImg(img)))

  return images
}

export const deleteImage = async (public_id) => {
  await cloudinary.uploader.destroy(public_id)
  // .then(() => true).catch(() => false)
}

export const deleteImages = async (arrImages) => {
  const sendImg = (public_id) => {
    return new Promise(async (res, rej) => {
      res(await deleteImage(public_id))
    })
  }
  await Promise.all(arrImages.map(public_id => sendImg(public_id)))

  return true
}