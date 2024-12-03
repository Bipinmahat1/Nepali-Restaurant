const sqlite3 = require('sqlite3').verbose();

const DB_FILE = 'rasilo_momo.db';

// Connect to the SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

// Initialize the Orders table
function initializeTables() {
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      address TEXT NOT NULL,
      cart TEXT NOT NULL, -- JSON string to store cart items
      status TEXT DEFAULT 'Pending' -- Pending or Completed
    );
  `;
  db.run(createOrdersTable, (err) => {
    if (err) {
      console.error('Error creating orders table:', err.message);
    } else {
      console.log('Orders table is ready');
    }
  });
}

// Insert a new order into the database
function addOrder(order, callback) {
  const { name, contact, address, cart } = order;
  const cartJson = JSON.stringify(cart); // Convert cart to JSON string
  const query = `
    INSERT INTO orders (name, contact, address, cart, status)
    VALUES (?, ?, ?, ?, 'Pending');
  `;
  db.run(query, [name, contact, address, cartJson], function (err) {
    if (err) {
      console.error('Error adding order:', err.message);
      callback(err);
    } else {
      callback(null, { orderId: this.lastID });
    }
  });
}

// Get all orders (for the kitchen/admin panel)
function getOrders(callback) {
  const query = `SELECT * FROM orders ORDER BY id DESC;`;
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching orders:', err.message);
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

// Mark an order as completed
function completeOrder(orderId, callback) {
  const query = `UPDATE orders SET status = 'Completed' WHERE id = ?;`;
  db.run(query, [orderId], function (err) {
    if (err) {
      console.error('Error marking order as completed:', err.message);
      callback(err);
    } else if (this.changes === 0) {
      callback(new Error('Order not found'));
    } else {
      callback(null, { message: 'Order marked as completed' });
    }
  });
}

module.exports = {
  addOrder,
  getOrders,
  completeOrder,
};
