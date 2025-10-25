import AccountSection from "@/app/users/features/settings/components/AccountSection";
import DangerSection from "@/app/users/features/settings/components/DangerSection";
import HelpSection from "@/app/users/features/settings/components/HelpSection";
import PromiseSection from "@/app/users/features/settings/components/PromiseSection";
import SettingSection from "@/app/users/features/settings/components/SettingSection";

export default function SettingPage() {
  return (
    <div className="container mx-auto px-6 py-6 max-w-3xl">
      <h2 className="text-sm mb-2 font-bold">アカウント</h2>
      <AccountSection />
      <h2 className="text-sm mb-2 font-bold mt-6">設定</h2>
      <SettingSection />
      {/* TODO : 表示可能になるまでコメントアウト */}
      {/* <h2 className="text-sm mb-2 font-bold mt-6">ヘルプ</h2>
      <HelpSection /> */}
      <h2 className="text-sm mb-2 font-bold mt-6">利用にあたっての約束</h2>
      <PromiseSection />
      <h2 className="text-sm mb-2 font-bold mt-6">ご注意して操作して下さい</h2>
      <DangerSection />
    </div>
  );
}
