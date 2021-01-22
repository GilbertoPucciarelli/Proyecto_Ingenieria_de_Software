import { Observable } from 'rxjs';

export interface Usuario {
    id?: string;
    name?: string;
    lastname?: string;
    email?: string;
    password?: string;
    gender?: string;
    birthday?: string;
    admin?: boolean;
    developed?: boolean;
    img?: string;
    tema?: string;
}

export interface Locales {
    direccion?: string;
    id?: string;
    nombre?: string;
    numero?: number;
    img?: string;
    descripcion?: string;
    favoritos?: [];
    horas?: any[];
    servicios?: any[];
    disponibilidad?: boolean;
    extras?: any[];
    picks?: boolean;
}

export interface ReservasUsuarios {
    reserva?: number;
    local?: string;
    actividad?: string;
    fecha?: string;
    servicio?: string;
    hora?: string;
    id: string;
    extras?: any[]
}

export interface ReservasLocales {
    reserva?: number;
    local?: string;
    actividad?: string;
    fecha?: string;
    servicio?: string;
    hora?: string;
    id: string;
    extras?: any[]
    nombre?: string;
    apellido?: string;
}

export interface Reseñas {
    id?: string;
    text?: string;
    idusuario?: string;
    name?: string;
    lastname?: string;
    img?:string;
}

export interface Mensajes {
    id?: string;
    mensaje?: string;
    fecha?: string;
    hora?: string;
    idUsuario?: string;
}