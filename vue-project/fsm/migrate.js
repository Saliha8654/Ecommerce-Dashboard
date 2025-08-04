// migrate.js
const db = require('./db');
const dbData = require('../db.json');

const insertUsers = async () => {
  const users = dbData.users;
  for (const user of users) {
    const { id, name, email, password, role } = user;
    const query = `INSERT IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`;
    const values = [id, name || '', email, password, role || 'customer'];
    await db.query(query, values);
  }
  console.log('✅ Users migrated.');
};

const insertProducts = async () => {
  const products = dbData.products;
  for (const product of products) {
    const { id, name, category, price, image, description } = product;
    const query = `INSERT IGNORE INTO products (id, name, category, price, image, description) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [id, name, category, price, image, description || ''];
    try {
      await db.query(query, values);
    } catch (err) {
      console.error(`❌ Error inserting product "${name}":`, err);
    }
  }
  console.log('✅ Products migrated.');
};

(async () => {
  try {
    await insertUsers();
    await insertProducts();
    console.log('🎉 Migration complete.');
    process.exit();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();
