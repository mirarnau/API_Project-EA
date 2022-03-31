import {Request, response, Response, Router} from 'express';

import Menu from '../models/Dish';

class DishesRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

    public async getAllDishes(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
        const allMenus = await Menu.find();
        if (allMenus.length == 0){
            res.status(404).send("There are no dishes yet.")
        }
        else{
            res.status(200).send(allMenus);
        }
    }

    public async getDishById(req: Request, res: Response) : Promise<void> {
        const menuFound = await Menu.findById(req.params._id).populate('restaurant');
        if(menuFound == null){
            res.status(404).send("Menu not found.");
        }
        else{
            res.status(200).send(menuFound);
        }
    }
    
    public async addDish(req: Request, res: Response) : Promise<void> {
        const {restaurant, title, type, description, price} = req.body;
        const newMenu = new Menu({restaurant, title, type, description, price});
        await newMenu.save();
        res.status(201).send('Dish added.');
        
    }

    public async updateDish (req: Request, res: Response) : Promise<void> {
        const menuToUpdate = await Menu.findByIdAndUpdate (req.params._id, req.body);
        if(menuToUpdate == null){
            res.status(404).send("Dish not found.");
        }
        else{
            res.status(201).send("Dish updated.");
        }
    }

    public async deleteDish (req: Request, res: Response) : Promise<void> {
        const menuToDelete = await Menu.findByIdAndDelete (req.params._id);
        if (menuToDelete == null){
            res.status(404).send("Dish not found.")
        }
        else{
            res.status(200).send('Dish deleted.');
        }
    } 

    routes() {
        this.router.get('/', this.getAllDishes);
        this.router.get('/:_id', this.getDishById);
        this.router.post('/', this.addDish);
        this.router.put('/:_id', this.updateDish);
        this.router.delete('/:_id', this.deleteDish);
    }
}
const dishesRoutes = new DishesRoutes();

export default dishesRoutes.router;