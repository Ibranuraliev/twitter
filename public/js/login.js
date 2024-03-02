document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/login', {
       method: 'POST',
       headers: {
          'Content-Type': 'application/json',
       },
       body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
       alert('Login successful!');
       if(data.role === "admin"){
          window.location.href =`/admin?username=${data.username}`;
       } else if(data.role === "user"){
          window.location.href =`/?username=${data.username}`;
       }
     } else {
       alert(`Login failed: ${data.error}`);
     }
 });
 
 