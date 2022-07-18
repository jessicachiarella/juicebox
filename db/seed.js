const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  getPostsByUser,
  updatePost,
  createPost,
  getAllPosts,
  createTags,
  getPostById,
  createPostTag,
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");
    await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
                );
            CREATE TABLE posts(
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
                );
              CREATE TABLE tags(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
              );
              CREATE TABLE post_tags(
                "postId" INTEGER REFERENCES posts(id),
                "tagId" INTEGER REFERENCES tags(id),
                 UNIQUE ("postId", "tagId")
              )
            `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "Al Bert",
      location: "Sydney, Australia",
    });
    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "Just Sandra",
      location: "Aint Tellin",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
      name: "Joshua",
      location: "Upper East Side",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialPosts() {
    try {
        console.log("Starting to create posts.")
      const [albert, sandra, glamgal] = await getAllUsers();
  
      await createPost({
        authorId: albert.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them."
      });
  
      await createPost({
        authorId: sandra.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them."
      });

      await createPost({
        authorId: glamgal.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them."
      });

      console.log("Finished creating posts!")
    } catch (error) {
      throw error;
    }
  }

  async function createInitialTags(){
    try {
      console.log("starting to create tags...")
      const [happy, sad, inspo, catman] = await createTags([
      '#happy',
      '#worst-day-ever',
      '#youcandoanything',
      '#catmandoeverything'
      ]);
      console.log("after create tags")
      const [postOne, postTwo, postThree] = await getAllPosts();
      console.log("after get all posts")
      await addTagsToPost(postOne.authorId, [happy, inspo]);
      await addTagsToPost(postTwo.authorId, [sad, inspo]);
      await addTagsToPost(postThree.authorId, [happy, catman, inspo]);
      console.log("finished creating tags!")
    } catch (error){
      console.log("error creating tags!")
      throw error;
    }
  }

  async function addTagsToPost(postId, tagList){
    console.log(postId, "00000000000000000000")
    try {
      const createPostTagPromises = tagList.map(
        tag => createPostTag(postId, tag.id)
      );

      await Promise.all(createPostTagPromises);
      return await getPostById(postId);
    } catch (error){
      throw error;
    }

  }

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    await createInitialTags();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:a", posts);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result:", updateUserResult);
    
    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].authorId, {
        title: "New Title",
        content: "Updated Content",
        active: true,
    });
    console.log("Result:", updatePostResult);

    console.log("calling getUserById with 1");
    const userById =  await getUserById(1);
    console.log("Result:", userById);
    
    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
