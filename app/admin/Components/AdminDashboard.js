"use client";

import React from "react";
import BookSection from "./BookSection";

const approveAction = {
    action: "approve",
    label: "Approve",
    busyLabel: "Approving...",
    className: "bg-emerald-700 hover:bg-emerald-600 text-white shadow-md shadow-emerald-950/10",
};

const denyAction = {
    action: "deny",
    label: "Deny",
    busyLabel: "Denying...",
    className: "bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900/40 hover:text-red-300",
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
