// deno-lint-ignore-file no-explicit-any
// type convbodyT = (b:object) => {keys:string[],amounts:string,values:any[]}

import { query } from "../db.ts";

export const convertBody = (body: object, validation: string[]) => {
  const keys = Object.keys(body);
  let isWrong: string | boolean = false;
  // console.log(keys);
  keys.forEach((k) => {
    if (!validation.includes(k)) isWrong = k;
  });
  if (isWrong) throw new Error(`Campos Invalidos ${isWrong}`);
  let values = Object.values(body);
  values = values.map((v, _) => {
    if (typeof v === "object") return JSON.stringify(v);
    else return v;
  });
  const amounts = values.map((_, i) => "$" + (i + 1)).toString();
  return { keys, amounts, values };
};

export const convertBodyUpdate = (body: object, validation: string[]) => {
  const keys = Object.keys(body);
  let isWrong = false;
  keys.forEach((k) => {
    if (!validation.includes(k)) isWrong = true;
  });
  if (isWrong) throw new Error(`Campos Invalidos ${isWrong}`);
  const values = Object.values(body);
  // console.log(`images=${JSON.stringify(values[3])}`);
  const set = keys
    .map((k, i) => {
      // console.log(typeof values[i],values[i]);
      if (typeof values[i] === "string") return `${k}='${values[i]}'`;
      else if (typeof values[i] === "object")
        return `${k}='${JSON.stringify(values[i])}'`;
      else return `${k}=${values[i]}`;
    })
    .toString();

  const cols = keys.map((k) => `${k}`).toString();
  return { set, cols };
};

export const insertPg = async (
  table: string,
  convertBody: { keys: string[]; amounts: string; values: any },
  returning = "*"
) => {
  return await query(
    `INSERT INTO ${table}(${convertBody.keys}) VALUES(${convertBody.amounts}) RETURNING ${returning}`,
    convertBody.values
  );
};

export const mergePg = async (
  table: string,
  body: { keys: string[]; cols: string; set: string; values: string }
) => {

  let guide = 'event_id'
  if(table === 'categories') guide = 'category_id'
  else if(table === 'wods') guide = 'wod_id'
  return await query(`
    MERGE INTO ${table} USING 
    (VALUES (${body.values}))
    as source (${body.cols})
    ON ${table}.${guide} = source.${guide} 
    WHEN MATCHED THEN
      UPDATE
        SET ${body.set}
    WHEN NOT MATCHED THEN
      INSERT (${body.keys})
        VALUES (${body.keys})
    RETURNING *
        `);
};

export const mergeBody = (body: object, validation: string[]) => {
  const { keys, amounts } = convertBody(body, validation);
  const { set, cols } = convertBodyUpdate(body, validation);

  const v = Object.values(body);
  const values: string = keys
    .map((_, i) => {
      // console.log(typeof values[i],values[i]);
      if (typeof v[i] === "string") return `'${v[i]}'`;
      else if (typeof v[i] === "object") return `'${JSON.stringify(v[i])}'`;
      else return `${v[i]}`;
    })
    .toString();

  return { keys, amounts, values, set, cols };
};
// export const insertsPg = async (
//   table: string,
//   convertBodies: { keys: string[]; amounts: string; values: any }[],
//   returning = "*"
// ) => {
//   let amounts = "";
//   let values = "";

//   return await query(
//     `INSERT INTO ${table}(${convertBodies[0].keys}) VALUES${amounts} RETURNING ${returning}`,
//     values
//   );
// };



/**
 export const mergePg = async (
  table: string,
  body: { keys: string[]; cols: string; set: string; values: string | string[] }
) => {
  let guide = "event_id";
  if (table === "categories") guide = "category_id";
  else if (table === "wods") guide = "wod_id";
  let values: string | string[] = "";
  if (!Array.isArray(body.values)) {
    values = "(" + body.values + ")";
  } else {
    values = body.values.map((v, i) => {
      if (i + 1 === body.values.length) return "(" + v + ")";
      else return "(" + v + ")";
    });
  }
  console.log(`
    MERGE INTO ${table} USING 
    (VALUES ${values})
    as source (${body.cols})
    ON ${table}.${guide} = source.${guide} 
    WHEN MATCHED THEN
      UPDATE
        SET ${body.set}
    WHEN NOT MATCHED THEN
      INSERT (${body.keys})
        VALUES (${body.keys})
    RETURNING *
        `);
  return await query(`
    MERGE INTO ${table} USING 
    (VALUES ${values})
    as source (${body.cols})
    ON ${table}.${guide} = source.${guide} 
    WHEN MATCHED THEN
      UPDATE
        SET ${body.set}
    WHEN NOT MATCHED THEN
      INSERT (${body.keys})
        VALUES (${body.keys})
    RETURNING *
        `);
}; 
 
 */