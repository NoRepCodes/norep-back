import {
  deleteImage,
  deleteImages,
  Image,
  uploadImage,
  uploadImages,
} from "../helpers/uploadImages";
import { RequestHandler } from "express";
import User, { userV } from "../models/userSchema";
import { UserType } from "../types/user.t";
import moment from "moment";
import { CategoryType, EventType, TeamType } from "../types/event.t";
import Event from "../models/eventSchema";
import Wods from "../models/wodSchema";
import { Document } from "mongoose";
import Admin from "../models/adminSchema";
//@ts-ignore
import bcrypt from "bcrypt";
import Ticket from "../models/ticketSchema";
//@ts-ignore
import nodemailer from "nodemailer";
import verifyBody from "../helpers/verifyBody";

const debug = true;

export const registerTeam: RequestHandler = async (req, res) => {
  // if(debug) console.log('#namehere')
  try {
    // TO DO:
    // age and gender is validated in front -- CHECK THAT EVENT IS NOT 30 MINS OLDER IN FRONT BEFORE UPDATE
    // PLUS: USE GET TO VERIFY USERS CARDS_ID & GET _ID'S
    const { team, category_id } = req.body;

    const result: (EventType & Document) | null = await Event.findOne({
      "categories._id": category_id,
    });
    if (result === null)
      return res.status(404).json({ msg: "Categoría no encontrada" });
    const cindex = result.categories.findIndex(
      (c) => c._id.toString() === category_id
    );

    if (
      (result.categories[cindex].filter?.limit ?? 999) <=
      result.categories[cindex].teams.length
    ) {
      return res.status(403).json({ msg: "Límite de equipos alcanzado" });
    }

    if (result.categories[cindex].teams.some((t) => t.name === team.name)) {
      return res
        .status(403)
        .json({ msg: `El nombre del equipo ya está en uso` });
    }

    let duplUser: string | undefined = undefined;
    result.categories.forEach((c) => {
      c.teams.forEach((t) => {
        t.users.some((u) => {
          if (team.users.includes(u.toString())) {
            duplUser = u.toString();
            return true;
          }
        });
      });
    });
    if (duplUser) {
      const findUser = await User.findById(duplUser, { name: 1 });
      if (findUser)
        return res.status(403).json({
          msg: `El usuario ${findUser.name} ya se encuentra registrado en el evento`,
        });
      else
        return res.status(403).json({
          msg: `El usuario ${duplUser} ya se encuentra registrado en el evento`,
        });
    }

    result.categories[cindex].teams.push(team);
    await result.save();
    return res.send(result);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUserRecords: RequestHandler = async (req, res) => {
  // if(debug) console.log('#namehere')
  try {
    // const filter = {
    //     example: 1,
    // }
    const results = await Wods.find({ "results.users": req.query._id }, {});
    res.send(results);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const createAdmin: RequestHandler = async (req, res) => {
  if (debug) console.log("#createAdmin");
  try {
    const { username, pass } = req.body;
    bcrypt.hash(pass, 7, async (err: any, hash: any) => {
      // Store hash in your password DB.
      const result = await Admin.create({ username, password: hash });
      res.send(result);
    });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteAdmin: RequestHandler = async (req, res) => {
  if (debug) console.log("#deleteAdmin");
  try {
    const { _id } = req.body;
    const result = await Admin.findOneAndDelete({ _id });
    res.send(result);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const registerTicket: RequestHandler = async (req, res) => {
  if (debug) console.log("#registerTicket");
  try {
    const { users, values } = req.body;
    const { category_id, name, dues, phone } = values;

    const result: (EventType & Document) | null = await Event.findOne({
      "categories._id": category_id,
    });
    let cindex = undefined;
    if (result === null)
      return res.status(404).json({ msg: "Categoría no encontrada" });
    cindex = result.categories.findIndex(
      (c: any) => c._id.toString() === category_id
    );

    if (
      (result.categories[cindex].filter?.limit ?? 999) <=
      result.categories[cindex].teams.length
    ) {
      return res.status(403).json({ msg: "Límite de equipos alcanzado" });
    }

    if (result.categories[cindex].teams.some((t) => t.name === name)) {
      return res
        .status(403)
        .json({ msg: `El nombre del equipo ya está en uso` });
    }

    let duplUser: string | undefined = undefined;
    result.categories.forEach((c) => {
      c.teams.forEach((t) => {
        t.users.some((u) => {
          if (users.includes(u.toString())) {
            duplUser = u.toString();
            return true;
          }
        });
      });
    });
    if (duplUser) {
      const findUser = await User.findById(duplUser, { name: 1 });
      if (findUser)
        return res.status(403).json({
          msg: `El usuario ${findUser.name} ya se encuentra registrado en el evento`,
        });
      else
        return res.status(403).json({
          msg: `El usuario ${duplUser} ya se encuentra registrado en el evento`,
        });
    }

    const { secure_url, public_id } = await uploadImage({
      secure_url: dues[0].secure_url,
      public_id: "_",
    });
    const ev = await Event.findOneAndUpdate(
      {
        "categories._id": category_id,
      },
      { $inc: { "categories.$.slots": 1 } },
      { new: true }
    );
    if (ev) {
      await Ticket.create({
        event: result.name,
        category: result.categories[cindex].name,
        category_id: result.categories[cindex]._id,
        users,
        captain: users[0],
        phone,
        name,
        dues: [
          {
            // secure_url: "asd",
            // public_id: "asd",
            secure_url,
            public_id,
            transf: dues[0].transf,
            payDues: dues[0].payDues,
          },
        ],
        duesLimit: ev.dues,
      });

      // this is to save
      // result.categories[cindex].teams.push(users);
      // await result.save();

      return res.send({ msg: "Solicitud enviada con exito!" });
    } else res.status(404).json({ msg: "Evento no encontrado" });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const checkUsers: RequestHandler = async (req, res) => {
  if (debug) console.log("#checkUser");
  try {
    const { captain, card_2, card_3, card_4, category } = req.body;
    let auxFem = 0;
    let auxMal = 0;
    let amin = category.filter?.age_min;
    let amax = category.filter?.age_max;

    let age_max = amax
      ? new Date(
          `${2025 - amax}-${new Date().getMonth()}-${new Date().getDay()}`
        )
      : undefined;
    let age_min = amin
      ? new Date(
          `${2025 - amin}-${new Date().getMonth()}-${new Date().getDay()}`
        )
      : undefined;

    let users_id = [captain._id];

    if (captain) {
      if (category.filter?.male || category.filter?.female) {
        if (captain.genre === "Masculino") auxMal += 1;
        else auxFem += 1;
      }
      if (age_min && new Date(captain.birth) > age_min) {
        return res.status(403).json({
          msg: `Usuario ${captain.name} no cumple con la edad necesaria para participar.`,
        });
      } else if (age_max && new Date(captain.birth) < age_max) {
        return res.status(403).json({
          msg: `Usuario ${captain.name} excede la edad necesaria para participar.`,
        });
      }
    }

    if (card_2) {
      const fu2 = await User.findOne({ card_id: card_2 });
      if (fu2) {
        users_id.push(fu2._id.toString());
        if (category.filter?.male || category.filter?.female) {
          if (fu2.genre === "Masculino") auxMal += 1;
          else auxFem += 1;
        }
        if (age_min && new Date(fu2.birth) > age_min) {
          return res.status(403).json({
            msg: `Usuario ${fu2.name} no cumple con la edad necesaria para participar.`,
          });
        } else if (age_max && new Date(fu2.birth) < age_max) {
          return res.status(403).json({
            msg: `Usuario ${fu2.name} excede la edad necesaria para participar.`,
          });
        }
      } else {
        return res
          .status(403)
          .json({ msg: `Usuario con C.I: ${card_2} no encontrado.` });
      }
    }
    if (card_3) {
      const fu3 = await User.findOne({ card_id: card_2 });
      if (fu3) {
        users_id.push(fu3._id.toString());
        if (category.filter?.male || category.filter?.female) {
          if (fu3.genre === "Masculino") auxMal += 1;
          else auxFem += 1;
        }
        if (age_min && new Date(fu3.birth) > age_min) {
          return res.status(403).json({
            msg: `Usuario ${fu3.name} no cumple con la edad necesaria para participar.`,
          });
        } else if (age_max && new Date(fu3.birth) < age_max) {
          return res.status(403).json({
            msg: `Usuario ${fu3.name} excede la edad necesaria para participar.`,
          });
        }
      } else {
        return res
          .status(403)
          .json({ msg: `Usuario con C.I: ${card_3} no encontrado.` });
      }
    }
    if (card_4) {
      const fu4 = await User.findOne({ card_id: card_2 });
      if (fu4) {
        users_id.push(fu4._id.toString());
        if (category.filter?.male || category.filter?.female) {
          if (fu4.genre === "Masculino") auxMal += 1;
          else auxFem += 1;
        }
        if (age_min && new Date(fu4.birth) > age_min) {
          return res.status(403).json({
            msg: `Usuario ${fu4.name} no cumple con la edad necesaria para participar.`,
          });
        } else if (age_max && new Date(fu4.birth) < age_max) {
          return res.status(403).json({
            msg: `Usuario ${fu4.name} excede la edad necesaria para participar.`,
          });
        }
      } else {
        return res
          .status(403)
          .json({ msg: `Usuario con C.I: ${card_4} no encontrado.` });
      }
    }

    if (category.filter?.male && auxMal > category.filter?.male) {
      return res
        .status(403)
        .json({ msg: `Exceso de participantes masculinos en el equipo.` });
    } else if (category.filter?.female && auxFem > category.filter?.female) {
      return res
        .status(403)
        .json({ msg: `Exceso de participantes femeninos en el equipo.` });
    } else {
      res.send(users_id);
    }
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const sendEmail: RequestHandler = async (req, res) => {
  if (debug) console.log("#sendEmail");
  try {
    let transporter = nodemailer.createTransport({
      //lgippxsozkcbrovy
      service: "yahoo",
      auth: {
        user: "norep.code@yahoo.com",
        pass: "lgippxsozkcbrovy",
      },
    });

    const ticket = { users: "66b68416b5a9026a6d13cb4d" };
    const users = await User.find({ _id: { $in: ticket.users } }, { email: 1 });

    users.forEach((user) => {
      let mailOptions = {
        from: "norep.code@yahoo.com",
        to: user.email,
        subject: `Haz sido admitido en el evento STRONG ENDURANCE!`,
        html: emailMsg(
          "los odiosos",
          "strong endurance",
          "avanzado",
          "66b4e80393c333245f375286"
        ),
      };
      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });
    res.send(users);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};
export const updateUserInfo: RequestHandler = async (req, res) => {
  if (debug) console.log("#updateUserInfo");
  try {
    verifyBody(req.body, userV);
    const { _id, email, ...userData } = req.body;
    const findUser = await User.findOneAndUpdate(
      { _id },
      { email: email.toLowerCase(), ...userData },
      { new: true }
    );
    if (!findUser) res.status(404).json({ msg: "Usuario no encontrado." });
    res.send(findUser);
    // res.status(400).json({ msg:'wtf' });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

export const pushTicket: RequestHandler = async (req, res) => {
  if (debug) console.log("#pushTicket");
  try {
    const { captain_id, transf, payDues, img } = req.body;
    const ticket = await Ticket.findOne({ users: captain_id });
    if (ticket) {
      const { secure_url, public_id } = await uploadImage({
        secure_url: img,
        public_id: "_",
      });
      // console.log(secure_url, public_id);
      ticket.dues.push({
        secure_url,
        public_id,
        transf,
        payDues,
      });
      await ticket.save();
      res.send("ok");
    } else {
      res.status(404).json({ msg: "No se ha encontrado un pago anterior." });
    }
    // res.send("ok");
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

// export const namehere:RequestHandler = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// }


/**Buenos dias man, te doy un recuento de la semana, estuve intentado estilizar el correo de aprovación de equipo pero no logré mucho, no me deja usar estilos personalizados por el tipo de servicio que uso para enviar correos, muy poco me deja editar, de todas formas con ese poco que puedo, aún hay cosas que se podrían mejorar, alli te mando un ejemplo de lo que hice, queria como centrar el texto, cambiar el tipo de fuente... pero no se puede, en lo que si te podría pedir ayuda es que mas podemos decir, está muy sencillo y no sé que quisieran ustedes añadir allí.
 
Mas allá de eso me encontré unos erores al editar los wods, que se desaparecían al actualizar una categoría (ando en eso), y el diseño del registro para que esté todo visible sin necesidad de hacer scroll, y el mensaje al momento de registrarse a la categoría para que los usuarios entiendan que TODOS los participantes del equipo deben tener una sesión en NOREP. En general he pasado la semana revisando errores y haciendo pruebas con los wods, los correos, los tickets..., además de tenerle el ojo puesto a los usuarios que se registren pero nada, la pagina no ha tenido tráfico en lo absoluto, lo poco que veo estoy por pensar que he sido yo haciendo pruebas (no puedo ver cuantas personas han visitado la página pero si cuanto se ha consumido del servidor, y puedo almenos ver si hay mucho o poco tráfico).
  
En resumen, tengo los diseños del registro y el aviso para los usuarios, me avisas si tienes alguna idea para mejorar el mensaje del correo, y ando revisando errores, el viernes o jueves subo esta actualización y la pág debería de quedar limpia.
*/


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