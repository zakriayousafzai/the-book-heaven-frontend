"use client";

import React from "react";
import BookSection from "./BookSection";

const approveAction = {
    action: "approve",
    label: "Approve",
    busyLabel: "Approving...",
    className: "bg-primary",
};

const denyAction = {
    action: "deny",
    label: "Deny",
    busyLabel: "Denying...",
    className: "bg-red-500",
};

const AdminDashboard = () => {
    return (
        <>
            <BookSection
                title="Pending Books"
                status="pending"
                actions={[approveAction, denyAction]}
            />
            <BookSection
                title="Approved Books"
                status="allowed"
                actions={[denyAction]}
            />
            <BookSection
                title="Denied Books"
                status="denied"
                actions={[approveAction]}
            />
        </>
    );
};

export default AdminDashboard;
