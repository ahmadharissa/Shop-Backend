import bcrypt from "bcryptjs";
import nodeMailer from "nodemailer";
import fs from "fs";

//model
import User from "../model/users";
import { createToken, decodeToken } from "../utils/token";

//utils
import { generateRandomString } from "../utils/generatePassword";

export const login = async (req, res) => {
    const { email, password, googleTokenId } = req.body;

    try {
        var user = null;
        if (googleTokenId) {
            if (await verifyGoogleId(googleTokenId)) {
                user = await User.findOne({ $or: [{ email }, { googleTokenId }] });
                if (!user) {
                    user = await User.create({
                        firstName,
                        lastName,
                        email,
                        googleTokenId,
                        verified: true,
                        avatar,
                    });
                }
            } else
                return res.status(400).json({ message: "Invalid google account" });
        } else {
            var user = null;
            user = await User.findOne({ email });
            if (!user)
                return res.status(400).json({ message: "User doesn't exist." });

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect)
                return res.status(400).json({ message: "Invalid password." });

            const token = createToken({ id: user._id, email, role: user.role });

            if (!user.verified) {
                const transporter = nodeMailer.createTransport({
                    service: "gmail",
                    type: "SMTP",
                    host: "smtp.gmail.com",
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD,
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Please verify your email",
                    html: process.env.DOMAIN + "/verifyEmail?token=" + token,
                };

                transporter.sendMail(mailOptions, (err, info) => { });

                return res.status(200).json({ message: "verify Email" });
            }

            return res.status(200).json({
                result: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
                token,
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const signup = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user)
            return res.status(400).json({ message: "Email exist." });
        if (password.length <= 8)
            return res.status(400).json({ message: "Password must be greater then 8." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword
        });

        const token = createToken({ id: newUser._id, email, role: 2 });
        const transporter = nodeMailer.createTransport({
            service: "gmail",
            type: "SMTP",
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Please verify your email",
            html: process.env.DOMAIN + "/verifyEmail?token=" + token,
        };

        transporter.sendMail(mailOptions, (err, info) => { });

        return res.status(200).json({
            result: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const token = req.query.token;
    const decod = decodeToken(token);
    const user = await User.findOne({ _id: decod.id });

    user.verified = true;
    await newUser.save();

    return res.status(200).json({ result: "your email has been verified" });
};

export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
        return res.status(500).json({ message: "Email not existe" })

    const password = generateRandomString(12)
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword
    user.save()

    const transporter = nodeMailer.createTransport({
        service: "gmail",
        type: "SMTP",
        host: "smtp.gmail.com",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset password",
        html: "New password = " + password,
    };

    transporter.sendMail(mailOptions, (err, info) => { });
    return res.status(200).json({ message: "New password has been send" })
}

export const resetPassword = async (req, res) => {
    const { password } = req.body;
    const token = req.header('authorization').split(" ")[1];;
    const decod = decodeToken(token);

    const user = await User.findById(decod.id);
    if (!user)
        return res.status(200).json({ message: "Invalid token" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password has been changed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id).populate({ path: "wishlist" }).exec()
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const create = async (req, res) => {
    const { firstName, lastName, email, phone, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role
        });
        res.json(newUser)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editUser = async (req, res) => {
    const id = req.params.id
    try {
        var newUser = req.body;
        if (req.body.password)
            newUser['password'] = await bcrypt.hash(req.body.password, 10);
        await User.findByIdAndUpdate(id, newUser)
        res.json({ message: "User updated successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateImage = async (req, res) => {
    const user_id = req.userData.id;
    const user = await User.findById(user_id);

    if (!user)
        return res.status(400).json({ message: "user doesn't exist" });

    const avatar = user.avatar;
    const filename = req.file ? req.file.filename : avatar;

    let newData = req.body;
    newData.avatar = filename;

    await User.findByIdAndUpdate(user_id, newData);

    if (avatar !== "default.png" && avatar != filename) {
        try {
            if (fs.existsSync("uploads/users/" + avatar))
                fs.unlinkSync("uploads/users/" + avatar);
        } catch (error) {
            console.log({ message: error.message });
        }
    }
    return res.status(200).json(newData);
};

export const addToWishList = async (req, res) => {
    try {
        const user_id = req.userData.id;
        const user = await User.findById(user_id);

        if (!user)
            return res.status(400).json({ message: "User doesn't exist" });

        if (user.wishlist.find((product) => product.toString() === req.body.product))
            return res.status(400).json({ message: "product already in the wishlist" });

        user.wishlist.push(req.body.product);
        await user.save();

        return res.status(200).json({ message: "Wishlist added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromWishList = async (req, res) => {
    let wishlis = [];
    try {
        const user_id = req.userData.id;
        const user = await User.findById(user_id);

        if (!user)
            return res.status(400).json({ message: "User doesn't exist" });

        for (let i = 0; i < user.wishlist.length; i++) {
            if (user.wishlist[i].toString() !== req.body.product)
                wishlis.push(user.wishlist[i])
        }

        user.wishlist = wishlis;
        await user.save();

        return res.status(200).json({ message: "Wishlist remove successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeAllWishList = async (req, res) => {
    let wishlis = [];
    try {
        const user_id = req.userData.id;
        const user = await User.findById(user_id);

        if (!user)
            return res.status(400).json({ message: "User doesn't exist" });

        user.wishlist = wishlis;
        await user.save();

        return res.status(200).json({ message: "Wishlist is empty" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};