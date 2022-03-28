import {Request, response, Response, Router} from 'express';

import Customer from '../models/Customer';
import Restaurant from '../models/Restaurant';

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

    public async getCustomerById(req: Request, res: Response) : Promise<void> {
        const customerFound = await Customer.findById(req.params._id).populate("listReservations");
        if(customerFound == null){
            res.status(404).send("Customer not found.");
        }
        else{
            res.status(200).send(customerFound);
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
            const {customerName, fullName, email, password} = req.body;
            const newCustomer = new Customer({customerName, fullName, email, password});
            await newCustomer.save();
            res.status(201).send('Customer added.');
        }
    }

    public async updateCustomer(req: Request, res: Response) : Promise<void> {
        const customerToUpdate = await Customer.findByIdAndUpdate (req.params._id, req.body);
        if(customerToUpdate == null){
            res.status(404).send("Customer not found.");
        }
        else{
            res.status(201).send("Customer updated.");
        }
    }

    public async addDiscount(req: Request, res: Response) : Promise<any> {
        const customer = await Customer.findById(req.params._id);
        const restaurant = await Restaurant.find({restaurantName: req.body.nameRestaurant});
        if (customer == null){
            res.status(404).send("Customer not found.");
            return;
        }
        if (restaurant == null){
            res.status(404).send("Restaurant not found.");
            return;
        }

        await Customer.findByIdAndUpdate({_id: req.params._id}, {$push: {listDiscounts : req.body}});

        res.status(200).send("Discounts updated."); 
        
    }

    public async removeDiscount(req: Request, res: Response) : Promise<any> {
        const customer = await Customer.findById(req.params._id);
        const restaurant = await Restaurant.find({restaurantName: req.body.nameRestaurant});
        if (customer == null){
            res.status(404).send("Customer not found.");
            return;
        }
        if (restaurant == null){
            res.status(404).send("Restaurant not found.");
            return;
        }
        let listDiscountsCustomer = customer.listDiscounts;
        let found = 0;
        for (let i = 0; i < listDiscountsCustomer.length; i++){
            if ((listDiscountsCustomer[i].nameRestaurant == req.body.nameRestaurant) 
            && (listDiscountsCustomer[i].amount == req.body.amount)
            && (listDiscountsCustomer[i].timeReservation == req.body.timeReservation)){
                listDiscountsCustomer.splice(i, 1);
                found = 1;
            }
        }
        if (found == 0){
            res.status(404).send("The customer does not have this discount.")
            return;
        }
        await Customer.findByIdAndUpdate(req.params._id, {listDiscounts: listDiscountsCustomer});
        res.status(200).send("Discount removed.")
    }


    public async addTaste(req: Request, res: Response) : Promise<any> {
        const customer = await Customer.findById(req.params._id);
        let listTastesCustomer = customer.listTastes;
        if (customer == null){
            res.status(404).send("Customer not found.");
            return;
        }
        //Customer.findByIdAndUpdate({_id: req.params._id}, {$push: {listTastes: listTastesAdd}})
        const listTagsCustomer = listTastesCustomer.map(taste => taste.tagName);
        const listTagsAdd = req.body.listTastes.map(tagName => tagName.tagName);
        for (let i = 0; i<listTagsAdd.length; i++){
            if (listTagsCustomer.includes(listTagsAdd[i])){
                return res.status(409).send("Taste already exists.");
            }
            else{
                listTastesCustomer.push(req.body.listTastes[i]);
            }
        }
        await customer.updateOne({listTastes: listTastesCustomer});
        res.status(200).send("Tastes updated."); 
        
    }

    public async removeTaste(req: Request, res: Response) : Promise<any> {
        const customer = await Customer.findById(req.params._id);
        if (customer == null){
            res.status(404).send("Customer not found.");
            return;
        }
        let listTastesCustomer = customer.listTastes;
        const listTagsCustomer = listTastesCustomer.map(taste => taste.tagName);
        const listTagsRm = req.body.listTastes.map(tagName => tagName.tagName);
        for (let i = 0; i<listTagsRm.length; i++){
            const index = listTagsCustomer.indexOf(listTagsRm[i]);
            if (index == -1){
                return res.status(409).send("The user might not have some of these tastes yet.");
            }
            else{
                listTastesCustomer.splice(index,1);
            }
        }
          
        await customer.updateOne({listTastes: listTastesCustomer});
        return res.status(200).send("Taste deleted.")
    }

    public async deleteCustomer(req: Request, res: Response) : Promise<void> {
        const customerToDelete = await Customer.findByIdAndDelete (req.params._id);
        if (customerToDelete == null){
            res.status(404).send("Customer not found.")
        }
        else{
            res.status(200).send('Customer deleted.');
        }
    } 

    routes() {
        this.router.get('/', this.getAllCustomers);
        this.router.get('/:_id', this.getCustomerById);
        this.router.get('/name/:customerName', this.getCustomerByName);
        this.router.post('/', this.addCustomer);
        this.router.put('/:_id', this.updateCustomer);
        this.router.put('/discounts/add/:_id', this.addDiscount);
        this.router.put('/discounts/remove/:_id', this.removeDiscount);
        this.router.put('/tastes/add/:_id', this.addTaste);
        this.router.put('/tastes/remove/:_id', this.removeTaste);
        this.router.delete('/:_id', this.deleteCustomer);
    }
}
const customersRoutes = new CustomerRoutes();

export default customersRoutes.router;