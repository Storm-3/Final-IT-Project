const bcrypt = require('bcrypt');
const { User, ResourceDirectory } = require('../models');
const { validateUserFields } = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    const { role, resource_id } = userData;

    if (!userData.is_anonymous) {
        validateUserFields(userData);
    } else {
        userData.name = `Guest_${Date.now()}`
    };
    if (userData.password){
        userData.password = await bcrypt.hash(userData.password, 10);  
    }
    
    const validRoles = ['survivor', 'counsellor', 'admin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role: ${role}` });
    }

    // If role is counsellor, resource_id must be provided and valid
    if (role === 'counsellor') {
      if (!resource_id) {
        return res.status(400).json({ error: 'Counsellor must be linked to a resource_id' });
      }

      const resourceExists = await ResourceDirectory.findByPk(resource_id);
      if (!resourceExists) {
        return res.status(404).json({ error: 'Provided resource_id does not exist' });
      }
    }

    const newUser = await User.create(userData);
    return res.status(201).json({
        message: 'User created successfully',
        user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAnon: newUser.is_anonymous,
      role: role || 'survivor',
      resource_id: role === 'counsellor' ? resource_id : null,
    }
  });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(400).json({ error: error.message }); //??
  }
};

exports.GetAllUsers = async (req, res) => {
    try 
    {
        const role = req.query.role;
        const where = role ? {role} : {}; //??
        
        const users = await User.findAll(
            {include: [{model: ResourceDirectory}],
            where,    
            attributes: {exclude: ['password','email', 'phone']},}
        );
        return res.status(200).json(users);
    }
    catch (error)
    {
        console.error('Error fetching users:', error);
        return res.status(500).json({error: "Internal server error"});
    }
};

exports.GetUserById = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            include: [{model: ResourceDirectory}],
            attributes: {exclude: ['password']}
        });
        if (!user){
            return res.status(400).json({error: 'User not found'})
        }
        return res.status(201).json(user);
    }catch (error)
    {
        console.error('Error fetching user by Id', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }

}

exports.UdpateUserById = async (req, res) =>{
    try{
        const userId = req.params.id;
        const allowedFields = ['email', 'username']
        const updates = {};
        for (let key of allowedFields){
            if(req.body[key] !== undefined){
                updates[key] = req.body[key];
            }
        }

        const user = await User.findByPk(userId);

        if(!user){
            return res.status(400).json({error: 'User Not Found'});
        }
        await user.update(updates);
        return res.status(200).json({message: 'User updated successfully.',user});
    }
    catch(error){
        console.error('Error updating user.', error)
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

exports.DeleteUserById = async (req, res) =>{
    try{
        const userId = req.params.id;
        const user = await User.findByPk(userId);


        if(!user){
            return res.status(400).json({error: 'User Not Found'})
        } else {
            await user.destroy();
            return res.status(201).json({message: 'User deleted successfully.'})
        }

    }catch(error){
        console.error('Error deleting user.', error)
        return res.status(500).json({error: 'Internal Server Error.'})
    }
}