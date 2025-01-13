// frontend/src/pages/SignIn.jsx
import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const SignInPage = () => {
    return (
        <div className="sign-in-container flex items-center justify-center min-h-screen" style={{ backgroundColor: 'transparent' }}>
            <SignedOut>
                <SignIn 
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up" // Redirect to /sign-up for the "Sign up" link
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-blue-500 text-white', // Style for the primary button
                            footerAction: "text-blue-500 hover:text-blue-600", // Style for the "Sign up" link
                        },
                        variables: {
                            spacingUnit: "1rem",
                        }
                    }}
                />
            </SignedOut>
            <SignedIn>
                <p className="text-center text-white">You are already signed in.</p>
            </SignedIn>
        </div>
    );
};

export default SignInPage;
