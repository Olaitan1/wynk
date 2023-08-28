const User = require('../model/user-model');
const {registerSchema, loginSchema, GenerateToken, GeneratePassword, GenerateSalt, option, calculateElectricityCost} = require ('../utils/index')
const bcrypt = require  ('bcrypt');
const ElectricityPurchase = require ('../model/elctricity-model')

/*************************  USER REGISTERATION **************************/

const register = async (req, res) =>
{
    try
    {
        const { email, username, password } = req.body
        const validateRegister = registerSchema.validate(req.body, option);
        if (validateRegister.error)
        {
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
        //Generate salt
        const salt = await GenerateSalt(10);
        //Encrypting password
        const userPassword = await GeneratePassword(password, salt);
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user)
        {
            if (user.username === username)
            {
                return res.status(400).json({ Error: "Username already exists" });
            }
            if (user.email === email)
            {
                return res.status(400).json({ Error: "User email already exists" });
            }
        }

        //create admin
      const createUser = await User.create({
        username,
        email,
        password: userPassword,
        balance:100
      });
        return res.status(201).json(
            {
                message: "User created successfully",
                newUser: createUser
            }
            
        )
        
    } catch (error)
    {
        res.status(500).json(error)
        console.log(error)
    }
};

/************************************* USER LOGIN ******************************/

const login = async (req, res) => {
  try {
    const { email, password } = req.body
        const validateRegister = loginSchema.validate(req.body, option);
        if (validateRegister.error)
        {
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
    // Find the admin by email
    const user = await User.findOne({ email });
    
    // Check if the admin exists
    if (!user) {
      return res.status(404).json({ error: "Not a registered User" });
    }
    
    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    
    // Generate and return a token if the login is successful
    const token = await GenerateToken({
      id: user.id,
      email: user.email
    });
    res.status(200).json({ token , user: user});
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/***************************** ELECTRICITY PURCHASE **********************************/
const purchaseElectricity = async (req, res) => {
  try {
    const { userId, amount } = req.body; 
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate the cost of the electricity based on the amount
    const electricityCost = calculateElectricityCost(amount);

    // Perform payment processing (not included in this example)

    // Create an electricity purchase record
    const purchaseRecord = new ElectricityPurchase({
      userId: user._id,
      amount,
    });

    // Save the purchase record
    await purchaseRecord.save();

 // Calculate the new balance after deducting the cost
    const newBalance = user.balance - electricityCost;
    if (user.balance < amount)
    {
  return res.status(400).json("Amount is too low to purchase electricity")
    }
    // Update user's balance in the database
    user.balance = newBalance;
    await user.save();

    res.status(201).json({ message: 'Electricity purchased successfully', electricityCost });
  } catch (error) {
    console.error('Error while purchasing electricity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findOne({ _id: userId }); 
    if (!user) {
      return res.status(404).json({ error: 'User not found' }); 
    }
    return res.status(200).json({ user }); 
  } catch (error) {
    console.error('Error while fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  purchaseElectricity,
  getUser
};
