'use server'

import bcrypt from "bcrypt"
import { z } from "zod"

import { RegisterSchema } from "@/schemas"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { email, password, name } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existringUser = await getUserByEmail(email);

    if (existringUser) {
        return { error: 'Email already in use' };
    }

    await db.user.create({
        data: {
            email,
            name,
            password: hashedPassword
        }
    });

    // TODO: send verification token email

    return { success: 'Email sent!' };
}