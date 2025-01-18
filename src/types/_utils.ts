import { Request, Response } from "npm:express";

export type ImageT = { secure_url: string; public_id: string };
export type ReqRes = (req: Request, res: Response) => void;
export const debug = true