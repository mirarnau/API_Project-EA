import {Request, response, Response, Router} from 'express';
import { request } from 'http';

import Reservation from '../models/Reservation';

class ReservationsRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

    public async getAllReservations(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
        const allReservations = await Reservation.find();
        if (allReservations.length == 0){
            res.status(404).send("There are no reservations yet.")
        }
        else{
            res.status(200).send(allReservations);
        }
    }
    
    public async getReservationById(req: Request, res: Response) : Promise<void> {
        const ownerFound = await Reservation.findById(req.params._id).populate('_idCustomer _idRestaurant');
        if(ownerFound == null){
            res.status(404).send("Owner not found.");
        }
        else{
            res.status(200).send(ownerFound);
        }
    }

    public async addReservation (req: Request, res: Response) : Promise<void> {
        const reservationFound = await Reservation.findOne({_idCustomer: req.body._idCustomer, _idRestaurant: req.body._idRestaurant, dateReservation: req.body.dateReservation})
        if (reservationFound != null){
            res.status(409).send("This reservation already exists.")
        }
        else{
            const {_idCustomer, _idRestaurant, dateReservation, timeReservation} = req.body;
            const newReservation = new Reservation({_idCustomer, _idRestaurant, dateReservation, timeReservation});
            await newReservation.save();
            res.status(201).send('Reservation added.');
        }
    }

    public async deleteReservation(req: Request, res: Response) : Promise<void> {
        const reservationToDelete = await Reservation.findByIdAndDelete (req.params._id);
        if (reservationToDelete == null){
            res.status(404).send("Reservation not found.")
        }
        else{
            res.status(200).send('Reservation deleted.');
        }
    } 

    
    routes() {
        this.router.get('/', this.getAllReservations);
        this.router.get('/:_id', this.getReservationById);
        this.router.post('/', this.addReservation);
        this.router.delete('/:_id', this.deleteReservation);
    }
}

const ownersRoutes = new ReservationsRoutes();
export default ownersRoutes.router;
