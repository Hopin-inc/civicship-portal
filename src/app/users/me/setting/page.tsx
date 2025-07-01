import AccountSection from "./components/AccountSection";
import DangerSection from "./components/DangerSection";
import HelpSection from "./components/HelpSection";
import PromiseSection from "./components/PromiseSection";
import SettingSection from "./components/SettingSection";

export default function SettingPage() {
  return (
    <div className="container mx-auto px-6 py-6 max-w-3xl">
      <h1 className="text-sm mb-2 font-bold">アカウント</h1>
      <AccountSection />
      <h1 className="text-sm mb-2 font-bold mt-6">設定</h1>
      <SettingSection />
      <h1 className="text-sm mb-2 font-bold mt-6">ヘルプ</h1>
      <HelpSection />
      <h1 className="text-sm mb-2 font-bold mt-6">利用にあたっての約束</h1>
      <PromiseSection />
      <h1 className="text-sm mb-2 font-bold mt-6">ご注意して操作して下さい</h1>
      <DangerSection />
    </div>
  );
}
