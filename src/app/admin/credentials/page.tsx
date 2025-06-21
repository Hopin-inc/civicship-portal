"use client";

import TicketSelector from "./components/TicketSelector";

export default function CredentialsPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">募集管理</h1>
            <div className="space-y-8">
                <div>
                    <h2 className="text-lg font-semibold mb-4">1. チケットを選択</h2>
                    <TicketSelector />
                </div>
            </div>
        </div>        
    );
}
