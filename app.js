const express = require('express');
require('dotenv').config();

const { User } = require('./models')

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());



app.get('/users', async(req, res, next) => {
     try {
          const users = await User.findAll({
               // attributes: ['id', 'name', 'email']
          });
          res.json(users)
     } catch (error) {
          next(error)
     }
})

app.get('/users/:id', async (req, res, next) => {
     try {
          const user = await User.findByPk(req.params.id);
          if(!user) return res.status(404).send('user not found')
          res.json(user)
     } catch (error) {
          next(error)
     }
})

app.post('/users', async (req, res, next) => {
     try {
          const users = await User.create(req.body);
          res.json(users)
     } catch (error) {
          next(error)
     }
})

app.put('/users/:id', async (req, res, next) => {
     try {
          const user = await User.findByPk(req.params.id);
          if (!user) return res.status(404).send('user not found')
          await user.update(req.body);
          res.json(user)
     } catch (error) {
          next(error)
     }
})

app.delete('/users/:id', async (req, res, next) => {
     try {
          const user = await User.findByPk(req.params.id);
          if (!user) return res.status(404).send('user not found')
          await user.destroy();
          res.json(user)
     } catch (error) {
          next(error)
     }
})


app.use((err, req, res, next) => {
     console.log(err)
     res.status(500).send('internal server error')
})


app.listen(PORT, () => {
     console.log(`server is running on ${PORT}`)
})