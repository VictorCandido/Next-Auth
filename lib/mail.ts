import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Confirm your email',
        text: `Click the link below to verify your email. ${confirmLink}`,
        html: `<p>Click <a href="${confirmLink}">here</a> to verify your email</p>`
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset your password',
        text: `Click the link below to reset your password. ${resetLink}`,
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
    })
}

export const sendTwoFactorEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Two factor authentication',
        html: `<p>Your two factor authentication token is ${token}</p>`
    })
}