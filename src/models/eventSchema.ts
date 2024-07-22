// const { Schema, model } = require('mongoose')
import { Schema, model, SchemaTypes } from "mongoose";
const objId = SchemaTypes.ObjectId;

// const wodRes = new Schema({
//     _id: { type: objId, required: true }, // team._id
//     time: { type: Number, required: true },
//     tiebrake: { type: Number, required: true },
//     penalty: { type: Number, required: true },
//     amount: {
//         type: SchemaTypes.Decimal128,
//         defautl: 0,
//         get: getDec,
//     },
// }, { toJSON: { getters: true } })

// const WodSchema = new Schema({
//     name: { type: String, required: true },
//     time_cap: Number,
//     amount_cap: Number,
//     amount_type: { type: String, enum: ["Lbs", "Puntos", "Reps"], required: true },
//     wod_type: { type: String, enum: ['AMRAP', 'FORTIME', "RM", "CIRCUITO"], required: true },
//     results: [wodRes],
// }, { toJSON: { getters: true }, id: false })

const TeamSchema = new Schema({
  users: { type: [objId], ref: "User", default: undefined },
  name: String,
  captain: { type: objId, ref: "User", required: true },
});

const CategorySchema = new Schema(
  {
    teams: { type: [TeamSchema], default: [] },
    name: { type: String, required: true },
    updating: { type: Boolean, required: true },
    price: { type: Number, required: true },
    slots: { type: Number, required: true,default:0 },
    filter: {
      type: {
        // limit = per category
        limit: { type: Number, default: undefined },
        // amount = per team
        amount: { type: Number, default: undefined },
        male: { type: Number, default: undefined },
        female: { type: Number, default: undefined },
        age_min: { type: Number, default: undefined },
        age_max: { type: Number, default: undefined },
      },
      default: undefined,
    },
    // wods: { type: [WodSchema], default: [] }
    // wods: { type: [{ type: objId, ref: 'Wod' }], default: [] }
  },
  { timestamps: true }
);

const EventSchema = new Schema(
  {
    name: { type: String, required: true },
    since: { type: String, required: true },
    until: { type: String, required: true },
    place: { type: String, required: true },
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
    accesible: { type: Boolean, required: true },
    partners: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    categories: [{ type: CategorySchema }],
    manual_teams: { type: Boolean, required: true, default: false },
    register_time: {
      since: { type: String, required: true, default: undefined },
      until: { type: String, required: true, default: undefined },
    },
  },
  {
    timestamps: true,
  }
);

function getDec(value: number) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}
/// WODS GUIDE 1=AMRAP 2=FORTIME 3=RM 4=CIRCUIT

// EventSchema.methods.changeName = function () {
//     return this.name = 'Testing here'
// }

export default model("Event", EventSchema);