// deno-lint-ignore-file no-explicit-any
import { uploadImage } from "../helpers/uploadImages.ts";
import User from "../models/userSchema.ts";
import { EventType } from "../types/event.t.ts";
import Event from "../models/eventSchema.ts";
import Wods from "../models/wodSchema.ts";
import { Document } from "npm:mongoose";
import Admin from "../models/adminSchema.ts";
//@ts-ignore ?
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import Ticket from "../models/ticketSchema.ts";
//@ts-ignore ?
import nodemailer from "npm:nodemailer";
import { ReqRes } from "../helpers/utils.ts";

const debug = true;

export const login: ReqRes = async (req, res) => {
  if (debug) console.log("#login");
  try {
    const { email, pass } = req.body;
    // let a = 's'
    // a.toLowerCase()
    if (email[0] === "@") {
      // const { username, password } = req.body;
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
      }
    } else {
      console.log(bcrypt.hashSync('123123', bcrypt.genSaltSync(10)));
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(401).json({ msg: "Correo incorrecto" });
      const isPassword = await bcrypt.compare(pass, user.password);
      if (!isPassword)
        return res.status(401).json({ msg: "Contraseña incorrecta" });
      //@ts-ignore ?
      const { passsword: _x, ...allData } = user;
      //@ts-ignore ?
      return res.send(allData._doc);
    }
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const registerUser: ReqRes = async (req, res) => {
  if (debug) console.log("#register");
  try {
    const {
      name,
      pass,
      email,
      card_id,
      birth,
      box,
      genre,
      location,
      shirt,
      phone,
    } = req.body;
    console.log("something is wird");
    const ifEmail = await User.find({ email: email.toLowerCase() });
    if (ifEmail.length > 0)
      return res.status(403).json({ msg: "Correo en uso" });
    const ifCard = await User.find({ card_id: card_id });
    if (ifCard.length > 0)
      return res.status(403).json({ msg: "Cédula en uso" });
    else {
      const password = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
      const result = await User.create({
        password,
        name,
        email: email.toLowerCase(),
        shirt,
        card_id,
        genre,
        location,
        box,
        birth,
        phone,
        // birth: moment(new Date(birth)).unix(),
      });
      const { password: _, ...allData } = result;
      //@ts-ignore ?
      res.send(allData._doc);
    }
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const registerTeam: ReqRes = async (req, res) => {
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

export const getUserRedcords: ReqRes = async (req, res) => {
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

export const createAdmin: ReqRes = async (req, res) => {
  if (debug) console.log("#createAdmin");
  try {
    const { username, pass } = req.body;
    const password = await bcrypt.hash(pass, "7");
    const result = await Admin.create({ username, password });
    res.send(result);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteAdmin: ReqRes = async (req, res) => {
  if (debug) console.log("#deleteAdmin");
  try {
    const { _id } = req.body;
    const result = await Admin.findOneAndDelete({ _id });
    res.send(result);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const registerTicket: ReqRes = async (req, res) => {
  if (debug) console.log("#registerTicket");
  try {
    const { users, category_id, inputs, image, phone } = req.body;

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

    if (result.categories[cindex].teams.some((t) => t.name === inputs.name)) {
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
      secure_url: image,
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
        name: inputs.name,
        dues: [
          {
            // secure_url: "asd",
            // public_id: "asd",
            secure_url,
            public_id,
            transf: inputs.transf,
            payDues: inputs.payDues,
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

export const checkUsers: ReqRes = async (req, res) => {
  if (debug) console.log("#checkUser");
  try {
    const { captain, card_2, card_3, card_4, category } = req.body;
    let auxFem = 0;
    let auxMal = 0;
    const am = category.filter?.age_min;
    const amax = category.filter?.age_max;

    const age_max = amax
      ? new Date(
          `${2024 - amax}-${new Date().getMonth()}-${new Date().getDay()}`
        )
      : undefined;
    const age_min = am
      ? new Date(`${2024 - am}-${new Date().getMonth()}-${new Date().getDay()}`)
      : undefined;

    const users_id = [captain._id];

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

export const getTickets: ReqRes = async (_, res) => {
  if (debug) console.log("#getTickets");
  try {
    const results = await Ticket.find().populate("users", "name");
    res.send(results);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const pushTicket: ReqRes = async (req, res) => {
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

export const approveTicket: ReqRes = async (req, res) => {
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

      const transporter = nodemailer.createTransport({
        service: "yahoo",
        auth: {
          user: "norep.code@yahoo.com",
          pass: "lgippxsozkcbrovy",
        },
      });

      const users = await User.find(
        { _id: { $in: ticket.users } },
        { email: 1 }
      );

      users.forEach((user) => {
        const mailOptions = {
          from: "norep.code@yahoo.com",
          to: user.email,
          subject: `Haz sido admitido en el evento ${ticket.event.toUpperCase()}!`,
          html: emailMsg(
            ticket.name,
            ticket.event,
            ticket.category,
            event._id.toString()
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

      res.send(results);
    } else res.status(404).json({ msg: "Evento no encontrado." });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};
export const rejectTicket: ReqRes = async (req, res) => {
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

export const sendEmail: ReqRes = async (_, res) => {
  if (debug) console.log("#sendEmail");
  try {
    const transporter = nodemailer.createTransport({
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
      const mailOptions = {
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
// export const namehere:ReqRes = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// }

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

/* old $2b$10$/pMRYNcOjpZ4.APiBsIRxuHJ1WM5p6DatLpybujBUPp5F9oPlXgnu
 * new $2a$10$Xro5dVrNMESDO4XKOmx/GeR2/Lzvb5bG8vCkAzxSHR7JMLxJVkm3y
 */