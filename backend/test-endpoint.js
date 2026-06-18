

async function testWithAuth() {
  try {
    // 1. Register a dummy user to get a valid token
    const uniqueEmail = `test${Date.now()}@example.com`;
    console.log("Registering user:", uniqueEmail);
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: uniqueEmail, password: 'password123' })
    });
    
    if (!regRes.ok) {
      console.log("Register failed:", await regRes.text());
      return;
    }
    
    const userData = await regRes.json();
    console.log("Got token:", userData.token ? "YES" : "NO");
    
    // 2. Hit /api/chat with the token
    console.log("Hitting /api/chat...");
    const chatRes = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
      },
      body: JSON.stringify({ message: 'What is the most carbon-heavy mode of transport?' })
    });
    
    console.log("Chat Status:", chatRes.status);
    const chatData = await chatRes.json();
    console.log("Chat Response:", chatData);
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testWithAuth();
