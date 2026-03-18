import MessageContainer from "@/components/messages/MessageContainer";
import Sidebar from "@/components/sidebar/Sidebar";

function Home() {
  // bg-opacity-0 bg-gray-400 → bg-gray-400/0
  return (
    <div className="flex h-screen w-full max-w-4xl overflow-hidden rounded-lg bg-gray-400/0 bg-clip-padding backdrop-blur-lg backdrop-filter sm:h-112.5 md:h-137.5">
      <div className="hidden sm:block">
        <Sidebar showMessageMenu={true} />
      </div>
      <MessageContainer />
    </div>
  );
}

export default Home;
