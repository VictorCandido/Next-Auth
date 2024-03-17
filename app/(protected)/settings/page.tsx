import { auth, signOut } from "@/auth";

const Settings = async () => {
    const session = await auth();

    return (
        <div>
            <pre>{JSON.stringify(session, null, 2)}</pre>

            <form action={async () => {
                'use server';
                await signOut();
            }}>

                <button type="submit">Sign out</button>
            </form>
        </div>
    );
}

export default Settings;