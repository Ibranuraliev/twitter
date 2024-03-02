const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

const PORT = 3000;
const HOST = 'localhost';
const app = express();

const { Pool } = require('pg');
const db = new Pool({
    user: "postgres",
    password: "qwertyuiop",
    host: "localhost",
    port: 5432,
    database: "ibra"
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
   secret: 'session_code',
   resave: false,
   saveUninitialized: true
}));


app.get('/', (req, res) => {
   if (req.session.user) {
      if(req.session.user.role == "admin" || req.session.user.role == "user"){
         res.sendFile(__dirname + '/public/user.html')
      } else {
         res.json("Access denied")
      }

   } else {
      res.redirect('/login');
   }
});

app.get('/login', (req,res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.get('/register', (req,res) => {
    res.sendFile(__dirname + '/public/register.html')
})

app.get('/admin', (req, res) => {
   if (req.session.user) {
      if(req.session.user.role == "admin"  ){
         res.sendFile(__dirname + '/public/admin.html')
      } else {
         res.json("Acces denied")
      }
   } else {
      res.json("User not logged in")
   }
})


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
       if (err) {
          console.error(err);
       } else {
          res.redirect('/login');
       }
    });
});

app.post('/register', async (req, res) => {
   const { username, email, password } = req.body
   const hashPasswd = await bcrypt.hash(password, 10)
   try {
       const result = await db.query('INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, hashPasswd, "user"])
       res.json(result.rows[0])
   } catch (error) {
       console.error(error)
       res.status(500).json({ error: "Error during register"})
   }
})

app.post('/login', async (req, res) => {
   const { email, password } = req.body
   try {
       const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
       if(result.rows.length > 0){
           const user = result.rows[0]
           const passwdMatch = await bcrypt.compare(password, user.password)
           if(passwdMatch){
               req.session.user = user
               res.json(user)
           } else {
               res.status(401).json({ error: 'Incorrect password or email'})
           }
       } else {
           res.status(401).json({ error: 'User not found'})
       }
   } catch (error) {
       console.error(error)
       res.status(500).json({ error: 'Error during login'})
   }
}) 

app.get('/profile', async (req, res) => {
   try {
       if (req.session.user) {
          const userId = req.session.user.id;
          const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

          if (result.rows.length > 0) {
             const user = result.rows[0];
             res.json(user);
          } else {
             res.status(404).json({ error: 'User not found'});
          }
       } else {
          res.status(401).json({ error: 'User not logged in'});
       }
    } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error'});
   }
})

app.get('/users', async (req, res) => {
   try {
       const users = await db.query('SELECT * FROM users')
       res.json(users.rows)
   } catch (error) {
       console.error(error)
       res.status(511).json({error: 'client needs to authenticate to gain network access.'})
   }
})

app.put('/user/username', async (req, res) => {
   const { username } = req.body
   if(req.session.user) {
      try {
         const result = await db.query('UPDATE users SET username = $1 WHERE id=$2', [username, req.session.user.id])
         if (result.rows.length === 1) {
            const updatedUser = result.rows[0];
            res.json(updatedUser);
         } else {
            res.status(404).json({ error: 'User not found' });
         }
      } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error updating user' });
      }
   } else {
      console.error("User not logged in")
   }
})

app.put('/user/email', async (req, res) => {
   const { email } = req.body
   if(req.session.user) {
      try {
         const result = await db.query('UPDATE users SET email = $1 WHERE id=$2', [email, req.session.user.id])
         if (result.rows.length === 1) {
            const updatedUser = result.rows[0];
            res.json(updatedUser);
         } else {
            res.status(404).json({ error: 'User not found' });
         }
      } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error updating user' });
      }
   } else {
      console.error("User not logged in")
   }
})

app.put('/user/city', async (req, res) => {
   const { city } = req.body
   if(req.session.user) {
      try {
         const result = await db.query('UPDATE users SET city = $1 WHERE id=$2', [city, req.session.user.id])
         if (result.rows.length === 1) {
            const updatedUser = result.rows[0];
            res.json(updatedUser);
         } else {
            res.status(404).json({ error: 'User not found' });
         }
      } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error updating user' });
      }
   } else {
      console.error("User not logged in")
   }
})

app.put('/user/phonenumber', async (req, res) => {
   const { phonenumber } = req.body
   if(req.session.user) {
      try {
         const result = await db.query('UPDATE users SET phonenumber = $1 WHERE id=$2', [phonenumber, req.session.user.id])
         if (result.rows.length === 1) {
            const updatedUser = result.rows[0];
            res.json(updatedUser);
         } else {
            res.status(404).json({ error: 'User not found' });
         }
      } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error updating user' });
      }
   } else {
      console.error("User not logged in")
   }
})

app.put('/user/update/:id', async (req, res) => {
   const userId = req.params.id;
   const { username, email, role } = req.body;
   try {
       const result = await db.query('UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *', [username, email, userId]);
       if (result.rows.length === 1) {
           const updatedUser = result.rows[0];
           res.json(updatedUser);
       } else {
           res.status(404).json({ error: 'User not found' });
       }
   } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Error updating user' });
   }
})

app.delete('/user/delete/:id', async (req, res) => {
   const userId = req.params.id;
   try {
       const result = await db.query('DELETE FROM users WHERE id = $1', [userId])
       if (result.rowCount === 1) {
           res.json({ message: 'User deleted successfully' });
       } else {
           res.status(404).json({ error: 'User not found' });
       }
   } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Error deleting user' });
   }
})

app.post('/post/add', async(req, res) => {
   const userid = req.session.user.id;
   const { content } = req.body;
   try {
       const result = await db.query('INSERT INTO posts (user_id, content) VALUES ($1, $2)', [userid, content])
       res.json(result.rows[0])
   } catch (error) {
       console.error(error)
       res.json(error)
   }
})

app.put('/post/update/:id', async (req, res) => {
   const postId = req.params.id;
   const { content } = req.body;
   try {
       const post = await db.query('UPDATE posts SET content=$1 WHERE id=$2', [content, postId])
       res.json(post.rows[0])
   } catch (error) {
       console.error(error)
       res.status(511).json(error)
   }
})

app.delete('/post/delete/:id', async (req, res) => {
   const postId = req.params.id;
   try {
       const result = await db.query('DELETE FROM posts WHERE id = $1', [postId])
       res.json({ message: 'Post deleted successfully' });
   } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Error deleting post' });
   }
});

app.get('/posts', async (req, res) => {
   try {
      const posts = await db.query('SELECT * FROM posts')
      res.json(posts.rows)
   } catch (error) {
      console.error(error)
      res.status(511).json(error)
   }
})

app.get('/user/id/:id', async (req, res) => {
   const id = req.params.id;
   try {   
       const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
       res.json(user.rows[0])
   } catch (error) {
       console.error(error)
       res.status(511).json({error: 'client needs to authenticate to gain network access.'})
   }
})

app.listen(PORT, () => console.log(`http://${HOST}:${PORT}`));