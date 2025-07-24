import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }, 
    }, {
        timestamps: true,
});

//登录时检查“用户输入的密码”和“数据库中已加密的密码”是否匹配。bcrypt.compare() 会自动处理加密比对。
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//pre-save 钩子函数，在保存（save()）用户数据之前自动执行。this.isModified('password') 确保只有当密码字段发生改变时才加密。避免重复加密已经加密过的密码。
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')){
        next(); //如果密码字段没有修改（例如只改了名字），就调用 next()，跳过加密逻辑，直接保存。
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;