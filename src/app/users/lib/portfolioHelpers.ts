import { AppPortfolio } from "@/app/users/data/type";

export function parsePortfolioDate(dateString: string): Date {
  return new Date(dateString);
}

export function isPortfolioInFuture(portfolio: AppPortfolio, today: Date): boolean {
  const portfolioDate = parsePortfolioDate(portfolio.date);
  return portfolioDate >= today;
}

export function isPortfolioInPast(portfolio: AppPortfolio, today: Date): boolean {
  return !isPortfolioInFuture(portfolio, today);
}

export function normalizeSearchQuery(query: string): string {
  return query.toLowerCase().trim();
}

export function portfolioMatchesSearch(
  portfolio: AppPortfolio,
  searchQuery: string
): boolean {
  if (!searchQuery) return true;
  
  const normalizedQuery = normalizeSearchQuery(searchQuery);
  return (
    portfolio.title.toLowerCase().includes(normalizedQuery) ||
    portfolio.location?.toLowerCase().includes(normalizedQuery)
  );
}

export function filterFuturePortfolios(
  portfolios: AppPortfolio[],
  searchQuery: string,
  today: Date
): AppPortfolio[] {
  return portfolios
    .filter((portfolio) => {
      if (!isPortfolioInFuture(portfolio, today)) return false;
      return portfolioMatchesSearch(portfolio, searchQuery);
    })
    .sort((a, b) => {
      return parsePortfolioDate(a.date).getTime() - parsePortfolioDate(b.date).getTime();
    });
}

export function filterPastPortfolios(
  portfolios: AppPortfolio[],
  searchQuery: string,
  today: Date
): AppPortfolio[] {
  return portfolios
    .filter((portfolio) => {
      if (!isPortfolioInPast(portfolio, today)) return false;
      return portfolioMatchesSearch(portfolio, searchQuery);
    })
    .sort((a, b) => {
      return parsePortfolioDate(b.date).getTime() - parsePortfolioDate(a.date).getTime();
    });
}
