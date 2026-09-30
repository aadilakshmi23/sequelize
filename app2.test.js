const request = require("supertest");

// Mock Sequelize models before loading app.js
jest.mock("./models", () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Order: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

const app = require("./app");
const { User, Order } = require("./models");

describe("USER API TESTS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /users
  test("GET /users - should return all users", async () => {
    const users = [
      {
        id: 1,
        name: "Ashok",
        email: "ashok@gmail.com",
        gender: "male",
        phone: 9876543210,
      },
      {
        id: 2,
        name: "Sravani",
        email: "sravani@gmail.com",
        gender: "female",
        phone: 9876543211,
      },
    ];

    User.findAll.mockResolvedValue(users);

    const response = await request(app).get("/users");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(users);
    expect(User.findAll).toHaveBeenCalledTimes(1);
  });

  // GET /users/:id - success
  test("GET /users/:id - should return user by ID", async () => {
    const user = {
      id: 1,
      name: "Ashok",
      email: "ashok@gmail.com",
      gender: "male",
      phone: 9876543210,
    };

    User.findByPk.mockResolvedValue(user);

    const response = await request(app).get("/users/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
    expect(User.findByPk).toHaveBeenCalledWith("1");
  });

  // GET /users/:id - not found
  test("GET /users/:id - should return 404 when user does not exist", async () => {
    User.findByPk.mockResolvedValue(null);

    const response = await request(app).get("/users/999");

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("user not found");
  });

  // GET /users/:id - database error
  test("GET /users/:id - should return 500 when database throws error", async () => {
    User.findByPk.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/users/1");

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("internal server error");
  });

  // POST /users
  test("POST /users - should create a new user", async () => {
    const userData = {
      name: "Ashok",
      email: "ashok@gmail.com",
      gender: "male",
      phone: 9876543210,
    };

    const createdUser = {
      id: 1,
      ...userData,
    };

    User.create.mockResolvedValue(createdUser);

    const response = await request(app).post("/users").send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(createdUser);
    expect(User.create).toHaveBeenCalledWith(userData);
  });

  // POST /users - error
  test("POST /users - should return 500 when database throws error", async () => {
    User.create.mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/users").send({
      name: "Ashok",
      email: "ashok@gmail.com",
      gender: "male",
    });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("internal server error");
  });

  // PUT /users/:id
  test("PUT /users/:id - should update user", async () => {
    const user = {
      id: 1,
      name: "Ashok",
      email: "ashok@gmail.com",
      gender: "male",
      update: jest.fn().mockResolvedValue(true),
    };

    User.findByPk.mockResolvedValue(user);

    const updateData = {
      name: "Ashok Chakravarthi",
    };

    const response = await request(app).put("/users/1").send(updateData);

    expect(response.statusCode).toBe(200);
    expect(user.update).toHaveBeenCalledWith(updateData);

    // ❌ OLD:
    // expect(response.body).toEqual(user);

    // ✅ NEW:
    expect(response.body).toMatchObject({
      id: 1,
      name: "Ashok",
      email: "ashok@gmail.com",
      gender: "male",
    });
  });

  // PUT /users/:id - not found
  test("PUT /users/:id - should return 404 when user does not exist", async () => {
    User.findByPk.mockResolvedValue(null);

    const response = await request(app).put("/users/999").send({
      name: "New Name",
    });

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("user not found");
  });

  // PUT /users/:id - database error
  test("PUT /users/:id - should return 500 when database throws error", async () => {
    User.findByPk.mockRejectedValue(new Error("Database error"));

    const response = await request(app).put("/users/1").send({
      name: "New Name",
    });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("internal server error");
  });

  // DELETE /users/:id
  test("DELETE /users/:id - should delete user", async () => {
    const user = {
      id: 1,
      name: "Ashok",
      email: "ashok@gmail.com",
      destroy: jest.fn().mockResolvedValue(true),
    };

    User.findByPk.mockResolvedValue(user);

    const response = await request(app).delete("/users/1");

    expect(response.statusCode).toBe(200);
    expect(user.destroy).toHaveBeenCalledTimes(1);

    // ❌ OLD:
    // expect(response.body).toEqual(user);

    // ✅ NEW:
    expect(response.body).toMatchObject({
      id: 1,
      name: "Ashok",
      email: "ashok@gmail.com",
    });
  });

  // DELETE /users/:id - not found
  test("DELETE /users/:id - should return 404 when user does not exist", async () => {
    User.findByPk.mockResolvedValue(null);

    const response = await request(app).delete("/users/999");

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("user not found");
  });

  // DELETE /users/:id - database error
  test("DELETE /users/:id - should return 500 when database throws error", async () => {
    User.findByPk.mockRejectedValue(new Error("Database error"));

    const response = await request(app).delete("/users/1");

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("internal server error");
  });
});


describe("ORDER API TESTS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /orders
  test("GET /orders - should return orders for user 7", async () => {
    const orders = [
      {
        id: 1,
        userId: 7,
        totalAmount: "500.00",
      },
      {
        id: 2,
        userId: 7,
        totalAmount: "1000.00",
      },
    ];

    Order.findAll.mockResolvedValue(orders);

    const response = await request(app).get("/orders");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(orders);

    expect(Order.findAll).toHaveBeenCalledWith({
      where: {
        userId: 7,
      },
    });
  });

  // GET /orders/:id - success
  test("GET /orders/:id - should return order belonging to user 7", async () => {
    const order = {
      id: 1,
      userId: 7,
      totalAmount: "500.00",
    };

    Order.findByPk.mockResolvedValue(order);

    const response = await request(app).get("/orders/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(order);
    expect(Order.findByPk).toHaveBeenCalledWith("1");
  });

  // GET /orders/:id - order not found
  test("GET /orders/:id - should return 404 when order does not exist", async () => {
    Order.findByPk.mockResolvedValue(null);

    const response = await request(app).get("/orders/999");

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("order not found");
  });

  // GET /orders/:id - wrong user
  test("GET /orders/:id - should return 404 when order belongs to another user", async () => {
    const order = {
      id: 1,
      userId: 10,
      totalAmount: "500.00",
    };

    Order.findByPk.mockResolvedValue(order);

    const response = await request(app).get("/orders/1");

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("order not found");
  });

  // GET /orders/:id - database error
  test("GET /orders/:id - should return 500 when database throws error", async () => {
    Order.findByPk.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/orders/1");

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("internal server error");
  });

  // POST /orders
  test("POST /orders - should create an order", async () => {
    const orderData = {
      userId: 7,
      totalAmount: 500,
    };

    const createdOrder = {
      id: 1,
      ...orderData,
    };

    Order.create.mockResolvedValue(createdOrder);

    const response = await request(app).post("/orders").send(orderData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(createdOrder);

    // ❌ OLD:
    // expect(Order.create).toHaveBeenCalledWith(
    //     orderData,
    //     7
    // );

    // ✅ NEW:
    expect(Order.create).toHaveBeenCalledWith(orderData);
  });

  // POST /orders - database error
  test("POST /orders - should return 500 when database throws error", async () => {
    Order.create.mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/orders").send({
      userId: 7,
      totalAmount: 500,
    });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("internal server error");
  });

  // PUT /orders/:id
  test("PUT /orders/:id - should update order belonging to user 4", async () => {
    const order = {
      id: 1,
      userId: 4,
      totalAmount: "500.00",
      update: jest.fn().mockResolvedValue(true),
    };

    Order.findByPk.mockResolvedValue(order);

    const updateData = {
      totalAmount: 750,
    };

    const response = await request(app).put("/orders/1").send(updateData);

    expect(response.statusCode).toBe(200);
    expect(order.update).toHaveBeenCalledWith(updateData);

    // ❌ OLD:
    // expect(response.body).toEqual(order);

    // ✅ NEW:
    expect(response.body).toMatchObject({
      id: 1,
      userId: 4,
      totalAmount: "500.00",
    });
  });

  // PUT /orders/:id - wrong user
  test("PUT /orders/:id - should return 404 when order belongs to another user", async () => {
    const order = {
      id: 1,
      userId: 7,
      totalAmount: "500.00",
    };

    Order.findByPk.mockResolvedValue(order);

    const response = await request(app).put("/orders/1").send({
      totalAmount: 800,
    });

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("order not found");
  });

  // PUT /orders/:id - not found
  test("PUT /orders/:id - should return 404 when order does not exist", async () => {
    Order.findByPk.mockResolvedValue(null);

    const response = await request(app).put("/orders/999").send({
      totalAmount: 800,
    });

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("order not found");
  });

  // PUT /orders/:id - database error
  test("PUT /orders/:id - should return 500 when database throws error", async () => {
    Order.findByPk.mockRejectedValue(new Error("Database error"));

    const response = await request(app).put("/orders/1").send({
      totalAmount: 800,
    });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("internal server error");
  });

  // DELETE /orders/:id
  test("DELETE /orders/:id - should delete order belonging to user 4", async () => {
    const order = {
      id: 1,
      userId: 4,
      totalAmount: "500.00",
      destroy: jest.fn().mockResolvedValue(true),
    };

    Order.findByPk.mockResolvedValue(order);

    const response = await request(app).delete("/orders/1");

    expect(response.statusCode).toBe(200);
    expect(order.destroy).toHaveBeenCalledTimes(1);

    // ❌ OLD:
    // expect(response.body).toEqual(order);

    // ✅ NEW:
    expect(response.body).toMatchObject({
      id: 1,
      userId: 4,
      totalAmount: "500.00",
    });
  });

  // DELETE /orders/:id - wrong user
  test("DELETE /orders/:id - should return 404 when order belongs to another user", async () => {
    const order = {
      id: 1,
      userId: 7,
      totalAmount: "500.00",
    };

    Order.findByPk.mockResolvedValue(order);

    const response = await request(app).delete("/orders/1");

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("order not found");
  });

  // DELETE /orders/:id - not found
  test("DELETE /orders/:id - should return 404 when order does not exist", async () => {
    Order.findByPk.mockResolvedValue(null);

    const response = await request(app).delete("/orders/999");

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("order not found");
  });

  // DELETE /orders/:id - database error
  test("DELETE /orders/:id - should return 500 when database throws error", async () => {
    Order.findByPk.mockRejectedValue(new Error("Database error"));

    const response = await request(app).delete("/orders/1");

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("internal server error");
  });
});