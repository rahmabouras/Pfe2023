const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.get('/', conversationController.getAllConversations);
router.get('/:udetid', conversationController.getConversationByUserId);
router.post('/', conversationController.createConversation);
router.put('/:id', conversationController.updateConversation);
router.delete('/:id', conversationController.deleteConversation);

module.exports = router;
