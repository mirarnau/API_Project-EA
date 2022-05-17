import {Request, response, Response, Router} from 'express';
import { authJwt } from '../middlewares';
import Ticket from '../models/Ticket';

class TicketsRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

    //It returns all tickets in the system (from every creator)
    public async getAllTickets(req: Request, res: Response) : Promise<void> { 
        const allTickets = await Ticket.find();
        if (allTickets.length == 0){
            res.status(404).send("There are no tickets yet.")
        }
        else{
            res.status(200).send(allTickets);
        }
    }

    //It returns ALL tickets that a creator has created, the opened and closed ones.
    public async getTicketsByCreator(req: Request, res: Response) : Promise<void> { 
        const ticketsFound = await Ticket.findOne({creatorName: req.params.creatorName});
        if(ticketsFound == null){
            res.status(404).send("The user has not created any ticket ");
        }
        else{
            res.status(200).send(ticketsFound);
        }
    }

    //It returns the tickets that the recipient has received, both opened and closed.
    public async getTicketsByRecipient(req: Request, res: Response) : Promise<void> { 
        const ticketsFound = await Ticket.findOne({recipientName: req.params.recipientName});
        if(ticketsFound == null){
            res.status(404).send("The user has not received any ticket.");
        }
        else{
            res.status(200).send(ticketsFound);
        }
    }

    //Adds a ticket to the system with default value of status set to false (opened ticket)
    public async addTicket(req: Request, res: Response) : Promise<void> {
        const {creatorName, recipientName, subject, message} = req.body;
        const newTicket = new Ticket({creatorName, recipientName, subject, message});
        await newTicket.save();
        res.status(201).send('Ticket added.');
        
    }

    //It updates the status of the ticket (true: closed, false: opened) by the _id of the ticket
    public async updateTicketStatus (req: Request, res: Response) : Promise<void> {
        const ticketToUpdate = await Ticket.findByIdAndUpdate (req.params._id, {status: req.body.status});
        if(ticketToUpdate == null){
            res.status(404).send("Ticket not found.");
        }
        else{
            res.status(201).send("Ticket status updated.");
        }
    }

    //Deletes a ticket (by _id) from the system.
    public async deleteTicket (req: Request, res: Response) : Promise<void> {
        const ticketToDelete = await Ticket.findByIdAndDelete (req.params._id);
        if (ticketToDelete == null){
            res.status(404).send("Dish not found.");
            return;
        }
        res.status(200).send("Ticket deleted.")
    } 

    routes() {

        this.router.get('/', [authJwt.VerifyToken], this.getAllTickets);
        this.router.get('/creator/:creatorName', [authJwt.VerifyToken], this.getTicketsByCreator);
        this.router.get('/recipient/:recipientName', [authJwt.VerifyToken], this.getTicketsByRecipient);
        this.router.post('/', [authJwt.VerifyTokenCustomer], this.addTicket);
        this.router.put('/:_id', [authJwt.VerifyTokenCustomer], [authJwt.VerifyTokenOwner] ,this.updateTicketStatus);
        this.router.delete('/:_id', [authJwt.VerifyToken], this.deleteTicket);
    }
}
const ticketsRoutes = new TicketsRoutes();

export default ticketsRoutes.router;