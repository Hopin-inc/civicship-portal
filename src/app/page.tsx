import MapView from "@/app/components/features/home/MapView";

const Home: React.FC = async () => {
  return (
    <div className="h-[calc(100vh-88px)]">
      <MapView />
    </div>
  );
};

export default Home;
