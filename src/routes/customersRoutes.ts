import {Request, response, Response, Router} from 'express';

import Customer from '../models/Customer';

class CustomerRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

    public async getAllCustomers(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
        const allCustomers = await Customer.find();
        if (allCustomers.length == 0){
            res.status(404).send("There are no customers yet.")
        }
        else{
            res.status(200).send(allCustomers);
        }
    }

    public async getCustomerByName(req: Request, res: Response) : Promise<void> {
        const customerFound = await Customer.findOne({customerName: req.params.customerName});
        if(customerFound == null){
            res.status(404).send("Customer not found.");
        }
        else{
            res.status(200).send(customerFound);
        }
    }
    
    public async addCustomer(req: Request, res: Response) : Promise<void> {
        const customerFound = await Customer.findOne({customerName: req.body.customerName})
        if (customerFound != null){
            res.status(409).send("This customer already exists.")
        }
        else{
            const {id, customerName, fullName, email, password} = req.body;
            const newCustomer = new Customer({id, customerName, fullName, email, password});
            await newCustomer.save();
            res.status(201).send('Customer added.');
        }
    }

    public async updateCustomer(req: Request, res: Response) : Promise<void> {
        const customerToUpdate = await Customer.findOneAndUpdate ({customerName: req.params.customerName}, req.body);
        if(customerToUpdate == null){
            res.status(404).send("Customer not found.");
        }
        else{
            res.status(201).send('Customer updated.');
        }
    }

    public async deleteCustomer(req: Request, res: Response) : Promise<void> {
        const customerToDelete = await Customer.findOneAndDelete ({customerName:req.params.customerName}, req.body);
        if (customerToDelete == null){
            res.status(404).send("Customer not found.")
        }
        else{
            res.status(200).send('Customer deleted.');
        }
    } 
    
    routes() {
        this.router.get('/', this.getAllCustomers);
        this.router.get('/:customerName', this.getCustomerByName);
        this.router.post('/', this.addCustomer);
        this.router.put('/:customerName', this.updateCustomer);
        this.router.delete('/:customerName', this.deleteCustomer);
    }
}
const customersRoutes = new CustomerRoutes();

export default customersRoutes.router;