import Event from "../models/eventSchema";
import User from "../models/userSchema";
import Team from "../models/t";
import { RequestHandler } from "express";
import dotenv from "dotenv";
import { EventType } from "../types/event.t";
import Wod from "../models/wodSchema";
//@ts-ignore
import bcrypt from "bcrypt";
//@ts-ignore
import nodemailer from "nodemailer";
import Admin from "../models/adminSchema";
dotenv.config();
const debug = false;

//$2b$10$YIl/HIE6qH8xNC0pj5zEk.75f17UAS1dGArA0xUNqU6fUHBcp8Pye
export const uri: RequestHandler = async (req, res) => {
  if (debug) console.log("#test");

    let password = bcrypt.hashSync('27378819', bcrypt.genSaltSync(10));
    console.log(password);
  /**{
        'categories.name':1,
        'categories.teams':[{
            name:1,
            users:[{}],
        }],
    } */
  // const ev = await Event.find(
  //   { _id: "678f0ae60a3e3d5d3ef56586" },
  //   {
  //     "categories.name": 1,
  //     "categories.teams": 1,
  //   }
  // ).populate("categories.teams.users", "name");
  res.send('ok');
};
export const test: RequestHandler = async (req, res) => {
  if (debug) console.log("#test");

  // const result = await Event.find({ _id: "6656396c8f027cee3e114e68", 'categories.teams': { $exists: true, $type: 'array', $ne: [] } })
  // res.send('version 2.1.3')
  // res.send('NOREP ONLINE')
  res.send(process.env.MONGODB_URI);
};

export const getEvents: RequestHandler = async (req, res) => {
  if (debug) console.log("#getEvents");
  try {
    const events = await Event.find().lean();
    events.sort((a,b)=>{
      const dateA = new Date(a.since).valueOf()
      const dateB = new Date(b.since).valueOf()
      if(dateA < dateB) return -1
      if(dateA > dateB) return 1
      return 0
    })
    res.send(events);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};
export const getEventsPlusTeams: RequestHandler = async (req, res) => {
  if (debug) console.log("#getEventsPlusTeams");
  try {
    const events = await Event.find();
    const teams = await Team.find();

    let data = [events, teams];
    res.send(data);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

// export const getStart = async (req,res)=>{
//     if(debug) console.log('#getStart')
//     try {
//         const events = await Event.find()

//         let data = [events,+moment()]
//         res.send(data)
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
// }

export const getEventPlusWods: RequestHandler = async (req, res) => {
  if (debug) console.log("#getEventPlusWods");
  try {
    const { _id } = req.query;
    const events: EventType[] = await Event.find().lean();
    // console.log(events)
    const event: EventType | undefined = events.find(
      (ev) => ev._id.toString() === _id
    );
    if (event === undefined)
      res.status(404).json({ msg: "Evento no encontrado" });
    else {
      let categories = event.categories.map((c) => c._id);
      const wods = await Wod.find({ category_id: { $in: categories } });
      // let data = [events, +moment()]
      res.send({ events, wods });
    }
    // res.send("ok")
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const getWods: RequestHandler = async (req, res) => {
  if (debug) console.log("#getWods");
  try {
    const { categories } = req.body;
    const wods = await Wod.find({ category_id: { $in: categories } });
    res.send(wods);
    // res.send("ok")
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const toggleUpdating: RequestHandler = async (req, res) => {
  if (debug) console.log("#toggleUpdating");
  try {
    const { event_id, state } = req.body;
    const result = await Event.findOneAndUpdate(
      { _id: event_id },
      { $set: { updating: state } }
    );
    res.send(result);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const searchTeam: RequestHandler = async (req, res) => {
  if (debug) console.log("#loginAdmin");
  try {
    const { searchName } = req.body;
    const result = await Team.find({
      name: new RegExp(searchName, "i"),
    });
    res.send(result);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const cleanDupl: RequestHandler = async (req, res) => {
  if (debug) console.log("#cleanDupl");
  // res.send('ok')
  try {
    const result = await Team.find();
    result.forEach((teamx) => {
      result.forEach(async (t) => {
        //@ts0ignore
        if (
          teamx.name === t.name &&
          teamx.category_id === t.category_id &&
          teamx.event_id === t.event_id
        ) {
          if (teamx.createdAt < t.createdAt) {
            await Team.deleteOne({ _id: t._id });
          }
        }
      });
    });
    res.send("ok");
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const getLatestEvent: RequestHandler = async (req, res) => {
  if (debug) console.log("#getLatestEvent");
  try {
    const result = await Event.find({}).sort({ updatedAt: -1 }).limit(1);
    res.send(result[0]);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const getEventTable: RequestHandler = async (req, res) => {
  if (debug) console.log("#getEventTable");
  try {
    const { _id } = req.query;

    // const event: EventType = await Event.findById(_id).populate('categories.teams.users','name phone card_id');
    const event: EventType = await Event.findById(_id);
    if (event === undefined)
      res.status(404).json({ msg: "Evento no encontrado" });
    else {
      let categories = event.categories.map((c) => c._id);
      const wods = await Wod.find({ category_id: { $in: categories } });
      // let data = [events, +moment()]
      res.send({ event, wods });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getEmailExist: RequestHandler = async (req, res) => {
  if (debug) console.log("#getEmailExist");
  try {
    const { email, code } = req.query;
    if(!code || typeof code !== 'string') throw new Error("Código inexistente");
    const user = await User.findOne({ email }, { name: 1, email: 1 });
    if (user) {
      
      let transporter = nodemailer.createTransport({
        service: "yahoo",
        auth: {
          user: "norep.code@yahoo.com",
          pass: "lgippxsozkcbrovy",
        },
      });
      let mailOptions = {
        from: "norep.code@yahoo.com",
        to: user.email,
        subject: `Recuperación de contraseña`,
        html: passEmail(user.name, code),
      };
      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          throw new Error("No se ha podido enviar el correo.");
        } else {
          res.send({ itExist: true });
        }
      });
    } else res.status(404).json({ msg: "El correo ingresado no existe." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const changePassword: RequestHandler = async (req, res) => {
  if (true) console.log("#changePassword");
  try {
    const { email, password: pass } = req.body;
    let password = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
    const user = await User.findOneAndUpdate({ email }, { password });
    if (user) res.send(true);
    else res.status(404).json({ msg: "No se ha encontrado al usuario." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// export const namehere = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// }

const passEmail = (name: string, code: string) => {
  return `<body>
    <div style="width:500px;padding:2em;box-sizing:border-box">
      <h1 style="font-family: sans-serif; font-weight: 600;font-style: normal;color: black;" >${name}</h1>
      <p style="font-family: sans-serif; color: black;margin: 0;" >Código solicitado para el cambio de contraseña:</p>
      <h1 style="text-decoration: underline #F1FF48 10px;font-family:  sans-serif;font-weight: 600;font-style: normal;color: black;" >${code}</h1>
      <p style="font-family: sans-serif; color: black;margin: 0;" >Si usted no ha solicitado el cambio de contraseña ignore este mensage.</p>
    </div>
  </body>`;
};



export const eventsWithInfo: RequestHandler = async (req, res) => {
  if (debug) console.log("#getEvents");
  try {
    const {cacheUser,cacheAdmin} = req.body
    const events = await Event.find().lean();
    const user = cacheUser ? await User.findById(cacheUser,{password:0}) :undefined
    const admin = cacheAdmin ? await Admin.findById(cacheAdmin,{password:0}) :undefined
    res.send({events,user,admin});
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};