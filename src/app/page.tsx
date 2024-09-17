// import TestOrganizationList from "@/app/components/elements/TestOrganizationList";
import LineLoginButton from "@/app/components/elements/LineLoginButton";
import FacebookLoginButton from "@/app/components/elements/FacebookLoginButton";
import LogoutButton from "@/app/components/elements/LogoutButton";

const Home: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <h1 className="text-2xl font-bold">civicship portal</h1>
      <div className="flex gap-2">
        <LineLoginButton />
        <FacebookLoginButton />
        <LogoutButton />
      </div>
      {/*<TestOrganizationList />*/}
    </main>
  );
};

export default Home;
