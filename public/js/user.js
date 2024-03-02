const usernameDisplay = document.getElementById("usernameDisplay")
const content = document.getElementById('content')
const addContent = document.getElementById("add-content")
const emailButton = document.getElementById("emailButton")
const phoneNumber = document.getElementById("phoneNumberButton")
const usernameButton = document.getElementById("usernameButton")
const cityButton = document.getElementById("cityButton")
const postAddButton = document.getElementById("postAddButton")
const postsContainer = document.getElementById("post-container")

fetch('/profile').then(response => response.json()).then(user => {
    usernameDisplay.innerText = user.username;
    fetch('/posts').then(response => response.json()).then(posts => {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            fetch(`/user/id/${post.user_id}`).then(response => response.json()).then(postuser => {
                postsContainer.innerHTML += `
                <div class="post-block">
                    <p class="post-block-content">${post.content}</p>
                    <p class="post-block-user">by: ${postuser.username}</p>
                    <p class="post-block-user">${post.date}</p>
                    <button onclick="editPost(${post.id})">Edit</button>
                    <button onclick="deletePost(${post.id})">Delete</button>
                </div>` ;
            }).catch(err => {console.error(err)}) 
        })
    }).catch(err => {console.error(err)}) 
}).catch(err => {console.error(err)}) 

async function editPost(postId) {
    const newContent = prompt('Enter new description:');
    console.log('Edit post clicked', postId);
    if (newContent !== null) {
        fetch(`/post/update/${postId}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newContent}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        })
        .then(updatedPost => {
            console.log('Post updated successfully:', updatedPost);
        })
    }
}

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

emailButton.addEventListener('click', () => {
    const newEmail = document.getElementById('email').value;
    fetch('/user/email', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail}),
    })
    .then(response => response.json())
    .then(updatedUser => {
        alert("Email updated!")
        console.log('User updated successfully:', updatedUser);
    })
    .catch(error => { console.error('Error:', error);})
})

cityButton.addEventListener('click', () => {
    const newCity = document.getElementById('city').value;
    fetch('/user/city', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: newCity}),
    })
    .then(response => response.json())
    .then(updatedUser => {
        alert("City updated!")
        console.log('User updated successfully:', updatedUser);
    })
    .catch(error => { console.error('Error:', error);})
})

usernameButton.addEventListener('click', () => {
    const newUsername = document.getElementById('username').value;
    fetch('/user/username', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername}),
    })
    .then(response => response.json())
    .then(updatedUser => {
        alert("Username updated!")
        console.log('User updated successfully:', updatedUser);
    })
    .catch(error => { console.error('Error:', error);})
})

phoneNumber.addEventListener('click', () => {
    const newPhone = document.getElementById('phoneNumber').value;
    fetch('/user/phonenumber', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phonenumber: newPhone}),
    })
    .then(response => response.json())
    .then(updatedUser => {
        alert("Phonenumber updated!")
        console.log('User updated successfully:', updatedUser);
    })
    .catch(error => { console.error('Error:', error);})
})

postAddButton.addEventListener('click', ()=> {
    const postAddInput = document.getElementById("postAddInput").value;
    fetch('/post/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: postAddInput}),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    })
    .then(newPost => {
        alert("Post added!")
        console.log('Post added successfully:', newPost);
    })
    .catch(error => { console.error('Error:', error);})
})



