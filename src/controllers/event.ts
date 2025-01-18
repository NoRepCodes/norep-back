// deno-lint-ignore-file no-explicit-any

import {
  convertBody,
  insertPg,
  mergeBody,
  mergePg,
} from "../helpers/convertBody.ts";
import { debug, ReqRes } from "../types/_utils.ts";
import { categV, eventV, wodV } from "../types/event.t.ts";
import { query } from "../db.ts";

// EVENTS
export const deleteAll: ReqRes = async (req, res) => {
  await query("DELETE FROM wods");
  await query("DELETE FROM categories");
  await query("DELETE FROM events");
  res.send("ok");
};

export const createEvent: ReqRes = async (req, res) => {
  if (debug) console.log("#createEvent");
  try {
    req.body.logo = { secure_url: "aver", public_id: "_" };
    const auxCategories = [...req.body.categories];
    delete req.body.categories;

    const info = convertBody(req.body, eventV);
    const e = await insertPg("events", info);

    const insertCateg = async (c: any) => {
      const categInfo = convertBody(c, categV);
      const { rows } = await insertPg("categories", categInfo);
      return rows[0];
    };
    const categories = await Promise.all(
      auxCategories.map((c) => insertCateg(c))
    );

    res.send({ event: e.rows[0], categories });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ msg: error.message });
  }
};

export const deleteEvent: ReqRes = async (req, res) => {
  if (debug) console.log("#deleteEvent");
  try {
    /// add admin conditional here
    console.log(req.body.event_id);
    const resu = await query(
      `DELETE FROM events WHERE event_id='${req.body.event_id}'`
    );
    res.send(resu);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const getEventsAdmin: ReqRes = async (_, res) => {
  if (debug) console.log("#getEventsAdmin");
  try {
    /// add admin conditional here
    const { rows } = await query("SELECT * FROM events");
    res.send(rows);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const mergeEvent: ReqRes = async (req, res) => {
  if (debug) console.log("#mergeEvents");
  try {
    req.body.logo = { secure_url: "aver", public_id: "_" };
    const auxCategories = [...req.body.categories];
    delete req.body.categories;

    const mEvent = mergeBody(req.body, eventV);
    const { rows } = await mergePg("events", mEvent);

    const upCategory = async (categ: any) => {
      const mCategory = mergeBody(categ, categV);
      const { rows: r } = await mergePg("categories", mCategory);
      return r[0];
    };

    const categories = await Promise.all(
      auxCategories.map((categ) => upCategory(categ))
    );
    res.send({ event: rows[0], categories: categories });

    // res.send('ok')
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ msg: error.message });
  }
};
export const mergeWods: ReqRes = async (req, res) => {
  if (debug) console.log("#mergeWods");
  try {
    if (!Array.isArray(req.body.wods))
      throw new Error("Invalid format #mergeWods");

    // const v: string[] = req.body.wods.map(
    //   (w: any) => mergeBody(w, wodV).values
    // );
    // const body = mergeBody(req.body.wods[0], wodV);
    // const { rows } = await mergePg("wods", { ...body, values: v });
    // res.send(rows)
    
    const upWods = async (wods: any) => {
      const mWod = mergeBody(wods, wodV);
      const { rows: r } = await mergePg("wods", mWod);
      return r[0];
    };
    const wods = await Promise.all(req.body.wods.map((w: any) => upWods(w)));

    res.send(wods);
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ msg: error.message });
  }
};

/**
 * SELECT events.event_id, json_agg(categories.*) as categories
	FROM events
INNER JOIN categories
	on events.event_id = categories.event_id
WHERE events.event_id = 'f4f0ba21-98fb-4fa9-9078-60ad346977a1'
GROUP BY
	events.event_id
 * 
 */

/**
 * MERGE INTO a
   USING (
          VALUES (3,3,2,2),
                 (4,0,0,0)
         ) AS source (keycol, col1, col2, col3)
   ON a.keycol = source.keycol
      AND a.col1 = source.col1
WHEN MATCHED THEN
   UPDATE 
      SET col2 = source.col2,
          col3 = source.col3
WHEN NOT MATCHED THEN   
   INSERT (keycol, col1, col2, col3)
      VALUES (keycol, col1, col2, col3);
 */

/**
 * const { rows } = await query(
      `UPDATE commerce SET ${set} WHERE _id='${_id}' RETURNING *`
    );
 */

/**
 * const {
      name,
      since,
      dues,
      until,
      place,
      accesible,
      secure_url: s_url,
      categories,
      partners: pimages,
      register_time,
      manual_teams,
    } = req.body;
    const { secure_url, public_id } = await uploadImage({
      secure_url: s_url,
      public_id: "_",
    });
    const partners = await uploadImages(pimages);
    await Event.create({
      name,
      since,
      until,
      place,
      dues,
      secure_url,
      public_id,
      accesible,
      categories,
      partners,
      register_time,
      manual_teams,
    });

    const results = await Event.find();
    res.send(results);
 */

// export const updateEvent: ReqRes = async (req, res) => {
//   // if (debug) console.log('#updateEvent')
//   try {
//     const {
//       _id,
//       name,
//       since,
//       until,
//       dues,
//       place,
//       accesible,
//       categories,
//       secure_url: s_url,
//       public_id: p_id,
//       partners: pimages,
//       manual_teams,
//       register_time,
//     } = req.body;

//     const evnt = await Event.findById(_id);
//     if (evnt === null || evnt === undefined)
//       return res.status(400).json({ msg: "Evento no encontrado" });
//     let bool = false;
//     categories.forEach((c:any) => {
//       c._id = new Types.ObjectId(c._id);
//       //@ts-ignore
//       // const i = evnt.categories.findIndex(categ => categ._id.toString() === c._id)
//       const categ = evnt.categories.find((categ) => categ._id === c._id);
//       //@ts-ignore
//       if (categ && categ?.teams.length !== c.teams?.length) bool = true;
//       //@ts-ignore
//       else if (categ && categ?.teams.length === c.teams?.length)
//         //@ts-ignore
//         c.teams = [...categ.teams];
//     });
//     if (bool)
//       return res.status(400).json({
//         msg: "Se ha registrado un equipo nuevo mientras, refrescar la pagina solucionara el problema.",
//       });
//     const { secure_url, public_id } = await uploadImage({
//       secure_url: s_url,
//       public_id: p_id,
//     });
//     const partners = await uploadImages(pimages);
//     // console.log(categories)

//     evnt.name = name;
//     evnt.since = since;
//     evnt.until = until;
//     evnt.dues = dues;
//     evnt.partners = partners;
//     evnt.place = place;
//     evnt.accesible = accesible;
//     //@ts-ignore
//     evnt.categories = categories;
//     evnt.secure_url = secure_url;
//     evnt.public_id = public_id;
//     evnt.register_time = register_time;
//     evnt.manual_teams = manual_teams;
//     await evnt.save();
//     const results = await Event.find();
//     res.send(results);

//     // console.log(req.body)
//     // res.status(400).json({ msg: 'test' })
//   } catch (error: any) {
//     console.log(error);
//     res.status(400).json({ msg: error.message ?? JSON.stringify(error) });
//   }
// };

// export const deleteEvent: ReqRes = async (req, res) => {
//   // if (debug) console.log('#deleteEvent')
//   try {
//     const { _id, public_id, partners } = req.body;
//     const result = await Event.deleteOne({ _id: _id });
//     if (result.deletedCount > 0) {
//       await deleteImage(public_id);
//       await deleteImages(partners);
//       return res.send(result);
//     } else return res.status(404).json({ msg: "Evento no encontrado" });
//   } catch (error: any) {
//     res.status(400).json({ msg: error.message });
//   }
//   res.send("ok");
// };

// /// WODS
// export const updateWods: ReqRes = async (req, res) => {
//   // if (debug) console.log('#namehere')
//   try {
//     const { wods, toDelete, categories } = req.body;
//     const updWod = async (wod: WodType) => {
//       const query = wod._id
//         ? { _id: wod._id }
//         : { category_id: wod.category_id, _id: new Types.ObjectId() };
//       const { _id,results, ...data } = wod;
//       console.log(data);
//       return await Wod.findOneAndUpdate(
//         query,
//         { ...data},
//         // { ...data, $set: { results: [] } },
//         { new: true, upsert: true }
//       ).lean();
//     };
//     const delWods = async () => {
//       if (toDelete.length > 0) {
//         return await Wod.deleteMany({ _id: { $in: toDelete } });
//       }
//     };
//     /// CHECK THAT WODS UPLOAD IN ORDER
//     // const result = await Promise.all([
//     //   ...wods.map((w:any) => updWod(w)),
//     //   delWods(),
//     // ]);
//     for (const w of wods){
//       await updWod(w)
//     }
//     delWods()
//     const findWods = await Wod.find({
//       category_id: { $in: categories },
//     });
//     res.send(findWods);
//   } catch (error: any) {
//     console.log(error);
//     res.status(400).json({ msg: error.message });
//   }
// };

// export const updateResults: ReqRes = async (req, res) => {
//   // if(debug) console.log('#namehere')
//   try {
//     const { wod_id, results, categories } = req.body;

//     const notExist = results.some((team_res:any) => !team_res.team_id);
//     if (notExist)
//       return res.status(404).json({ msg: "Uno de los equipos no existe" });

//     await Wod.findOneAndUpdate(
//       { _id: wod_id },
//       {
//         $set: { results },
//       },
//       { new: true }
//     );
//     const wods = await Wod.find({ category_id: { $in: categories } });
//     // console.log(wods);
//     res.send(wods);
//   } catch (error: any) {
//     res.status(400).json({ msg: error.message });
//   }
// };

// export const updateTeams: ReqRes = async (req, res) => {
//   if (debug) console.log("#updateTeams");
//   try {
//     const { teams, category_id } = req.body;
//     let aux = [...teams];
//     aux.forEach((team: any, i) => {
//       // if(team._id ==='_') aux[i]._id===undefined
//       // if(team.captain ==='_') aux[i].captain===undefined
//       if (team._id === "_") team._id = undefined;
//       if (team.captain === "_") team.captain = undefined;
//     });
//     await Event.findOneAndUpdate(
//       { "categories._id": category_id },
//       {
//         "categories.$.teams": aux,
//       }
//     );
//     const results = await Event.find();
//     res.send(results);
//   } catch (error: any) {
//     res.status(400).json({ msg: error.message });
//   }
// };

// export const toggleUpdating: ReqRes = async (req, res) => {
//   if (debug) console.log("#toggleUpdating");
//   try {
//     const { category_id, state } = req.body;
//     const evn = await Event.findOneAndUpdate(
//       { "categories._id": category_id },
//       {
//         "categories.$.updating": state,
//       },
//       { new: true }
//     );
//     // console.log(evn);
//     if (evn) {
//       res.send("ok");
//     } else {
//       res.status(400).json({ msg: "Evento no encontrado" });
//     }
//   } catch (error: any) {
//     res.status(400).json({ msg: error.message });
//   }
// };

// export const namehere:ReqRes = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// export const namehere:ReqRes = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// }

/**
 * 
 * WITH DUMMY AS (
SELECT events.event_id , json_agg(categories.*) as categories, array_agg(categories.category_id) as category_id
	FROM events
INNER JOIN categories
	on events.event_id = categories.event_id
WHERE events.event_id = 'f4f0ba21-98fb-4fa9-9078-60ad346977a1'
GROUP BY
	events.event_id
)
SELECT wods.*,DUMMY.* FROM wods 
INNER JOIN DUMMY
	on DUMMY.event_id = 'f4f0ba21-98fb-4fa9-9078-60ad346977a1'
 * 
 */
