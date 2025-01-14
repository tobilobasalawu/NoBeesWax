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
                    signUpUrl="/sign-up"
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-blue-500 text-white',
                            footerAction: "text-blue-500 hover:text-blue-600",
                            headerTitle: {
                                color: 'var(--text-primary)',
                                '&::after': {
                                    display: 'none' // Remove the underline
                                }
                            }
                        },
                        variables: {
                            spacingUnit: "1rem",
                        }
                    }}
                    localization={{
                        signIn: {
                            start: {
                                title: "Sign in to NoBeeswax" // Fix "Sign into" to "Sign in to"
                            }
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
