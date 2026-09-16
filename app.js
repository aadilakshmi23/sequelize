const express = require('express');
require('dotenv').config();

const { User, Order } = require('./models');
const { where } = require('sequelize');
// const order = require('./models/order');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());



app.get('/users', async (req, res, next) => {
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
          if (!user) return res.status(404).send('user not found')
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

//Orders CRUD

app.get('/orders', async (req, res, next) => {
     try {
          const userId = 4;
          const  order = await  Order.findAll({
               where:{
                    userId
               }
          });
          res.json(order)
     } catch (error) {
          next(error)
     }
})

app.get('/orders/:id', async (req, res, next) => {
     try {
          const userId = 4;
          const order = await Order.findByPk(req.params.id);
          if (!order || order.userId !== userId) {
               return res.status(404).send('order not found')
          }
          res.json(order)
     } catch (error) {
          next(error)
     }
})

app.post('/orders', async (req, res, next) => {
     try {
          const userId = 4;
          const order = await Order.create(req.body,userId);
          res.json(order)
     } catch (error) {
          next(error)
     }
})

app.put('/orders/:id', async (req, res, next) => {
     try {
          const userId = 4;
          const order = await Order.findByPk(req.params.id);
          if (!order || order.userId !== userId) {
               return res.status(404).send('order not found')
          }
          await order.update(req.body);
          res.json(order)
     } catch (error) {
          next(error)
     }
})

app.delete('/orders/:id', async (req, res, next) => {
     try {
          const userId = 4;
          const order = await Order.findByPk(req.params.id);
          if (!order || order.userId !== userId) {
               return res.status(404).send('order not found')
          }
          await order.destroy();
          res.json(order)
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