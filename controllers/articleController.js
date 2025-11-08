const bcrypt = require('bcrypt'); const { User, Article } = require('../models'); // Sequelize models const fs = require('fs');

exports.createArticle = async (req, res) => { 
    try { 
        const { user_id, title, content } = req.body; 
        if (!user_id || !title || !content) 
            { return res.status(400).json({ message: 'All fields are required.' }); 
} 
const newArticle = await Article.create({ 
    user_id, title, content }); 
    res.status(201).json({ message: 'Article created successfully', article: newArticle }); 
} catch (error) 
{ console.error('Create article error:', error); res.status(500).json({ message: 'Internal server error.' }); } };

exports.viewArticle = async (req, res) => { try {
     const articleId = req.params.id; 
     const article = await Article.findByPk(articleId); 
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
     const article = await Article.findByPk(articleId); 
     if (!article) 
        { return res.status(404).json({ message: 'Article not found.' }); 
    } article.title = title || article.title; 
    article.content = content || article.content; 
    await article.save(); res.status(200).json({ message: 'Article updated successfully', article }); } 
    catch (error) 
    { console.error('Update article error:', error); res.status(500).json({ message: 'Internal server error.' }); } };

exports.deleteArticle = async (req, res) => { try {
     const articleId = req.params.id; 
     const article = await Article.findByPk(articleId);
      if (!article) { return res.status(404).json({ message: 'Article not found.' }); 
    } await article.destroy(); res.status(200).json({ message: 'Article deleted successfully' }); 
} catch (error)
 { console.error('Delete article error:', error); res.status(500).json({ message: 'Internal server error.' }); } };