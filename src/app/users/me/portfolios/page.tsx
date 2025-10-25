import Header from "./components/Header";
import { PortfoliosList } from "@/app/users/features/portfolios";

export default function PortfoliosPage() {
    return (
        <div>
            <Header />
            <PortfoliosList />
        </div>
    );
}
