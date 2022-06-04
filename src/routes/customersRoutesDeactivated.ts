import {
    Request, Response, Router
  } from 'express'
  import { authJwt } from '../middlewares/index'
import CustomerDeactivated from '../models/CustomerDeactivated'

  class CustomerRoutesDeactivated {
    public router: Router

    constructor () {
      this.router = Router()
      this.routes() // This has to be written here so that the method can actually be configured when called externally.
    }

    public async deactivateCustomer (req: Request, res: Response) : Promise<void> {
      const customerToDeactivate = await CustomerDeactivated.findOne({ customerName: req.body.customerName })
      if (customerToDeactivate != null) {
        res.status(409).send('This customer already exists.')
      } else {
        const {
            customerName, fullName, email, password, creationDate, listDiscounts, listReservations, role, profilePic
          } = req.body
          const customerDeactivate = new CustomerDeactivated({
            customerName, fullName, email, password, creationDate, listDiscounts, listReservations, role, profilePic
          })
        await customerDeactivate.save()
        res.status(200).json('Customer added')
      }
    }

    routes () {
        this.router.post('/', [authJwt.VerifyTokenCustomer], this.deactivateCustomer)
    }
  }
  const customersRoutesDeactivated = new CustomerRoutesDeactivated()

  export default customersRoutesDeactivated.router
