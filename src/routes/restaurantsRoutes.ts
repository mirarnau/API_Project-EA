import {Request, response, Response, Router} from 'express';

import Restaurant from '../models/Restaurant';

class RestaurantsRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

    public async getAllRestaurants(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
        const allRestaurants = await Restaurant.find();
        if (allRestaurants.length == 0){
            res.status(404).send("There are no restaurants yet.")
        }
        else{
            res.status(200).send(allRestaurants);
        }
    }

    public async getRestaurantByName(req: Request, res: Response) : Promise<void> {
        const restaurantFound = await Restaurant.findOne({restaurantName: req.params.restaurantName});
        if(restaurantFound == null){
            res.status(404).send("Restaurant not found.");
        }
        else{
            res.status(200).send(restaurantFound);
        }
    }

    public async addRestaurant(req: Request, res: Response) : Promise<void> {
        const restaurantFound = await Restaurant.findOne({restaurantName: req.body.restaurantName})
        if (restaurantFound != null){
            res.status(409).send("This restaurant already exists.")
        }
        else{
            const {id, idOwner, restaurantName, email, address, description, owner, listTags} = req.body;
            const newRestaurant = new Restaurant({id, idOwner, restaurantName, email, address, description, owner, listTags});
            await newRestaurant.save();
            res.status(201).send('Restaurant added.');
        }
    }

    public async updateRestaurant(req: Request, res: Response) : Promise<void> {
        const customerToUpdate = await Restaurant.findOneAndUpdate ({restaurantName: req.params.restaurantName}, req.body);
        if(customerToUpdate == null){
            res.status(404).send("Restaurant not found.");
        }
        else{
            res.status(201).send('Restaurant updated.');
        }
    }

    public async deleteRestaurant(req: Request, res: Response) : Promise<void> {
        const restaurantToDelete = await Restaurant.findOneAndDelete ({restaurantName:req.params.restaurantName}, req.body);
        if (restaurantToDelete == null){
            res.status(404).send("Restaurant not found.")
        }
        else{
            res.status(200).send('Restaurant deleted.');
        }
    } 
    
    public async getRestaurantsByTags(req:Request, res: Response) : Promise<void> {
        const listTastesCustomer = req.body.tags;
        console.log(listTastesCustomer);
        if (listTastesCustomer.length == 0){
            res.status(409).send("No tags specidfied in the petition.")
        }
        else{
            const listTags = listTastesCustomer.map(taste => taste.tagName);
            const allRestaurants = await Restaurant.find();
            const filteredRestaurants = allRestaurants.filter((restaurant) => {
                for (let i = 0; i < listTags.length; i++){
                    if (restaurant.listTags.contains(listTags[i])){
                        return restaurant;
                    }
                }
            })
            res.status(200).send(filteredRestaurants);
            if (filteredRestaurants.length == 0){
                res.status(404).send("Any restaurant fulfills this tags.")
            }
        }
    }    
    routes() {
        this.router.get('/', this.getAllRestaurants);
        this.router.get('/:restaurantName', this.getRestaurantByName);
        this.router.post('/', this.addRestaurant);
        this.router.put('/:restaurantName', this.updateRestaurant);
        this.router.delete('/:restaurantName', this.deleteRestaurant);
        this.router.get('/filters', this.getRestaurantsByTags);
    }
}
const restaurantsRoutes = new RestaurantsRoutes();

export default restaurantsRoutes.router;