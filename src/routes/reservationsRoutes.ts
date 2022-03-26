import {Request, response, Response, Router} from 'express';
import { request } from 'http';
import mongoose from 'mongoose';
import Customer from '../models/Customer';

import Reservation from '../models/Reservation';
import Restaurant from '../models/Restaurant';

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
            res.status(404).send("Reservation not found.");
        }
        else{
            res.status(200).send(ownerFound);
        }
    }


    public async addReservation (req: Request, res: Response) : Promise<void> {
        const reservationFound = await Reservation.findOne({_idCustomer: req.body._idCustomer, _idRestaurant: req.body._idRestaurant, dateReservation: req.body.dateReservation});
        if (reservationFound != null){
            res.status(409).send("This reservation already exists.")
            return;
        }
        
        const {_idCustomer, _idRestaurant, dateReservation, timeReservation} = req.body;
        const newReservation = new Reservation({_idCustomer, _idRestaurant, dateReservation, timeReservation});

        const customer = await Customer.findById(_idCustomer);
        const restaurant = await Restaurant.findById(_idRestaurant);
        if ((customer == null) || (restaurant == null)){
            res.status(404).send("Customer or Restaurant not found.");
            return;
        }
        let listReservationsCustomer: mongoose.Types.ObjectId [];
        listReservationsCustomer  = customer.listReservations;
        let listReservationsUpdated: mongoose.Types.ObjectId [];
        let newReservationID: mongoose.Types.ObjectId;
        await newReservation.save().then(reservation => {
            newReservationID = reservation._id.toString();
            listReservationsCustomer.push(newReservationID);
        });
        await Customer.findByIdAndUpdate({_id: _idCustomer}, {listReservations: listReservationsCustomer});
        res.status(201).send('Reservation added and customer updated.');
        
            
        
    }


    public async deleteReservation(req: Request, res: Response) : Promise<void> {
        
        const reservationToDelete = await Reservation.findById(req.params._id);
        if (reservationToDelete == null){
            res.status(404).send("Reservation not found.")
            return;
        }
        
        let customer = await Customer.findById({_id: reservationToDelete._idCustomer});
        if (customer == null){
            res.status(404).send("Customer not found.")
            return;
        }
        let listReservationsCustomer = customer.listReservations;
        for (let i = 0; i<listReservationsCustomer.length; i++){
            if (listReservationsCustomer[i].toString() == reservationToDelete._id.toString()){
                console.log("AAAAAAAAAAA")
                listReservationsCustomer.splice(i, 1);
            }
        }
        await Customer.findByIdAndUpdate({_id: reservationToDelete._idCustomer},{listReservations: listReservationsCustomer});
        await Reservation.findByIdAndDelete({_id: reservationToDelete._id});
        res.status(200).send('Reservation deleted.');

       //await Reservation.findByIdAndDelete({_id: req.params._id});
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
