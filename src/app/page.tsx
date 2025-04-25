
import { redirect } from "next/navigation";

const Home: React.FC = async () => {
  redirect(`/places`);
};

export default Home;
