import MapView from "../components/MapView";
import ComplaintForm from "../components/ComplaintForm";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";

const Home = () => {
  return (
    <Layout role="citizen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
        {/* Left Column: Complaint Form */}
        <div className="lg:col-span-1 h-full">
          <ComplaintForm onSuccess={() => window.location.reload()} />
        </div>

        {/* Right Column: Map View */}
        <div className="lg:col-span-2 h-full">
          <Card className="h-full p-0 border border-slate-200 shadow-lg">
            <MapView />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

