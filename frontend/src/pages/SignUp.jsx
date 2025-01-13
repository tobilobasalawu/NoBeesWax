// ... imports remain similar, just change SignIn to SignUp ...
import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';

const SignUpPage = () => {
    return (
        <div className="sign-up-container flex items-center justify-center min-h-screen" style={{ backgroundColor: 'transparent' }}>
            <SignedOut>
                <SignUp 
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in" // Redirect to /sign-up for the "Sign up" link
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
                <p className="text-center text-white">You are already signed up.</p>
            </SignedIn>
        </div>
    );
};

export default SignUpPage;