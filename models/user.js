const {Schema, model} = require('mongoose');
const {createHmac, randomBytes} = require('node:crypto');
const { createTokenForUser } = require('../service/auth');


const userSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
    },
    password:{
        type: String,
        required: true,
        
    },
    profileImage:{
        type: String,
        default: "/images/defaultImage.png"
                
    },
    role:{
        type: String,
        enum: ["USER","ADMIN"],
        default : "USER"
                
    }
},{timeseries: true})

// password encript
userSchema.pre('save', function (next){
    const user = this;

    if(!user.isModified("password")) return;
 
    const salt = randomBytes(16).toString();
    // const salt = "rendomvalue";

    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
    next();

})

userSchema.static('matchPasswordAndGenerateToken', async function(email,password){
    const user = await this.findOne({email});

    if(!user) throw new Error( "User is not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userPrividedHash = createHmac('sha256', salt).update(password).digest('hex');
    if(hashedPassword !==userPrividedHash) throw new Error( "Incorrect Password")
        
    const  token = createTokenForUser(user);
    return token;
})

const User = model("user", userSchema);
module.exports = User;
