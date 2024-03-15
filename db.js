import { connect,set } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const testhere = process.env.MONGODB_URI_TEST

const connectDB = async () => {
  try {
    set("strictQuery", false);

    await connect(testhere)

      .then(db => console.log('Database is connected'))
      .catch(err => console.log(err))

  } catch (error) {
    console.log(error)
  }

}

connectDB()

