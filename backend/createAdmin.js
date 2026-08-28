
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Admin = require("./model/admin");

const createAdmin = async () => {
    try {

        // =====================================
        // CONNECT DATABASE
        // =====================================

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected"
        );


        // =====================================
        // ADMIN DETAILS
        // =====================================

        const name = "Admin";

        const email = "admin@gmail.com";

        const password = "Admin@123";


        // =====================================
        // CHECK EXISTING ADMIN
        // =====================================

        const existingAdmin =
            await Admin.findOne({
                email
            });

        if (existingAdmin) {

            console.log(
                "Admin already exists"
            );

            await mongoose.connection.close();

            return;
        }


        // =====================================
        // HASH PASSWORD
        // =====================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // =====================================
        // CREATE ADMIN
        // =====================================

        const admin =
            await Admin.create({

                name,

                email,

                password:
                    hashedPassword,

                role: "admin"

            });


        console.log(
            "Admin created successfully"
        );

        console.log(
            "Admin ID:",
            admin._id.toString()
        );

        console.log(
            "Email:",
            email
        );

        console.log(
            "Password:",
            password
        );


        // =====================================
        // CLOSE DATABASE
        // =====================================

        await mongoose.connection.close();

        console.log(
            "Database connection closed"
        );

    } catch (error) {

        console.error(
            "Create Admin Error:",
            error
        );

        await mongoose.connection.close();

        process.exit(1);
    }
};


createAdmin();

