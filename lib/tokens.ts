import { v4 as uuidv4 } from 'uuid';

import { getVerificationTokenByEmail } from '@/data/verification-token';
import { db } from '@/lib/db';

export const generateVerificationToken = async (email: string) => {
    const ONE_HOUR = 1 * 60 * 60 * 1000;

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + ONE_HOUR);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.verificationToken.delete({
            where: { id: existingToken.id },
        });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return verificationToken;
}