import { RequestHandler } from "express";
import Event from "../models/eventSchema";
import { CategoryType, EventType } from "event.t";
//@ts-ignore
import bcrypt from "bcrypt";
import Admin from "../models/adminSchema";
import Ticket from "../models/ticketSchema";
import User from "../models/userSchema";
//@ts-ignore
// import nodemailer from "nodemailer";

import { Resend } from "resend";

const debug = false;

export const getTeamInfo: RequestHandler = async (req, res) => {
  if (debug) console.log("#getTeamInfo");
  try {
    const { _id } = req.query;
    if (!_id) throw new Error("Equipo inexistente");
    const event = await Event.findOne(
      { "categories.teams._id": _id },
      { "categories.teams.$": 1 }
    ).populate("categories.teams.users", "name phone card_id age birth genre");
    if (!event) res.status(404).json({ msg: "Equipo no encontrado" });
    //@ts-ignore
    const team = event.categories[0].teams.find((t) => t._id == _id);
    res.send(team);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};
export const updateTeamInfo: RequestHandler = async (req, res) => {
  if (debug) console.log("#updateTeamInfo");
  try {
    const { team, categoryIdToPush, cards } = req.body;

    if (cards) {
      const users = await User.find({ card_id: cards }, { _id: 1 });
      const userList = users.map((u) => u._id);
      console.log("here?");
      if (userList.length !== cards.length)
        throw { message: "Usuario no encontrado" };
      console.log("or here?");
      team.users = userList;
    }

    const event: EventType = await Event.findOne({
      "categories.teams._id": team._id,
    });
    if (categoryIdToPush) {
      event.categories.forEach((c: CategoryType, i) => {
        c.teams.forEach((t, index) => {
          if (t._id.toString() === team._id) {
            event.categories[i].teams.splice(index, 1);
            event.categories[i].slots = event.categories[i].slots - 1;
          }
        });
        if (c._id.toString() === categoryIdToPush) {
          event.categories[i].teams.push({ ...team });
          event.categories[i].slots = event.categories[i].slots + 1;
        }
      });
      // return res.send(event);
    } else {
      event.categories.forEach((c: CategoryType, i) => {
        c.teams.forEach((t, index) => {
          if (t._id.toString() === team._id)
            event.categories[i].teams[index] = team;
        });
      });
      // res.send(event);
    }
    //@ts-ignore
    await event.save();
    res.send({ msg: "Equipo actualizado con exito!" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

// export const updateTeamInfo: RequestHandler = async (req,res) =>{
//   if (debug) console.log("#updateTeamInfo2");
//   try {
//     const {categ_id,tname,cards,team_id} = req.body
//     const users = await User.find({card_id:cards},{_id:1})
//     const userList = users.map((u)=>u._id)
//     res.send(userList)
//   } catch (error: any) {
//     res.status(400).json({ msg: error.message });
//   }
// }

export const loginAdmin: RequestHandler = async (req, res) => {
  if (true) console.log("#loginAdmin");
  try {
    const { email, password: pass } = req.body;
    const adm: any = await Admin.findOne({ username: email });
    if (adm) {
      bcrypt.compare(pass, adm.password).then(function (result: any) {
        if (result) {
          res.send({
            username: adm.username,
            _id: adm._id,
          });
        } else {
          res.status(404).json({ msg: "Usuario o contraseña incorrectos" });
        }
      });
    } else res.status(404).json({ msg: "Usuario incorrecto" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getYear = (date: string) => {
  let d = date.split("-");
  return d[0];
};
export const getAllEventUsers: RequestHandler = async (req, res) => {
  if (true) console.log("#getAllEventUsers");
  try {
    const { _id } = req.query;
    const event: EventType = await Event.findById(_id, {
      "categories.teams": 1,
    })
      .populate("categories.teams.users", "name phone card_id birth")
      .lean();
    if (!event) res.status(404).json({ msg: "Evento no encontrado" });
    const allUsers: any[] = [];
    event.categories.forEach((c) => {
      c.teams.forEach((t) => {
        t.users.forEach((u) => {
          allUsers.push(u);
        });
      });
    });

    allUsers.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    res.send(allUsers);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getTickets: RequestHandler = async (req, res) => {
  if (debug) console.log("#getTickets");
  try {
    const { categories_id } = req.body;

    const results = await Ticket.find(
      categories_id ? { category_id: { $in: categories_id } } : undefined
    ).populate("users", "name card_id");
    res.send(results);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const approveTicket: RequestHandler = async (req, res) => {
  if (debug) console.log("#approveTicket");
  try {
    const { ticket } = req.body;
    const event = await Event.findOneAndUpdate(
      { "categories._id": ticket.category_id },
      {
        $push: {
          "categories.$.teams": {
            users: ticket.users,
            captain: ticket.users[0],
            name: ticket.name,
          },
        },
      }
    );
    if (event) {
      // await deleteImage(ticket.public_id);
      await Ticket.findOneAndDelete({ _id: ticket._id });
      const results = await Ticket.find();

      const users = await User.find(
        { _id: { $in: ticket.users } },
        { email: 1 }
      );

      const userList = users.map((u)=>u.email)

      const resend = new Resend(process.env.API_RESEND ?? "");
      const { data, error } = await resend.emails.send({
        from: "norep.code@yahoo.com",
        to: userList,
        subject: "Haz sido aprobado para el evento!!",
        html: emailMsg(
            ticket.name,
            ticket.event,
            ticket.category,
            event._id.toString()
          ),
      });

      if (error) return res.status(400).json({ error });


      res.send(results);
    } else res.status(404).json({ msg: "Evento no encontrado." });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};
export const rejectTicket: RequestHandler = async (req, res) => {
  if (debug) console.log("#rejectTicket");
  try {
    const { ticket } = req.body;
    const result = await Ticket.findOneAndDelete({ _id: ticket._id });
    if (result) {
      // await deleteImage(ticket.public_id);
      const results = await Ticket.find();
      res.send(results);
    } else res.status(404).json({ msg: "Ticket no encontrado." });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUserInfo: RequestHandler = async (req, res) => {
  if (debug) console.log("#getUserInfo");
  try {
    const { _id } = req.query;
    const findUser = await User.findById(_id, { password: 0 });
    if (!findUser) res.status(404).json({ msg: "Usuario no encontrado." });
    res.send(findUser);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUserSearch: RequestHandler = async (req, res) => {
  if (debug) console.log("#getUserSearch");
  try {
    const { text } = req.query;
    const findUser = await User.find(
      { $or: [{ name: { $regex: text } }, { card_id: { $regex: text } }] },
      { name: 1, card_id: 1, _id: 1, phone: 1 }
    );
    if (!findUser) res.send({ msg: "Usuario no encontrado." });
    res.send(findUser);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};
export const userSearchDB: RequestHandler = async (req, res) => {
  if (debug) console.log("#userSearchDB");
  try {
    let { text, page, pageSize } = req.body;

    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 20;

    const users = await User.aggregate([
      {
        $match: {
          $or: [{ name: { $regex: text } }, { card_id: { $regex: text } }],
        },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            { $project: { _id: 1, name: 1, phone: 1, card_id: 1 } },
          ],
        },
      },
    ]);

    // const findUser = await User.find(
    //   { $or: [{ name: { $regex: text } }, { card_id: { $regex: text } }] },
    //   { name: 1, card_id: 1, _id: 1,phone:1 }
    // );
    // if (!findUser) res.send({ msg: "Usuario no encontrado." });
    res.send({
      totalCount: users[0].metadata[0].totalCount,
      page,
      pageSize,
      reached: (page - 1) * pageSize + users[0].data.length,
      users: users[0].data,
    });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

const emailMsg = (
  team: string,
  event: string,
  category: string,
  event_id: string
) => {
  return `<body>
    <div style="width:500px;padding:2em;box-sizing:border-box">
      <h1 style="font-family: sans-serif; font-weight: 600;font-style: normal;color: black;" >${team.toUpperCase()}</h1>
      <p style="font-family: sans-serif; color: black;margin: 0;" >Ha sido aprobado para participar en el evento :</p>
      <h1 style="text-decoration: underline #F1FF48 10px;font-family:  sans-serif;font-weight: 600;font-style: normal;color: black;" >${event.toUpperCase()}</h1>
      <h2 style="font-size: 1.5em;text-decoration: underline #F1FF48 10px;font-family:  sans-serif;font-weight: 600;font-style: normal;color: black;" >${category.toUpperCase()}</h2>
      <div style="height: 32px;" ></div>
      <a href="https://www.norep.com.ve/resultados/${event_id}" target="_blank" style="color: black;font-style: normal;font-weight: 600;font-family:  sans-serif;background-color: #F1FF48;border: 1px solid #191919;font-size: 1.3em;padding: .5em 1em;color: #191919;cursor: pointer;text-decoration: none;" href="/" >IR AL EVENTO</a>
    </div>
  </body>
  `;
};

