// import { Types } from 'mongoose'

export type ResultType = {
  _id: string;
  team_id: string;
  users: [string];
  time: number;
  tiebrake: number;
  penalty: number;
  amount: number; // decimal
};

export type WodType = {
  _id: string;
  category_id: string;
  event_id: string;
  name: string;
  time_cap?: number;
  amount_cap?: number;
  amount_type: "Lbs" | "Puntos" | "Reps" | "Mts";
  wod_type: "AMRAP" | "FORTIME" | "RM" | "CIRCUITO" | "NADO";
  // results: ResultType[];
  description: string;
  index: number;
};

export type TeamType = {
  _id: string;
  users: string[];
  name: string;
  captain: string;
  // shirt:string,
};

export type CategoryType = {
  category_id: string;
  event_id: string;
  teams: TeamType[];
  name: string;
  price: boolean;
  updating: boolean;
  slots: number;
  filter?: {
    male?: number;
    female?: number;
    age_min?: number;
    age_max?: number;
    amount?: number;
    limit?: number;
  };
  wods: WodType[];
};

export type EventType = {
  event_id: string;
  name: string;
  since: string;
  until: string;
  dues: number;
  details: string;
  place: string;
  logo: { secure_url: string; public_id: string };
  accesible: boolean;
  partners: [{ secure_url: string; public_id: string }];
  categories: CategoryType[];
  manual_teams: boolean;
  register_since: string;
  register_until: string;
};

export const eventV = [
  "event_id",
  "name",
  "since",
  "dues",
  "until",
  "details",
  "place",
  "logo",
  "accesible",
  "partners",
  "categories",
  "manual_teams",
  "register_since",
  "register_until",
];

export const categV = [
  "category_id",
  "event_id",
  "teams",
  "name",
  "price",
  "updating",
  "slots",
  "filter",
];

export const wodV = [
  "wod_id",
  "category_id",
  "event_id",
  "name",
  "time_cap",
  "amount_cap",
  "amount_type",
  "wod_type",
  "description",
  "index",
];

// [
//   "_id",            "name",
//   "place",          "dues",
//   "since",          "until",
//   "details",        "register_since",
//   "register_until", "accesible",
//   "manual_teams",   "categories",
//   "logo",           "partners"
// ]


/**
 * WODS
 WITH DUMMY AS (
SELECT events.event_id , json_agg(categories.*) as categories, array_agg(categories.category_id) as category_id
	FROM events
INNER JOIN categories
	on events.event_id = categories.event_id
WHERE events.event_id = 'f4f0ba21-98fb-4fa9-9078-60ad346977a1'
GROUP BY
	events.event_id
)


SELECT json_agg(wods.*) as wods, DUMMY.category_id as categ_id FROM wods 
INNER JOIN DUMMY
 on DUMMY.event_id = 'f4f0ba21-98fb-4fa9-9078-60ad346977a1'
 WHERE wods.category_id = ANY (DUMMY.category_id)
 GROUP BY
	DUMMY.category_id

 

##FINAL 

  SELECT events.* , json_agg(categories.*) as categories,json_agg(wods.*) as wods
	FROM events
INNER JOIN categories
	on events.event_id = categories.event_id
INNER JOIN wods
	on events.event_id = categories.event_id
WHERE events.event_id = 'f4f0ba21-98fb-4fa9-9078-60ad346977a1'
GROUP BY
	events.event_id

 */