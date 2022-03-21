import {Request, response, Response, Router} from 'express';

import Menu from '../models/Menu';

class MenuRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

    public async getAllMenus(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
        const allMenus = await Menu.find();
        if (allMenus.length == 0){
            res.status(404).send("There are no menus yet.")
        }
        else{
            res.status(200).send(allMenus);
        }
    }

    public async getMenuById(req: Request, res: Response) : Promise<void> {
        const menuFound = await Menu.findById(req.params._id).populate('owner');
        if(menuFound == null){
            res.status(404).send("Menu not found.");
        }
        else{
            res.status(200).send(menuFound);
        }
    }
    
    public async addMenu(req: Request, res: Response) : Promise<void> {
        const {owner, title, type, description, price} = req.body;
        const newMenu = new Menu({owner, title, type, description, price});
        await newMenu.save();
        res.status(201).send('Menu added.');
        
    }

    public async updateMenu (req: Request, res: Response) : Promise<void> {
        const menuToUpdate = await Menu.findByIdAndUpdate (req.params._id, req.body);
        if(menuToUpdate == null){
            res.status(404).send("Menu not found.");
        }
        else{
            res.status(201).send("Menu updated.");
        }
    }

    public async deleteMenu (req: Request, res: Response) : Promise<void> {
        const menuToDelete = await Menu.findByIdAndDelete (req.params._id);
        if (menuToDelete == null){
            res.status(404).send("Menu not found.")
        }
        else{
            res.status(200).send('Menu deleted.');
        }
    } 

    routes() {
        this.router.get('/', this.getAllMenus);
        this.router.get('/:_id', this.getMenuById);
        this.router.post('/', this.addMenu);
        this.router.put('/:_id', this.updateMenu);
        this.router.delete('/:_id', this.deleteMenu);
    }
}
const menusRoutes = new MenuRoutes();

export default menusRoutes.router;