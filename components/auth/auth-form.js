import { useState, useRef } from 'react';
import classes from './auth-form.module.css';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/router';

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    const emailRef = useRef();
    const passwordRef = useRef();

    function switchAuthModeHandler() {
        setIsLogin((prevState) => !prevState);
    }

    async function formSubmitHandler(event) {
        event.preventDefault();
        const enteredEmail = emailRef.current.value;
        const enteredPassword = passwordRef.current.value;
        if (isLogin) {
            // login user
            const result = await signIn('credentials', {
                redirect: false,
                email: enteredEmail,
                password: enteredPassword,
            });
            if (!result.error) {
                router.replace('/profile');
            }
        } else {
            // sign up / create user
            try {
                const responseData = await createUser(enteredEmail, enteredPassword);
                console.log(responseData);
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function createUser(enteredEmail, enteredPassword) {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }
        return data;
    }



    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={formSubmitHandler}>
                <div className={classes.control}>
                    <label htmlFor='email'>Your Email</label>
                    <input type='email' id='email' required ref={emailRef} />
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input type='password' id='password' required ref={passwordRef} />
                </div>
                <div className={classes.actions}>
                    <button>{isLogin ? 'Login' : 'Create Account'}</button>
                    <button
                        type='button'
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}
                    >
                        {isLogin ? 'Create new account' : 'Login with existing account'}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default AuthForm;
