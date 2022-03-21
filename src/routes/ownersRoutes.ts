import {Request, response, Response, Router} from 'express';
import { request } from 'http';

import Owner from '../models/Owner';

class OwnersRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

    public async getAllOwners(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
        const allOwners = await Owner.find();
        if (allOwners.length == 0){
            res.status(404).send("There are no owners yet.")
        }
        else{
            res.status(200).send(allOwners);
        }
    }
    

    public async getOwnerById(req: Request, res: Response) : Promise<void> {
        const ownerFound = await Owner.findById(req.params._id);
        if(ownerFound == null){
            res.status(404).send("Owner not found.");
        }
        else{
            res.status(200).send(ownerFound);
        }
    }

    public async getOwnerByName(req: Request, res: Response) : Promise<void> {
        const ownerFound = await Owner.findOne({ownerName: req.params.ownerName});
        if(ownerFound == null){
            res.status(404).send("Owner not found.");
        }
        else{
            res.status(200).send(ownerFound);
        }
    }
    

    public async addOwner(req: Request, res: Response) : Promise<void> {
        const ownerFound = await Owner.findOne({ownerName: req.body.ownerName})
        if (ownerFound != null){
            res.status(409).send("This owner already exists.")
        }
        else{
            const {ownerName, fullName, email, password} = req.body;
            const newOwner = new Owner({ownerName, fullName, email, password});
            await newOwner.save();
            res.status(201).send('Owner added.');
        }
    }

    public async updateOwner(req: Request, res: Response) : Promise<void> {
        const ownerToUpdate = await Owner.findOneAndUpdate ({ownerName: req.params.ownerName}, req.body);
        if(ownerToUpdate == null){
            res.status(404).send("Owner not found.");
        }
        else{
            res.status(201).send('Owner updated.');
        }
    }

    public async deleteOwner(req: Request, res: Response) : Promise<void> {
        const ownerToDelete = await Owner.findByIdAndDelete (req.params._id);
        if (ownerToDelete == null){
            res.status(404).send("Owner not found.")
        }
        else{
            res.status(200).send('Owner deleted.');
        }
    } 

    
    routes() {
        this.router.get('/', this.getAllOwners);
        this.router.get('/:_id', this.getOwnerById);
        this.router.get('/name/:ownerName', this.getOwnerByName);
        this.router.post('/', this.addOwner);
        this.router.put('/:ownerName', this.updateOwner);
        this.router.delete('/:_id', this.deleteOwner);
    }
}
const ownersRoutes = new OwnersRoutes();

export default ownersRoutes.router;
