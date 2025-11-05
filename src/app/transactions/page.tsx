import { Header } from "@/app/transactions/components/Header";
import { getServerCommunityTransactions } from "@/hooks/transactions/server-community-transactions";
import { ServerInfiniteTransactionList } from "./components/ServerInfiniteTransactionList";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function TransactionsPage() {
    const t = await getTranslations();
    const transactions = await getServerCommunityTransactions({
        first: 20,
    });
    return (
        <>
        <Header />
        <div className="mt-6 px-4">
            {transactions.edges?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center pt-6">
                {t("transactions.empty")}
            </p>
            ) : (
            <ServerInfiniteTransactionList />
            )}
        </div>
        </>
    );
}
