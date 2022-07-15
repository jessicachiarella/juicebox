const { Client } = require("pg");
const client = new Client("postgres://localhost:5432/juicebox-dev");

async function getAllPosts() {
  const result = await client.query(
    `SELECT id, 'authorId', title, content
        FROM posts;
        `
  );
  return result;
}

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username, name, location, active
        FROM users;
        `
  );
  return rows;
}

async function createPost({ authorId, title, content }) {
  try {
    const result = await client.query(
      `
      INSERT INTO posts('authorId', title, content) 
      VALUES ($1, $2, $3)
      RETURNING *;
`,
      [authorId, title, content]
    );

    return result
  } catch (error) {
    throw error;
  }
}

async function createUser({ username, password, name, location }) {
  try {
    const { rows: [ user ] } = await client.query(
      `
      INSERT INTO users(username, password, name, location) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
`,
      [username, password, name, location]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const result = await client.query(
      `
        UPDATE posts
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(fields));

    return result;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ user ] } = await client.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(fields));

    return user;
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${ userId }
    `)
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId){
  try {
    const getUser = await getAllUsers();
        const Bob = await client.query(`
        SELECT id, username, name, location
        FROM users
        SELECT 'authorId', title, content
        FROM posts;
        `)
        console.log(Bob, "!!!!!!!!!")
    }

  
  catch(error){
    console.error(error)
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  getPostsByUser,
  updatePost,
  createPost,
  getAllPosts,
};
