import {
  Request, Response, Router
} from 'express'
import { authJwt } from '../middlewares/index'
import OwnerDeactivated from '../models/OwnerDeactivated'

class CustomerRoutesDeactivated {
  public router: Router

  constructor () {
    this.router = Router()
    this.routes() // This has to be written here so that the method can actually be configured when called externally.
  }

  public async deactivateOwner (req: Request, res: Response) : Promise<void> {
    const ownerToDeactivate = await OwnerDeactivated.findOne({ ownerName: req.body.ownerName })
    if (ownerToDeactivate != null) {
      res.status(409).send('This owner already exists.')
    } else {
      const {
          ownerName, fullName, email, password, creationDate, listRestaurants, role, profilePic
        } = req.body
        const ownerDeactivate = new OwnerDeactivated({
          ownerName, fullName, email, password, creationDate, listRestaurants, role, profilePic
        })
      await ownerDeactivate.save()
      res.status(200).json('Owner added')
    }
  }

  routes () {
      this.router.post('/', [authJwt.VerifyTokenOwner], this.deactivateOwner)
  }
}
const customersRoutesDeactivated = new CustomerRoutesDeactivated()

export default customersRoutesDeactivated.router
