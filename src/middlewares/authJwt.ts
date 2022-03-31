import {NextFunction, Request, Response, Router} from 'express';
import Customer from '../models/Customer';
import Owner from '../models/Owner';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
//import Role from '../models/Role';
import config from "../config";


export const verifyToken = async (req: any, res: Response, next: NextFunction) => {
         
    const token = req.headers["x-access-token"];
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(token, config.SECRET);
        res.locals.jwtPayload = jwtPayload;
      } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).json({message: "No token"});
        return;
      }
      //Check if the user exists
      const { id, username, password } = jwtPayload;
      const customer = await Customer.findById(id);
      if(!customer){
          const owner = await Owner.findById(id);
          if (!owner) return res.status(404).json({message: "No user found"});
      }
         
      //Call the next middleware or controller
      next();
}

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    const owner = await Owner.findById(res.locals.jwtPayload.id);
    if(!owner) return res.status(403).json({message: "You need to be an owner"});
    next();
}
