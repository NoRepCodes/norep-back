import { RequestHandler } from "express";
import Event from "../models/eventSchema";
import { CategoryType, EventType } from "event.t";
//@ts-ignore
import bcrypt from "bcrypt";
import Admin from "../models/adminSchema";
const debug = true;

export const getTeamInfo: RequestHandler = async (req, res) => {
  if (debug) console.log("#getTeamInfo");
  try {
    const { _id } = req.query;
    if (!_id) throw new Error("Equipo inexistente");
    const event = await Event.findOne(
      { "categories.teams._id": _id },
      { "categories.teams.$": 1 }
    ).populate("categories.teams.users", "name phone card_id");
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
    const { team, categoryIdToPush } = req.body;
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
    res.status(400).json({ msg: error.message });
  }
};

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
export const getAllEventUsers: RequestHandler = async (req, res) => {
  if (true) console.log("#getAllEventUsers");
  try {
    const { _id } = req.query;
    const event: EventType = await Event.findById(_id, {
      "categories.teams": 1,
    })
      .populate("categories.teams.users", "name phone card_id")
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
