import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email('Email is required'),
    password: z.string().min(1, 'Password is required'),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email('Email is required'),
    password: z.string().min(6, 'Minimum 6 characters required'),
    name: z.string().min(1, 'Name is required'),
});

export const ResetSchema = z.object({
    email: z.string().email('Email is required'),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, 'Minimum 6 characters required'),
});
