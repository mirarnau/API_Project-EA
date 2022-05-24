import {
  Request, Response, Router
} from 'express'
import mongoose from 'mongoose'
import { authJwt } from '../middlewares'
import Ticket from '../models/Ticket'
import Message from '../models/Message'

class TicketsRoutes {
  public router: Router

  constructor () {
    this.router = Router()
    this.routes() // This has to be written here so that the method can actually be configured when called externally.
  }

  // It returns all tickets in the system (from every creator)
  public async getAllTickets (req: Request, res: Response) : Promise<void> {
    const allTickets = await Ticket.find().populate('messages')
    if (allTickets.length === 0) {
      res.status(404).send('There are no tickets yet.')
    } else {
      res.status(200).send(allTickets)
    }
  }

  // It returns ALL tickets that a creator has created, the opened and closed ones.
  public async getTicketsByCreator (req: Request, res: Response) : Promise<void> {
    const ticketsFound = await Ticket.find({ creatorName: req.params.creatorName }).populate('messages')
    if (ticketsFound == null) {
      res.status(404).send('The user has not created any ticket ')
    } else {
      res.status(200).send(ticketsFound)
    }
  }

  // It returns the tickets that the recipient has received, both opened and closed.
  public async getTicketsByRecipient (req: Request, res: Response) : Promise<void> {
    const ticketsFound = await Ticket.find({ recipientName: req.params.recipientName }).populate('messages')
    if (ticketsFound == null) {
      res.status(404).send('The user has not received any ticket.')
    } else {
      res.status(200).send(ticketsFound)
    }
  }

  // Adds a ticket to the system with default value of status set to false (opened ticket), and without messages.
  public async addTicket (req: Request, res: Response) : Promise<void> {
    const { creatorName, recipientName, subject } = req.body
    const newTicket = new Ticket({ creatorName, recipientName, subject })
    await newTicket.save()
    res.status(201).send(newTicket)
  }

  // It updates the status of the ticket (true: closed, false: opened) by the _id of the ticket
  public async updateTicketStatus (req: Request, res: Response) : Promise<void> {
    const ticketToUpdate = await Ticket.findByIdAndUpdate(req.params._id, { status: req.body.status })
    if (ticketToUpdate == null) {
      res.status(404).send('Ticket not found.')
    } else {
      res.status(201).send('Ticket status updated.')
    }
  }

  // Deletes a ticket (by _id) from the system.
  public async deleteTicket (req: Request, res: Response) : Promise<void> {
    const ticketToDelete = await Ticket.findByIdAndDelete(req.params._id)
    if (ticketToDelete == null) {
      res.status(404).send('Ticket not found.')
      return
    }
    res.status(200).send('Ticket deleted.')
  }

  public async addMessageToTicket (req: Request, res: Response) : Promise<void> {
    const {
      senderName, receiverName, message, profilePicSender
    } = req.body
    const newMessage = new Message({
      senderName, receiverName, message, profilePicSender
    })

    const ticket = await Ticket.findById({ _id: req.params._id })

    let newMessageID: mongoose.Types.ObjectId
    await newMessage.save().then((message) => {
      newMessageID = message._id.toString()
      ticket.messages.push(newMessageID)
    })

    await Ticket.findByIdAndUpdate({ _id: ticket._id }, { messages: ticket.messages })
    res.status(201).send('Message added to ticket.')
  }

  public async getAllMessagesTicket (req: Request, res: Response) : Promise<void> {
    const ticket = await Ticket.findById({ _id: req.params._id }).populate('messages')
    res.status(200).send(ticket.messages)
  }

  routes () {
    this.router.get('/', [authJwt.VerifyToken], this.getAllTickets)
    this.router.get('/messages/:_id', [authJwt.VerifyToken], this.getAllMessagesTicket)
    this.router.get('/creator/:creatorName', [authJwt.VerifyToken], this.getTicketsByCreator)
    this.router.get('/recipient/:recipientName', [authJwt.VerifyToken], this.getTicketsByRecipient)
    this.router.post('/', [authJwt.VerifyToken], this.addTicket)
    this.router.post('/:_id', [authJwt.VerifyToken], this.addMessageToTicket)
    this.router.put('/:_id', [authJwt.VerifyToken], this.updateTicketStatus)
    this.router.delete('/:_id', [authJwt.VerifyToken], this.deleteTicket)
  }
}
const ticketsRoutes = new TicketsRoutes()

export default ticketsRoutes.router
