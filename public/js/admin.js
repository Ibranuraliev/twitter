const postsContainer = document.getElementById("post-container")

fetch('/posts').then(response => response.json()).then(posts => {
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        fetch(`/user/id/${post.user_id}`).then(response => response.json()).then(postuser => {
            postsContainer.innerHTML += `
            <div class="post-block">
                <p class="post-block-content">${post.content}</p>
                <p class="post-block-user">by: ${postuser.username}</p>
                <p class="post-block-user">${post.date}</p>
                <button onclick="deletePost(${post.id})">Delete</button>
            </div>` ;
        }).catch(err => {console.error(err)}) 
    })
}).catch(err => {console.error(err)}) 

async function deletePost(postId) {
    try {
        const confirmDelete = confirm('Are you sure you want to delete this post?');
        if (confirmDelete) {
            const deleteResponse = await fetch(`/post/delete/${postId}`, {
                method: 'DELETE',
            });
            if (deleteResponse.ok) {
            } else {
                console.error(`Error deleting user with ID ${postId}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchAndRenderUsers();

async function fetchAndRenderUsers() {
    const response = await fetch('/users');
    const users = await response.json();
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

async function editUser(userId) {
    const newUsername = prompt('Enter new username:');
    const newEmail = prompt('Enter new email:');
    console.log('Edit user clicked', userId);
    if (newUsername !== null && newEmail !== null) {
        fetch(`/user/update/${userId}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: newUsername, email: newEmail}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        })
        .then(updatedUser => {
            console.log('User updated successfully:', updatedUser);
        })
    }
    fetchAndRenderUsers();
    
}

async function deleteUser(userId) {
    try {
        const confirmDelete = confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            const deleteResponse = await fetch(`/user/delete/${userId}`, {
                method: 'DELETE',
            });

            if (deleteResponse.ok) {
                fetchAndRenderUsers();
            } else {
                console.error(`Error deleting user with ID ${userId}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
