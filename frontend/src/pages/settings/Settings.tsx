import Sidebar from "@/components/sidebar/Sidebar";
import { Button } from "@/components/ui/button";

const settingsPageContent = ["ユーザー名の変更"];
function Settings() {
  return (
    <div className="flex h-screen w-full max-w-4xl overflow-hidden rounded-lg bg-gray-400/60 bg-clip-padding backdrop-blur-lg backdrop-filter sm:h-[450px] md:h-[550px]">
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4">
        {settingsPageContent.map((content) => (
          <div key={content}>
            <Button className="relative h-12 rounded-xl border-b-[6px] border-slate-300 bg-white px-6 font-mono font-bold text-slate-700 shadow-sm transition-all duration-75 hover:bg-slate-50 active:translate-y-[4px] active:border-b-[2px]">
              {content}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Settings;

// function Settings() {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center gap-4">
//       {settingsPageContent.map((content) => (
//         <div key={content}>
//           <Button className="relative h-12 rounded-xl border-b-[6px] border-slate-300 bg-white px-6 font-mono font-bold text-slate-700 shadow-sm transition-all duration-75 hover:bg-slate-50 active:translate-y-[4px] active:border-b-[2px]">
//             {content}
//           </Button>
//         </div>
//       ))}
//     </div>
//   );
// }
