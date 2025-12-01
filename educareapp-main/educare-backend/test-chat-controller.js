// Teste simples para verificar se o controlador está funcionando
const chatController = require('./src/controllers/chatController');

console.log('chatController:', chatController);
console.log('createChatGroup type:', typeof chatController.createChatGroup);
console.log('Available methods:', Object.keys(chatController));

if (typeof chatController.createChatGroup === 'function') {
  console.log('✅ createChatGroup é uma função válida');
} else {
  console.log('❌ createChatGroup NÃO é uma função válida');
}
