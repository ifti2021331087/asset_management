
import { createAuthClient } from "better-auth/react"
import { adminClient } from 'better-auth/client/plugins'
import React from 'react'

export const authClient=createAuthClient({
    plugins:[adminClient()],
});

export const {signIn,signOut,useSession,getSession}=authClient;