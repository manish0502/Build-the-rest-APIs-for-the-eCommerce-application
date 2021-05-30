const Joi = require('joi');
import CustomErrorHandler  from '../../services/CustomErrorHandler.js'
import { User ,RefreshToken} from '../../models'
const bcrypt = require("bcrypt");
import { REFRESH_SECRET } from '../../config'




import JwtService from '../../services/JwtService';

 const registerController = {

    async register(req,res,next) {

    // CHECKLIST
    // [ ] validate the request
    // [ ] authorise the request
    // [ ] check if user is in the database already
    // [ ] prepare model
    // [ ] store in database
    // [ ] generate jwt token
    // [ ] send response


    // validations

    const registerSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: Joi.ref('password')
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
        return next(error);
    }

    try {

      const exist = await User.exists({ email: req.body.email });
      if(exist){
          return next(CustomErrorHandler.alreadyExists('This Email is already Taken'));
      }

    }

    catch(err){

      return next(err);

    }


    // hash password 

    const { name ,email, password } = req.body;

    const hashpassword = await bcrypt.hash(password, 12);


    // preparing for model 


    const user = new User({
      name,
      email,
      password: hashpassword,
    });

  let access_token;
  let refresh_token;

      
  try{
    const result = await user.save();
     console.log(result);
     access_token = JwtService.sign({ _id: result._id, role: result.role });
     refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);
     await RefreshToken.create({ token: refresh_token });


  
  }
  catch(err){

    return next(err);
  

  }
      res.json({  access_token , refresh_token})  

    }
}

 export default registerController;