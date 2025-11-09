// 1. Fix the import
const { Users, Articles } = require('../models'); // Was 'User'
const bcrypt = require('bcrypt'); 
const fs = require('fs');

// NEW FUNCTION: Get All Articles
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Articles.findAll({
            include: [{
                model: Users, // Was 'User'
                attributes: ['name', 'email'] // Include author's name and email
            }],
            order: [['createdAt', 'DESC']] // Show newest articles first
        });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Get all articles error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.createArticle = async (req, res) => { 
    try { 
        const {title, content } = req.body; 
        const user_id = req.user.id;

        if (!title || !content) 
            { return res.status(400).json({ message: 'All fields are required.' }); 
} 
// 2. Fix the model name
const newArticle = await Articles.create({ // Was 'Article'
    user_id, title, content }); 
    res.status(201).json({ message: 'Article created successfully', article: newArticle }); 
} catch (error) 
{ console.error('Create article error:', error); res.status(500).json({ message: 'Internal server error.' }); } };

exports.viewArticle = async (req, res) => { try {
     const articleId = req.params.id; 
     // 3. Fix the model name
     const article = await Articles.findByPk(articleId, { // Was 'Article'
        include: [{
            model: Users, // Was 'User'
            attributes: ['name', 'email'] // Also include author info here
        }]
     }); 
     if (!article) 
        { return res.status(404).json({ message: 'Article not found.' }); 
    } 
    res.status(200).json(article); 
} catch (error) 
{ console.error('View article error:', error); res.status(500).json({ message: 'Internal server error.' }); 
} 
};

exports.updateArticle = async (req, res) => { try {
     const articleId = req.params.id; 
     const { title, content } = req.body; 
     // 4. Fix the model name
     const article = await Articles.findByPk(articleId); // Was 'Article'
     if (!article) 
        { return res.status(404).json({ message: 'Article not found.' }); 
    } article.title = title || article.title; 
    article.content = content || article.content; 
    await article.save(); res.status(200).json({ message: 'Article updated successfully', article }); } 
    catch (error) 
    { console.error('Update article error:', error); res.status(500).json({ message: 'Internal server error.' }); } };

exports.deleteArticle = async (req, res) => { try {
     const articleId = req.params.id; 
     // 5. Fix the model name
     const article = await Articles.findByPk(articleId); // Was 'Article'
      if (!article) { return res.status(404).json({ message: 'Article not found.' }); 
    } await article.destroy(); res.status(200).json({ message: 'Article deleted successfully' }); 
} catch (error)
 { console.error('Delete article error:', error); res.status(500).json({ message: 'Internal server error.' }); } };