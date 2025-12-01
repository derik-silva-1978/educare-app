// Teste simples para verificar o login
const fetch = require('node-fetch');

async function testLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'owner@educareapp.com',
        password: 'owner123'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (!response.ok) {
      console.error('Erro no login:', data);
    } else {
      console.log('Login bem-sucedido!');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

testLogin();
