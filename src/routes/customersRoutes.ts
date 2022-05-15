import {Request, response, Response, Router} from 'express';
import {authJwt} from '../middlewares/index';
import Customer from '../models/Customer';
import Restaurant from '../models/Restaurant';
import bcrypt, { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';


class CustomerRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

    public async getAllCustomers(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
        const allCustomers = await Customer.find();
        if (allCustomers.length == 0) {
            res.status(404).send("There are no customers yet.")
        }
        else{
            res.status(200).send(allCustomers);
        }
    }

    public async getCustomerById(req: Request, res: Response) : Promise<void> {
        const customerFound = await Customer.findById(req.params._id).populate("listReservations");
        if(customerFound == null) {
            res.status(404).send("Customer not found.");
        }
        else{
            res.status(200).send(customerFound);
        }
    }

    public async getCustomerByName(req: Request, res: Response) : Promise<void> {
        const customerFound = await Customer.findOne({customerName: req.params.customerName});
        if(customerFound == null) {
            res.status(404).send("Customer not found.");
        }
        else{
            res.status(200).send(customerFound);
        }
    }
  
    public async login(req: Request, res: Response) : Promise<void> {
        const userFound = await Customer.findOne({adminName: req.body.adminName});
        const SECRET = process.env.JWT_SECRET;
    
        if(!userFound) {
            res.status(400).json({message: "Invalid credentials"});
        }
        else {
            const matchPassword = await bcrypt.compare(req.body.password, userFound.password);
        
            if(!matchPassword) {
                res.status(401).json({token: null, message: "Invalid credentials"});
            }
            else {
                const token = jwt.sign(
                    { id: userFound._id, customerName: userFound.customerName, role: userFound.role }, 
                    SECRET!, 
                    {
                    expiresIn: 3600
                    }
                );
            
                res.status(200).send({ token: token });
                console.log(token);
            }
        }
    }
    
    public async addCustomer(req: Request, res: Response) : Promise<void> {
        const customerFound = await Customer.findOne({customerName: req.body.customerName})
        if (customerFound != null){
            res.status(409).send("This customer already exists.")
        }
        else {
            const {customerName, fullName, email, password} = req.body;
            //const salt = await bcrypt.genSalt(10);
            //const hashed = await bcrypt.hash(password, salt);
            //const newCustomer = new Customer({customerName, fullName, email, password: hashed});
            const newCustomer = new Customer({customerName, fullName, email, password});
            const savedUser = await newCustomer.save();
          
            res.status(200).json("Customer added");
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
        let discountsBody = req.body.listDiscounts;
        for (let i = 0; i < discountsBody.length; i++){
            let found = 0;
            const discount = discountsBody[i];
            for (let u = 0; u < customer.listDiscounts.length; u++){
                if ((customer.listDiscounts[u].nameRestaurant == discount.nameRestaurant) 
                && (customer.listDiscounts[u].amount == discount.amount)
                && (customer.listDiscounts[u].expirationDate == discount.expirationDate)){
                    found = 1;
                }
            }
            if (found == 0){
                await Customer.findByIdAndUpdate({_id: req.params._id}, {$push: {listDiscounts : discount}});
            }
        }
        res.status(201).send("Discounts added."); 
        
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
        res.status(201).send("Tastes added."); 
        
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
        this.router.get('/', [authJwt.VerifyTokenAdmin], this.getAllCustomers);
        this.router.put('/discounts/add/:_id', [authJwt.VerifyTokenOwner], this.addDiscount);
        this.router.get('/:_id', [authJwt.VerifyTokenAdmin], this.getCustomerById);
        this.router.get('/name/:customerName', [authJwt.VerifyTokenAdmin], this.getCustomerByName);
        this.router.post('/', this.addCustomer); //Anyone should be able to register to the app as a customer
        this.router.post('/login', this.login); //Anyone should be able to login to the app as a customer
        this.router.put('/:_id', [authJwt.VerifyTokenCustomer], this.updateCustomer);
        this.router.put('/tastes/add/:_id', [authJwt.VerifyTokenCustomer], this.addTaste);
        this.router.put('/tastes/remove/:_id', [authJwt.VerifyTokenCustomer], this.removeTaste);
        this.router.delete('/:_id', [authJwt.VerifyTokenCustomer], this.deleteCustomer);

    }
}
const customersRoutes = new CustomerRoutes();

export default customersRoutes.router;