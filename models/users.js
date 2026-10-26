const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    apellidoP: {
        type: String,
        trim: true,
        required: true
    },
    apellidoM: {
        type: String,
        trim: true,
        required: true
    },
    usuario: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    rol: {
        type: String,
        enum: ['admin', 'estudiante'],
        default: 'estudiante'
    },
    status: {
        type: String,
        enum: ['activo', 'suspendido', 'bloqueado']
    },
    institucion: {
        type: String,
        trim: true,
        required: true
    },
    carrera: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true

    },
    reputacion: {
        promedio: { type: Number, default: 0 },
        totalValoraciones: { type: Number, default: 0 }
    },
    verificacion: {
        estado: { type: String, enum: ['sin_enviar', 'pendiente', 'aprobado', 'rechazado'], default: 'sin_enviar' },
        tipoDocumento: { type: String, enum: ['credencial', 'constancia', 'otro'] },
        documentoUrl: String,
        fechaEnvio: Date,
        fechaRevision: Date,
        revisadoPor: { type: Schema.ObjectId, ref: 'users' },
        motivoRechazo: String
    },
    imagen: {
        type: String,
        trim: true
    }

});

module.exports = mongoose.model('users', usersSchema);