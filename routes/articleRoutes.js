const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authToken = require("../controllers/middleware/authToken");
const authRoles = require("../controllers/middleware/authRoles");

router.post('/', authToken, authRoles("counsellor"),articleController.createArticle);
router.get('/',  articleController.getAllArticles);
router.get('/:id', articleController.viewArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);
module.exports = router;
