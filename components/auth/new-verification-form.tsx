'use client'

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';

import { newVerification } from '@/actions/new-verification';
import { CardWrapper } from "@/components/auth/card-wrapper";
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';


const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const onSubmit = useCallback(async () => {
        if (success || error) return;

        if (!token) {
            setError('Missing token!');
            return;
        }

        try {
            const data = await newVerification(token);
            setSuccess(data.success);
            setError(data.error);
        } catch (error) {
            setError('Something went wrong!');
        }
    }, [error, success, token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonLabel="Back to Login"
            backButtonHref="/auth/login"
        >
            <div className="flex items-center justify-center w-full">
                {!success && !error && (
                    <BeatLoader />
                )}

                <FormSuccess message={success} />

                {!success && (
                    <FormError message={error} />
                )}
            </div>
        </CardWrapper>
    );
}

export default NewVerificationForm;