import Link from 'next/link';

import classes from './main-navigation.module.css';
import { useSession, signOut } from "next-auth/react";

function MainNavigation() {
    const { data: session, status } = useSession();

    async function logOutHandler() {
        await signOut();
    }
    return (
        <header className={classes.header}>
            <Link href='/' legacyBehavior>
                <a>
                    <div className={classes.logo}>Next Auth</div>
                </a>
            </Link>
            <nav>
                <ul>
                    {!session && status === "unauthenticated" && <li>
                        <Link href='/auth'>Login</Link>
                    </li>}

                    {session && status !== "loading" && <li>
                        <Link href='/profile'>Profile</Link>
                    </li>}
                    {session && status !== "loading" && <li>
                        <button onClick={logOutHandler}>Logout</button>
                    </li>}
                </ul>
            </nav>
        </header >
    );
}

export default MainNavigation;
