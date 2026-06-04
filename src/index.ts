import express from "express";
import { UserModel , LinkModel,  ContentModel } from "./db.js";

import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";

const app = express ();


app.post("/app/v1/signup", async (req, res)=> {

    const username = req.body.username;
    const password = req.body.password;

    try {
    await UserModel.create({
        username: username,
        password: password
    })
     res.json({
            message: "You're signed in"
     })
    } catch(e) {
        res.status(411).json({
            message: "User already exists"
        })
    }
})

app.post("/app/v1/signin", async (req, res)=> {
   const username= req.body.username;
   const password = req.body.password

   const existingUser = await UserModel.findOne({
    username,
    password
   })

   if (existingUser) {
    const token = jwt.sign({
        id: existingUser._id
    }, JWT_PASSWORD)
    res.json({
        token
    })
    } else {
        res.status(403).json({
            message: "Incorrect Cred"
        })
    }
})

app.post("/app/v1/Content", async (req, res)=> {
    const title = req.body.title;
    const link = req.body.link;
    const type =  req.body.type;

    await ContentModel.create ({
        link,
        type,
        title,
        userId: req.userId,
        tags: []
    })
    res.json({
        message: "content Added"
    })
    
})

app.get("/app/v1/Content", userMiddleware ,async (req, res)=> {
    
    const userId = req.userId;
    const content = await ContentModel.findOne({
        userId: userId
    }).populate("UserId", "username")
    res.json({
        content
    })
})

app.delete("/app/v1/brain/content", async (req, res)=> {
    const contentId: req.body.contentId;
    const userId: req.userId;

    await contentId.deleteMany({
        userId,
        contentId,
    })
    res.json ({
        message: "Deleted"
    })
})

app.post("/app/v1/brain/share", (req, res)=> {

    const share: req.body.share;

    if (share) {
        const existingLink = await LinkModel.find({
            userId: req.userId
        });

        if (existingLink) {
            res.json ({
                hash: existingLink.hash
            })
            return
        }
        const hash = random(10);

        await LinkModel.create({
            userId: req
        })
    }
    
})


app.get("/app/v1/brain/:shareLink", (req, res)=> {
    
})
