// deno-lint-ignore-file no-explicit-any

import pg from 'npm:pg'
const {Pool} = pg
 
const pool = new Pool({
  user: 'postgres',
  password:'123123123',
  host: 'localhost',
  port:5432,
  database:"norep-test"
})
 
export const query = (text:string, params?:any) => pool.query(text, params)