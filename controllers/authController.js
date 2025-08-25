const bcrypt = require('bcryprt');
const { User} = require('../models');

exports.ChangePassword = async (req, res) =>{
    try{
        const userId = req.user.id; //JWT middleware should set req.user
        const {currentPassword, newPassword } = req.body;

        const user = await User.findByPk(userId);
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if(!isMatch){
            return res.status(401).json({error: 'Incorrect Current Password'});
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10); //what does this line mean?
        await user.update({password: hashedNewPassword});
        return res.status(200).json({ MESSAGE: 'Password Updated Successfully.'})
    }catch(error){
        console.error('Password update error.');
        return res.status(400).json({error: 'Internal Server Error'})
    }
};
