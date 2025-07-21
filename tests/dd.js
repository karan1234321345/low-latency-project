// seedUsers.js
import mongoose from "mongoose";
import { User } from "./schema/user.modle.js"; // adjust the path as needed
import { faker } from '@faker-js/faker';

const MONGO_URI = "mongodb+srv://karan1234:IfaKOAFO4caFGwg3@cluster0.teulk.mongodb.net/chilandu?retryWrites=true&w=majority&appName=chilandu";

async function insertFewUsers() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = [
      {
        userId: faker.string.uuid(),
        name: faker.person.fullName(),
        mail: faker.internet.email().toLowerCase(),
        hashedPhoneNo: faker.string.alphanumeric(10),
        dob: "2002-04-18",
        profileImage: faker.image.avatar(),
        tfa: false,
        hashedSecurityKey: faker.string.alphanumeric(64),
        hashedPassword: faker.internet.password(32),
      },
      {
        userId: faker.string.uuid(),
        name: faker.person.fullName(),
        mail: faker.internet.email().toLowerCase(),
        hashedPhoneNo: faker.string.alphanumeric(10),
        dob: "2000-11-07",
        profileImage: faker.image.avatar(),
        tfa: true,
        hashedSecurityKey: faker.string.alphanumeric(64),
        hashedPassword: faker.internet.password(32),
      },
      {
        userId: faker.string.uuid(),
        name: faker.person.fullName(),
        mail: faker.internet.email().toLowerCase(),
        hashedPhoneNo: faker.string.alphanumeric(10),
        dob: "1999-03-23",
        profileImage: faker.image.avatar(),
        tfa: false,
        hashedSecurityKey: faker.string.alphanumeric(64),
        hashedPassword: faker.internet.password(32),
      }
    ];

    const result = await User.insertMany(users);
    console.log(`✅ Inserted ${result.length} users`);
  } catch (err) {
    console.error("❌ Error inserting users:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

insertFewUsers();
