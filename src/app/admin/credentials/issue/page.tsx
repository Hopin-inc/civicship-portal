import TicketSelector from "../components/TicketSelector";

export default function SelectOpportunity() {
    return (
        <div className="p-4 space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
                <TicketSelector />
            </div>
        </div>
    );
}