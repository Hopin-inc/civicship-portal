import CreateOpportunitySheet from "./components/CreateOpportunity";
import CredentialList from "./components/CredentialList";

export default function CredentialsPage() {
    return (
        <div className="p-4 space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">証明書一覧</h1>
                    <CreateOpportunitySheet />
                </div>
                <CredentialList />
            </div>
        </div>
    );
}
