"use client";

import { AuthGuard } from "../../components/AuthGuard";
import { PostForm } from "../../components/PostForm";

function NewPostPage() {
    return <PostForm />;
}

export default function Page() {
    return (
        <AuthGuard>
            <NewPostPage />
        </AuthGuard>
    );
}
