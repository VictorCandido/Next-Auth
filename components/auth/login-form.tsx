'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login } from "@/actions/login";
import { CardWrapper } from "@/components/auth/card-wrapper";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schemas";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with different provider' : '';

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        console.log({ values })

        setError('');
        setSuccess('');

        startTransition(async () => {
            try {
                const data = await login(values);

                if (data?.error) {
                    form.reset();
                    setError(data?.error);
                }

                if (data?.success) {
                    form.reset();
                    setSuccess(data?.success);
                }

                if (data?.twoFactor) {
                    setShowTwoFactor(true);
                }
            } catch (error) {
                setError('Something went wrong');
            }
        });
    }

    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial={!showTwoFactor}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="123456"
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="jhondoe@example.com"
                                                    type="email"
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="******"
                                                    type="password"
                                                />
                                            </FormControl>

                                            <Button
                                                size={'sm'}
                                                variant={'link'}
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                <Link href={"/auth/reset"}>
                                                    Forgot your password?
                                                </Link>
                                            </Button>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>

                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ?
                            "Loading..." :
                            showTwoFactor ? "Confirm" : "Login"
                        }
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
