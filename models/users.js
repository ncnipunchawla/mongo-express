'use strict';

const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
 
const UserSchema = new Schema({
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, unique: true, required: true },
    password: { type: String },
    location: { type: String, index: true },
    city: { type: String },
    country: { type: String },
    role: { type: Number, required: true },
    client_id: { type: Number, ref: 'Client', index: true, required: true },
    gender: { type: String },
}, { collection: 'users' });

UserSchema.plugin(timestamps);

module.exports = exports = mongoose.model('User', UserSchema)