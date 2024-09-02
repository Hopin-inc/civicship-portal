import TestOrganizationList from "@/app/components/elements/TestOrganizationList";
import LineLoginButton from "@/app/components/elements/LineLoginButton";
import LogoutButton from "@/app/components/elements/LogoutButton";

const Home: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <h1 className="text-2xl font-bold">civicship portal</h1>
      <div className="flex">
        <LineLoginButton />
        <LogoutButton />
      </div>
      <TestOrganizationList />
    </main>
  );
};

export default Home;
