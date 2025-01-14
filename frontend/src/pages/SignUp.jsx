import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const SignUpPage = () => {
    return (
        <div className="sign-up-container flex items-center justify-center min-h-screen" style={{ backgroundColor: 'transparent' }}>
            <SignedOut>
                <SignUp 
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-blue-500 text-white',
                            footerAction: "text-blue-500 hover:text-blue-600",
                            headerTitle: {
                                color: 'var(--text-primary)',
                                '&::after': {
                                    display: 'none'
                                }
                            }
                        },
                        variables: {
                            spacingUnit: "1rem",
                        }
                    }}
                    localization={{
                        signUp: {
                            start: {
                                title: "Sign up for NoBeeswax"
                            }
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