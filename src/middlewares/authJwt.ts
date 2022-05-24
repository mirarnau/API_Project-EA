/* eslint-disable no-throw-literal */
import {
  NextFunction, Request, Response
} from 'express'
import jwt from 'jsonwebtoken'
import Customer from '../models/Customer'
import Owner from '../models/Owner'
import Admin from '../models/Admin'
import * as Roles from '../models/Roles'

export const VerifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) { return res.status(401).send({ message: 'No authorized' }) }

    const token = req.headers.authorization

    if (!token) {
      res.status(403).send({ message: 'Token not provided' })
      return
    }

    if (!(typeof token === 'string')) throw 'Token not a string'

    const SECRET = process.env.JWT_SECRET
    let decoded

    try {
      decoded = jwt.verify(token!, SECRET!)
    } catch (e) {
      res.status(403).send({ message: 'Invalid token' })
      return
    }

    console.log(decoded!)

    let user = await Customer.findOne({ _id: decoded!.id, disabled: false })
    if (!user) user = await Owner.findOne({ _id: decoded!.id, disabled: false })
    if (!user) user = await Admin.findOne({ _id: decoded!.id, disabled: false })

    if (!user) {
      res.status(403).send({ message: 'User not authorized' })
      return
    }
  } catch (e) {
    res.status(500).send({ message: `Server error: ${e}` })
    return
  }
  next()
}

export const VerifyTokenCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) { return res.status(401).send({ message: 'No authorized' }) }

    const token = req.headers.authorization

    if (!token) {
      res.status(403).send({ message: 'Token not provided' })
      return
    }

    if (!(typeof token === 'string')) throw 'Token not a string'

    const SECRET = process.env.JWT_SECRET
    let decoded

    try {
      decoded = jwt.verify(token!, SECRET!)
    } catch (e) {
      res.status(403).send({ message: 'Invalid token' })
      return
    }

    console.log(decoded!)

    let user = await Customer.findOne({ _id: decoded!.id, disabled: false })
    if (!user) user = await Admin.findOne({ _id: decoded!.id, disabled: false })

    if (!user) {
      res.status(403).send({ message: 'User not authorized' })
      return
    }

    const { role } = decoded

    if (!role.includes(Roles.CUSTOMER) && !role.includes(Roles.ADMIN)) {
      res.status(403).send({ message: 'Role not authorized' })
      return
    }
  } catch (e) {
    res.status(500).send({ message: `Server error: ${e}` })
    return
  }
  next()
}

export const VerifyTokenOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) { return res.status(401).send({ message: 'No authorized' }) }

    const token = req.headers.authorization

    if (!token) {
      res.status(403).send({ message: 'Token not provided' })
      return
    }

    if (!(typeof token === 'string')) throw 'Token not a string'

    const SECRET = process.env.JWT_SECRET
    let decoded

    try {
      decoded = jwt.verify(token!, SECRET!)
    } catch (e) {
      res.status(403).send({ message: 'Invalid token' })
      return
    }

    console.log(decoded!)

    let user = await Owner.findOne({ _id: decoded!.id, disabled: false })
    if (!user) user = await Admin.findOne({ _id: decoded!.id, disabled: false })

    if (!user) {
      res.status(403).send({ message: 'User not authorized' })
      return
    }

    const { role } = decoded

    if (!role.includes(Roles.OWNER) && !role.includes(Roles.ADMIN)) {
      res.status(403).send({ message: 'Role not authorized' })
      return
    }
  } catch (e) {
    res.status(500).send({ message: `Server error: ${e}` })
    return
  }
  next()
}

export const VerifyTokenAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) { return res.status(401).send({ message: 'No authorized' }) }

    const token = req.headers.authorization

    if (!token) {
      res.status(403).send({ message: 'Token not provided' })
      return
    }

    if (!(typeof token === 'string')) throw 'Token not a string'

    const SECRET = process.env.JWT_SECRET
    let decoded

    try {
      decoded = jwt.verify(token!, SECRET!)
    } catch (e) {
      res.status(403).send({ message: 'Invalid token' })
      return
    }

    console.log(decoded!)

    const user = await Admin.findOne({ _id: decoded!.id, disabled: false })

    if (!user) {
      res.status(403).send({ message: 'User not authorized' })
      return
    }

    const { role } = decoded

    if (!role.includes(Roles.ADMIN)) {
      res.status(403).send({ message: 'Role not authorized' })
      return
    }
  } catch (e) {
    res.status(500).send({ message: `Server error: ${e}` })
    return
  }
  next()
}
