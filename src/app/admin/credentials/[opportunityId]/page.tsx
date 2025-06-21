import TimeSlot from "./components/TimeSlot";

export default function CredentialsPage ({ params }: { params: { opportunityId: string } }) {
    const { opportunityId } = params;

    return (
        <TimeSlot opportunityId={opportunityId} />
    );
}