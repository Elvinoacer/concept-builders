"use client";

import { useEffect, useState, useCallback } from "react";
import CostCard from "@/components/admin/costs/CostCard";
import CostsHeader from "@/components/admin/costs/CostsHeader";
import HistoricalCostChart from "@/components/admin/costs/HistoricalCostChart";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface MonthlyCost {
  id: string;
  month: string; // ISO date string
  digitalOcean: number;
  resendEmails: number;
  hosting: number;
  total: number;
}

const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

const getChangeType = (change: number) => {
  if (change > 0) return "increase";
  if (change < 0) return "decrease";
  return "neutral";
};

const CostsPage = () => {
  const [currentMonthCosts, setCurrentMonthCosts] = useState<MonthlyCost | null>(null);
  const [previousMonthCosts, setPreviousMonthCosts] = useState<MonthlyCost | null>(null);
  const [historicalCosts, setHistoricalCosts] = useState<MonthlyCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState("Last 6 Months");

  // Fetch current and previous month costs for CostCards
  useEffect(() => {
    const fetchCurrentAndPreviousCosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [currentRes, previousRes] = await Promise.all([
          fetch(`/api/admin/costs/historical?month=${currentMonth.toISOString()}`),
          fetch(`/api/admin/costs/historical?month=${previousMonth.toISOString()}`),
        ]);

        let currentData: MonthlyCost | null = null;
        if (currentRes.ok) {
          const data = await currentRes.json();
          currentData = data.find((cost: MonthlyCost) => new Date(cost.month).getMonth() === currentMonth.getMonth() && new Date(cost.month).getFullYear() === currentMonth.getFullYear());
          setCurrentMonthCosts(currentData || null);
        } else {
          console.warn("Failed to fetch current month costs.");
        }

        let previousData: MonthlyCost | null = null;
        if (previousRes.ok) {
          const data = await previousRes.json();
          previousData = data.find((cost: MonthlyCost) => new Date(cost.month).getMonth() === previousMonth.getMonth() && new Date(cost.month).getFullYear() === previousMonth.getFullYear());
          setPreviousMonthCosts(previousData || null);
        } else {
          console.warn("Failed to fetch previous month costs.");
        }

        if (!currentData) {
          toast.info("Current month costs not found. Please calculate them.");
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching current/previous costs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentAndPreviousCosts();
  }, []);

  // Fetch historical costs for the chart based on timePeriod
  const fetchHistoricalCosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/costs/historical?timePeriod=${timePeriod}`);
      if (!response.ok) {
        throw new Error("Failed to fetch historical costs");
      }
      const data: MonthlyCost[] = await response.json();
      setHistoricalCosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error fetching historical costs:", err);
    } finally {
      setLoading(false);
    }
  }, [timePeriod]);

  useEffect(() => {
    fetchHistoricalCosts();
  }, [fetchHistoricalCosts]);

  const allCostsData = [];

  if (currentMonthCosts) {
    const digitalOceanChange = calculatePercentageChange(currentMonthCosts.digitalOcean, previousMonthCosts?.digitalOcean || 0);
    const resendEmailsChange = calculatePercentageChange(currentMonthCosts.resendEmails, previousMonthCosts?.resendEmails || 0);
    const hostingChange = calculatePercentageChange(currentMonthCosts.hosting, previousMonthCosts?.hosting || 0);
    const totalChange = calculatePercentageChange(currentMonthCosts.total, previousMonthCosts?.total || 0);

    allCostsData.push(
      {
        service: "DigitalOcean Spaces",
        cost: `${currentMonthCosts.digitalOcean.toFixed(2)}`,
        change: `${digitalOceanChange >= 0 ? "+" : ""}${digitalOceanChange.toFixed(1)}%`,
        changeType: getChangeType(digitalOceanChange),
        icon: "storage",
        details: `Current: ${currentMonthCosts.digitalOcean.toFixed(2)}`,
      },
      {
        service: "Resend Emails",
        cost: `${currentMonthCosts.resendEmails.toFixed(2)}`,
        change: `${resendEmailsChange >= 0 ? "+" : ""}${resendEmailsChange.toFixed(1)}%`,
        changeType: getChangeType(resendEmailsChange),
        icon: "email",
        details: `Current: ${currentMonthCosts.resendEmails.toFixed(2)}`,
      },
      {
        service: "Hosting (Vercel)",
        cost: `${currentMonthCosts.hosting.toFixed(2)}`,
        change: `${hostingChange >= 0 ? "+" : ""}${hostingChange.toFixed(1)}%`,
        changeType: getChangeType(hostingChange),
        icon: "cloud",
        details: `Current: ${currentMonthCosts.hosting.toFixed(2)}`,
      },
      {
        service: "Total Monthly Costs",
        cost: `${currentMonthCosts.total.toFixed(2)}`,
        change: `${totalChange >= 0 ? "+" : ""}${totalChange.toFixed(1)}%`,
        changeType: getChangeType(totalChange),
        icon: "payments",
        details: `Current: ${currentMonthCosts.total.toFixed(2)}`,
      }
    );
  }

  if (loading) {
    return <div className="flex-1 p-4 md:p-10">Loading costs...</div>;
  }

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-10 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10">
      <div className="flex flex-col gap-8">
        <CostsHeader />
        <section>
          <h2 className="text-lg md:text-xl font-bold leading-tight tracking-tight mb-2 md:mb-4">
            Current Month Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allCostsData.map((cost, index) => (
              <CostCard
                key={index}
                service={cost.service}
                cost={cost.cost}
                change={cost.change}
                changeType={cost.changeType}
                icon={cost.icon}
                details={cost.details}
              />
            ))}
          </div>
        </section>
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold leading-tight tracking-tight">
              Historical Cost Analysis
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {timePeriod} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTimePeriod("Last 6 Months")}>
                  Last 6 Months
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimePeriod("Last 12 Months")}>
                  Last 12 Months
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimePeriod("All Time")}>
                  All Time
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <HistoricalCostChart historicalCosts={historicalCosts} timePeriod={timePeriod} />
        </section>
      </div>
    </div>
  );
};

export default CostsPage;
