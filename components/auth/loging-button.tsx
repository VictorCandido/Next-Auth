'use client'

import { useRouter } from "next/navigation";

interface LogginButtonProps {
    children: React.ReactNode;
    mode?: 'modal' | 'redirect';
    asChild?: boolean;
}

const LogginButton = ({ children, asChild, mode = 'redirect' }: LogginButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push('/auth/login');
    }

    if (mode === 'modal') {
        return (
            <span>
                TODO: Implement modal
            </span>
        );
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
}

export default LogginButton;