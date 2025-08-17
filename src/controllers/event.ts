import {
  deleteImage,
  deleteImages,
  Image,
  uploadImage,
  uploadImages,
} from "../helpers/uploadImages";
import { RequestHandler } from "express";
import Event, { eventV } from "../models/eventSchema";
import Wod from "../models/wodSchema";
import User from "../models/wodSchema";
// import moment from "moment";
import { CategoryType, EventType, ResultType, WodType } from "../types/event.t";
import { Types } from "mongoose";

import verifyBody from "../helpers/verifyBody";

const debug = true;
// EVENTS
export const createEvent: RequestHandler = async (req, res) => {
  if (debug) console.log("#createEvent");
  try {
    verifyBody(req.body, eventV);
    const { secure_url: s_url, partners: pimages, ...bData } = req.body;
    const { secure_url, public_id } = await uploadImage({
      secure_url: s_url,
      public_id: "_",
    });
    const partners = await uploadImages(pimages??[]);
    await Event.create({ ...bData, secure_url, public_id, partners });
    res.send({ msg: "Evento Creado con exito!" });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateEvent: RequestHandler = async (req, res) => {
  if (debug) console.log("#updateEvent");
  try {
    verifyBody(req.body, eventV);
    const {
      _id,
      secure_url: s_url,
      public_id: p_id,
      partners: pimages,
      ...bData
    } = req.body;

    const evnt: EventType = (await Event.findById(_id)).toObject();
    if (evnt === null || evnt === undefined)
      return res.status(400).json({ msg: "Evento no encontrado" });
    let bool = false;
    bData.categories.forEach((c: CategoryType) => {
      c._id = new Types.ObjectId(c._id);
      const categ = evnt.categories.find((categ) => categ._id === c._id);
      if (categ && categ?.teams.length !== c.teams?.length) bool = true;
      else if (categ && categ?.teams.length === c.teams?.length)
        c.teams = [...categ.teams];
    });
    if (bool)
      throw new Error(
        "Equipos incompatibles, refrescar la pagina solucionara el problema."
      );
    const { secure_url, public_id } = await uploadImage({
      secure_url: s_url,
      public_id: p_id,
    });
    const partners = await uploadImages(pimages);
    const result = await Event.findOneAndUpdate(
      { _id },
      { ...bData, secure_url, public_id, partners },
      { new: true }
    );
    res.send(result);

    // console.log(req.body)
    // res.status(400).json({ msg: 'test' })
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ msg: error.message ?? JSON.stringify(error) });
  }
};

export const deleteEvent: RequestHandler = async (req, res) => {
  // if (debug) console.log('#deleteEvent')
  try {
    const { _id, public_id } = req.query;
    const result = await Event.deleteOne({ _id: _id });
    if (result.deletedCount > 0) {
      await deleteImage(public_id.toString());
      // await deleteImages(partners);
      return res.send(result);
    } else return res.status(404).json({ msg: "Evento no encontrado" });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
  res.send("ok");
};

/// WODS
export const updateWods: RequestHandler = async (req, res) => {
  if (debug) console.log("#updateWods");
  try {
    const { wods, toDelete, categories } = req.body;
    const updWod = async (wod: WodType) => {
      const query = wod._id
        ? { _id: wod._id }
        : { category_id: wod.category_id, _id: new Types.ObjectId() };
      const { _id, results,...data } = wod;
      return await Wod.findOneAndUpdate(
        query,
        { ...data },
        { new: true, upsert: true }
      ).lean();
    };
    const delWods = async () => {
      if (toDelete.length > 0) {
        return await Wod.deleteMany({ _id: { $in: toDelete } });
      }
    };
    /// CHECK THAT WODS UPLOAD IN ORDER
    // const result = await Promise.all([
    //   ...wods.map((w:any) => updWod(w)),
    //   delWods(),
    // ]);
    for (const w of wods) {
      const r = await updWod(w);
      console.log(r);
    }
    await delWods();
    const findWods = await Wod.find({
      category_id: { $in: categories },
    });
    res.send(findWods);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

export const updateResults: RequestHandler = async (req, res) => {
  // if(debug) console.log('#namehere')
  try {
    const { wod_id, results, categories } = req.body;

    const notExist = results.some((team_res: any) => !team_res.team_id);
    if (notExist)
      return res.status(404).json({ msg: "Uno de los equipos no existe" });

    const w = await Wod.findOneAndUpdate(
      { _id: wod_id },
      {
        $set: { results },
      },
      { new: true }
    );
    const wods = await Wod.find({ category_id: { $in: categories } });
    res.send(wods);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateTeams: RequestHandler = async (req, res) => {
  if (debug) console.log("#updateTeams");
  try {
    const { teams, category_id, toDelete } = req.body;
    // let aux = [...teams];
    teams.forEach((team: any) => {
      // if(team._id ==='_') aux[i]._id===undefined
      // if(team.captain ==='_') aux[i].captain===undefined
      if (team._id === "_") team._id = undefined;
      if (team.captain === "_") team.captain = undefined;
    });
    const event = await Event.findOneAndUpdate(
      { "categories._id": category_id },
      {
        "categories.$.teams": teams,
      },
      { new: true }
    );

    await Wod.updateMany(
      { category_id },
      {
        $pull: { team: { _id: { $in: toDelete } } },
      }
    );

    res.send(event);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const toggleUpdating: RequestHandler = async (req, res) => {
  if (debug) console.log("#toggleUpdating");
  try {
    const { category_id, state } = req.body;
    const event = await Event.findOneAndUpdate(
      { "categories._id": category_id },
      {
        "categories.$.updating": state,
      },
      { new: true }
    );
    // console.log(evn);
    if (event) {
      res.send(event);
    } else {
      res.status(400).json({ msg: "Evento no encontrado" });
    }
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};


//   if (debug) console.log("#migration");
//   try {
//     const user = await User.find();
//     res.send(user)
//   } catch (error: any) {
//     res.status(400).json({ msg: error.message });
//   }
// };

// export const namehere:RequestHandler = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }}
