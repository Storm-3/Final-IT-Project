const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.post('/',resourceController.CreateResource);
router.get('/', resourceController.GetAllResources);
router.get('/:id', resourceController.GetResourceById);
router.put('/:id', resourceController.UdpateResourceById);
router.delete('/:id', resourceController.DeleteResourceById);

module.exports = router;