import {
  Request, Response, Router
} from 'express'
import { authJwt } from '../middlewares'
import Dish from '../models/Dish'
import Restaurant from '../models/Restaurant'

class DishesRoutes {
  public router: Router

  constructor () {
    this.router = Router()
    this.routes() // This has to be written here so that the method can actually be configured when called externally.
  }

  public async getAllDishes (req: Request, res: Response) : Promise<void> { // It returns a void, but internally it's a promise.
    const allMenus = await Dish.find()
    if (allMenus.length === 0) {
      res.status(404).send('There are no dishes yet.')
    } else {
      res.status(200).send(allMenus)
    }
  }

  public async getDishById (req: Request, res: Response) : Promise<void> {
    const menuFound = await Dish.findById(req.params._id).populate('restaurant')
    if (menuFound == null) {
      res.status(404).send('Menu not found.')
    } else {
      res.status(200).send(menuFound)
    }
  }

  public async addDish (req: Request, res: Response) : Promise<void> {
    const dishFound = await Dish.findOne({
      restaurant: req.body.restaurant,
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      price: req.body.price
    })
    if (dishFound != null) {
      res.status(409).send('Dish already added')
    }
    const {
      restaurant, title, type, description, price, imageUrl, rating
    } = req.body
    const newMenu = new Dish({
      restaurant, title, type, description, price, imageUrl, rating
    })

    await newMenu.save()
    await Restaurant.findByIdAndUpdate({ _id: req.body.restaurant }, { $push: { listDishes: newMenu } })
    res.status(201).send('Dish added and restaurant updated.')
  }

  public async updateDish (req: Request, res: Response) : Promise<void> {
    const menuToUpdate = await Dish.findByIdAndUpdate(req.params._id, req.body)
    if (menuToUpdate == null) {
      res.status(404).send('Dish not found.')
    } else {
      res.status(201).send('Dish updated.')
    }
  }

  public async deleteDish (req: Request, res: Response) : Promise<void> {
    const dishToDelete = await Dish.findById(req.params._id)
    const restaurant = await Restaurant.findById(dishToDelete.restaurant._id)
    const dishesUpdated = restaurant.listDishes
    if (dishToDelete == null) {
      res.status(404).send('Dish not found.')
      return
    }
    if (restaurant == null) {
      res.status(404).send('Restaurant not found.')
      return
    }
    for (let i = 0; i < restaurant.listDishes.length; i++) {
      if (restaurant.listDishes[i]._id === req.params._id) {
        dishesUpdated.splice(i, 1)
        await Dish.findByIdAndRemove(req.params._id)
        await Restaurant.findByIdAndUpdate({ _id: dishToDelete.restaurant._id }, { listDishes: dishesUpdated })
        res.status(200).send('Dish deleted and restaurant updated.')
        return
      }
    }
  }

  routes () {
    this.router.get('/', [authJwt.VerifyToken], this.getAllDishes)
    this.router.get('/:_id', [authJwt.VerifyToken], this.getDishById)
    this.router.post('/', [authJwt.VerifyTokenOwner], this.addDish)
    this.router.put('/:_id', [authJwt.VerifyTokenOwner], this.updateDish)
    this.router.delete('/:_id', [authJwt.VerifyTokenOwner], this.deleteDish)
  }
}
const dishesRoutes = new DishesRoutes()

export default dishesRoutes.router
