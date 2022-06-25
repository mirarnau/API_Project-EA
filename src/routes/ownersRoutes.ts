import {
  Request, Response, Router
} from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authJwt } from '../middlewares/index'

import Owner from '../models/Owner'

class OwnersRoutes {
  public router: Router

  constructor () {
    this.router = Router()
    this.routes() // This has to be written here so that the method can actually be configured when called externally.
  }

  public async getAllOwners (req: Request, res: Response) : Promise<void> { // It returns a void, but internally it's a promise.
    const allOwners = await Owner.find()
    if (allOwners.length === 0) {
      res.status(404).send('There are no owners yet.')
    } else {
      res.status(200).send(allOwners)
    }
  }

  public async getOwnerById (req: Request, res: Response) : Promise<void> {
    const ownerFound = await Owner.findById(req.params._id).populate('listRestaurants')
    if (ownerFound == null) {
      res.status(404).send('Owner not found.')
    } else {
      res.status(200).send(ownerFound)
    }
  }

  public async getOwnerByName (req: Request, res: Response) : Promise<void> {
    const ownerFound = await Owner.findOne({ ownerName: req.params.ownerName })
    if (ownerFound == null) {
      res.status(404).send('Owner not found.')
    } else {
      res.status(200).send(ownerFound)
    }
  }

  public async login (req: Request, res: Response) : Promise<void> {
    const userFound = await Owner.findOne({ ownerName: req.body.ownerName })
    const SECRET = process.env.JWT_SECRET

    if (!userFound) {
      res.status(400).json({ message: 'Invalid credentials' })
    } else {
      const matchPassword = await bcrypt.compare(req.body.password, userFound.password)

      if (!matchPassword) {
        res.status(401).json({ token: null, message: 'Invalid credentials' })
      } else {
        const token = jwt.sign(
          { id: userFound._id, ownerName: userFound.ownerName, role: userFound.role }, SECRET!, { expiresIn: 3600 }
        )

        res.status(200).send({ token })
      }
    }
  }

  public async addOwner (req: Request, res: Response) : Promise<void> {
    const ownerFound = await Owner.findOne({ ownerName: req.body.ownerName })
    if (ownerFound != null) {
      res.status(409).send('This owner already exists.')
    } else {
      const {
        ownerName, fullName, email, password, profilePic
      } = req.body

      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)
      const newOwner = new Owner({
        ownerName, fullName, email, password: hashed, profilePic
      })
      await newOwner.save()

      res.status(200).send('Owner added')
    }
  }

  public async updateOwner (req: Request, res: Response) : Promise<void> {
    const ownerToUpdate = await Owner.findByIdAndUpdate(req.params._id, req.body)
    if (ownerToUpdate == null) {
      res.status(404).send('Owner not found.')
    } else {
      res.status(201).send('Owner updated.')
    }
  }

  public async deleteOwner (req: Request, res: Response) : Promise<void> {
    const ownerToDelete = await Owner.findByIdAndDelete(req.params._id)
    if (ownerToDelete == null) {
      res.status(404).send('Owner not found.')
    } else {
      res.status(200).send('Owner deleted.')
    }
  }

  routes () {
    this.router.get('/', [authJwt.VerifyToken], this.getAllOwners)
    this.router.get('/:_id', [authJwt.VerifyToken], this.getOwnerById)
    this.router.get('/name/:ownerName', [authJwt.VerifyToken], this.getOwnerByName)
    this.router.post('/', this.addOwner) // Anyone should be able to register to the app as an owner
    this.router.post('/login', this.login)
    this.router.put('/:_id', [authJwt.VerifyTokenOwner], this.updateOwner)
    this.router.delete('/:_id', [authJwt.VerifyTokenOwner], this.deleteOwner)
  }
}
const ownersRoutes = new OwnersRoutes()

export default ownersRoutes.router
