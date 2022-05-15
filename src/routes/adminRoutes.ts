import {Request, response, Response, Router} from 'express';
import {authJwt} from '../middlewares/index';
import Customer from '../models/Customer';
import Restaurant from '../models/Restaurant';
import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import Admin from '../models/Admin';

class AdminRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes(); //This has to be written here so that the method can actually be configured when called externally.
    }

public async login(req: Request, res: Response) : Promise<void> {
    const adminFound = await Admin.findOne({adminName: req.body.adminName});
    const SECRET = process.env.JWT_SECRET;

    if(!adminFound) {
        res.status(400).json({message: "Invalid AdminName and/or Password"});
    }
    else {
        const matchPassword = await bcrypt.compare(req.body.password, adminFound.password);
    
        if(!matchPassword) {
            res.status(401).json({token: null, message: "Invalid AdminName and/or Password"});
        }
        else {
            const token = jwt.sign(
                { id: adminFound._id, adminName: adminFound.adminName }, 
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

public async register(req: Request, res: Response) : Promise<void> {
    const adminFound = await Admin.findOne({adminName: req.body.adminName});

    if (adminFound != null) {
        res.status(409).send("This admin already exists.")
    }
    else {
        const {adminName, fullName, email, password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const newAdmin = new Admin({adminName, fullName, email, password: hashed});
        const savedUser = await newAdmin.save();

        res.status(200).json("Admin added");
    }
}

public async getAllAdmins(req: Request, res: Response) : Promise<void> { //It returns a void, but internally it's a promise.
    const allCustomers = await Admin.find();
    if (allCustomers.length == 0) {
        res.status(404).send("There are no admins yet.")
    }
    else{
        res.status(200).send(allCustomers);
    }
}

routes() {
    this.router.get('', [authJwt.VerifyTokenAdmin], this.getAllAdmins);
    this.router.post('/login', this.login);
    this.router.post('/register', this.register);
}


}
const adminRoutes = new AdminRoutes();

export default adminRoutes.router;