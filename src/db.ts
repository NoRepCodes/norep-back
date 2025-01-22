// deno-lint-ignore-file no-explicit-any
//@ts-ignore idk why this sht doesnt load connect
import { connect, set } from "npm:mongoose";

const connectDB = async () => {
  try {
    const uri = Deno.env.get("MONGODB_URI");
    if (!uri) throw new Error("MONGO DB URI NOT FOUND");
    set("strictQuery", false);
    await connect(uri)
      .then(() => console.log("Database is connected"))
      .catch((err: any) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

await connectDB();
