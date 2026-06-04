import express from "express";
import type { Request, Response } from "express";
import { UserModel , LinkModel,  ContentModel } from "./db.js";

import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";
import { random } from "./utils.js";

const app = express ();
app.use(express.json());


app.post("/app/v1/signup", async (req: Request, res: Response)=> {

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

app.post("/app/v1/signin", async (req: Request, res: Response)=> {
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

app.post("/app/v1/Content", userMiddleware, async (req: Request, res: Response)=> {
    const title = req.body.title;
    const link = req.body.link;
    const type =  req.body.type;
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthorized" })
    }

    await ContentModel.create ({
        link,
        type,
        title,
        userId: req.userId as any,
        tags: []
    })
    res.json({
        message: "content Added"
    })
    
})

app.get("/app/v1/Content", userMiddleware ,async (req: Request, res: Response)=> {
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthorized" })
    }
    const userId = req.userId;
    const content = await ContentModel.findOne({
        userId: userId as any
    }).populate("userId", "username")
    res.json({
        content
    })
})

app.delete("/app/v1/brain/content", userMiddleware, async (req: Request, res: Response)=> {
    const contentId = req.body.contentId as string;
    if (!req.userId) return res.status(403).json({ message: "Unauthorized" })
    const userId = req.userId as string;

    await ContentModel.deleteOne({
        _id: contentId,
        userId: userId as any,
    })
    res.json ({
        message: "Deleted"
    })
})

app.post("/app/v1/brain/share", userMiddleware, async (req: Request, res: Response)=> {

    const share = req.body.share;

    if (!req.userId) return res.status(403).json({ message: "Unauthorized" })

    if (share) {
        const existingLink = await LinkModel.findOne({
            userId: req.userId as any
        });

        if (existingLink) {
            res.json ({
                hash: existingLink.hash
            })
            return
        }
        const hash = random(10);

        await LinkModel.create({
            userId: req.userId as any,
            hash: hash
        })
        res.json ({
            hash
        })
        } else {

        await LinkModel.deleteOne ({
            userId: req.userId as any
        });
        res.json({
            message: "Removed Link"
        })
    }
    
})


app.get("/app/v1/brain/:shareLink", async (req: Request, res: Response)=> {
    const hash = req.params.shareLink as string;
    
    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect Input"
        })
        return;
    }

    const content = await ContentModel.find({
        userId: link.userId as any
    })

    console.log(link);
    const user = await UserModel.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "User not found , error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })
})

app.listen(3000);
