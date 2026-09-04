"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const favoritesSchema = new mongoose_1.default.Schema({
    apod: { type: [String], default: [] },
    elcovek: { type: [String], default: [] },
    vibteo: { type: [String], default: [] },
}, { _id: false });
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    favorites: {
        type: favoritesSchema,
        default: () => ({ apod: [], elcovek: [], vibteo: [] }),
    },
    photoUrl: {
        type: String
    }
}, {
    timestamps: true
});
userSchema.pre('save', async function () {
    if (!this.isModified("password"))
        return;
    const salt = await bcrypt_1.default.genSalt(10);
    this.password = await bcrypt_1.default.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt_1.default.compare(enteredPassword, this.password);
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map