const {ResourceDirectory} = require('../models/ResourceDirectory');

exports.createResource = async (req, res) => {
  try {
    const resourceData = req.body;
    const newResource = await ResourceDirectory.create(resourceData);
    const existing = await ResourceDirectory.findOne({ where: {email: resourceData.email}});
    if (exisitng){
        return res.status(409).json({error: 'Resource already exists.'})
    }
    return res.status(201).json({
        message: 'Resource created successfully',
        resource: {
      id: newResource.id,
      name: newResource.name,
      type: newResource.type,
      description: newResource.description,
      phone: newResource.phone,
      email: newResource.email,
      address: newResource.address,
      website: newResource.website
    }
  });
  } catch (error) {
    console.error('Error creating resource:', error);
    return res.status(400).json({ error: error.message });
  }
};

exports.GetAllResources = async (req,res) =>{
    try
    {
    const {type } = req.query;
        const where = type ? {type} : {}; //??
        
        const resources = await ResourceDirectory.findAll(
            {where}
        );
        return res.status(200).json(resources);
    }
    catch (error)
    {
        console.error('Error fetching resources:', error);
        return res.status(500).json({error: "Internal server error"});
    }
};

exports.GetResourceById = async (req, res) => {
    try{
        const resourceId = req.params.id;
        const resource = await ResourceDirectory.findByPk(resourceId)

        if (!resource){
            return res.status(400).json({error: 'Resource not found'})
        }
        return res.status(201).json(resource);
    }catch (error)
    {
        console.error('Error fetching resource by Id', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
};

exports.UdpateResourceById = async (req, res) =>{
    try{
        const resourceId = req.params.id;
        const allowedFields = ['name','description',
             'email', 'phone_number', 'address', 'website']
        const updates = {};
        for (let key of allowedFields){
            if(req.body[key] !== undefined){
                updates[key] = req.body[key];
            }
        }

        const resource = await ResourceDirectory.findByPk(resourceId);

        if(!resource){
            return res.status(404).json({error: 'Resource Not Found'});
        }
        await resource.update(updates);
        return res.status(200).json({message: 'Resource updated successfully.',resource});
    }
    catch(error){
        console.error('Error updating resource.', error);
        return res.status(500).json({error: 'Internal Server Error'})
    }
};

exports.DeleteResourceById = async (req, res) =>{
    try{
        const resourceId = req.params.id;
        const resource = await ResourceDirectory.findByPk(resourceId);
        if(!resource){
            return res.status(404).json({error: 'Resource Not Found', error})
        }else{
            await resource.destroy();
            return res.status(200).json({message: 'Resource deleted successfully.'});
        }
    }catch(error){
        console.error('Error deleting resource.', error);
        return res.status(500).json({error: 'Internal Server Error.'})
    }
};
