import mongoose, {model , Schema} from "mongoose";

mongoose.connect("")

const UserSchema = new Schema ({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model("User", UserSchema)

const ContentSchema = new Schema ({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref:'tag'}], type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'user', required: true}
})

export const ContentModel = model("Content", ContentSchema)

const LinkSchema = new Schema ({
    hash: String, 
    UserId: {type: mongoose.Types.ObjectId, ref: 'User', unique: true, required: true}
})

export const LinkModel = model("link", LinkSchema)