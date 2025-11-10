"use client";

import { useEffect, useState, useCallback } from "react";
import CostCard from "@/components/admin/costs/CostCard";
import CostsHeader from "@/components/admin/costs/CostsHeader";
import HistoricalCostChart from "@/components/admin/costs/HistoricalCostChart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronDown, RefreshCw, AlertCircle } from "lucide-react";
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const CostsPage = () => {
  const [currentMonthCosts, setCurrentMonthCosts] =
    useState<MonthlyCost | null>(null);
  const [previousMonthCosts, setPreviousMonthCosts] =
    useState<MonthlyCost | null>(null);
  const [historicalCosts, setHistoricalCosts] = useState<MonthlyCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState("Last 6 Months");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch current and previous month costs for CostCards
  const fetchCurrentAndPreviousCosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const [currentRes, previousRes] = await Promise.all([
        fetch(
          `/api/admin/costs/historical?month=${currentMonth.toISOString()}`
        ),
        fetch(
          `/api/admin/costs/historical?month=${previousMonth.toISOString()}`
        ),
      ]);

      let currentData: MonthlyCost | null = null;
      if (currentRes.ok) {
        const data = await currentRes.json();
        currentData = data.find(
          (cost: MonthlyCost) =>
            new Date(cost.month).getMonth() === currentMonth.getMonth() &&
            new Date(cost.month).getFullYear() === currentMonth.getFullYear()
        );
        setCurrentMonthCosts(currentData || null);
      } else {
        console.warn("Failed to fetch current month costs.");
      }

      let previousData: MonthlyCost | null = null;
      if (previousRes.ok) {
        const data = await previousRes.json();
        previousData = data.find(
          (cost: MonthlyCost) =>
            new Date(cost.month).getMonth() === previousMonth.getMonth() &&
            new Date(cost.month).getFullYear() === previousMonth.getFullYear()
        );
        setPreviousMonthCosts(previousData || null);
      } else {
        console.warn("Failed to fetch previous month costs.");
      }

      if (!currentData) {
        toast.info("Current month costs not found. Please calculate them.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching current/previous costs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentAndPreviousCosts();
  }, [fetchCurrentAndPreviousCosts]);

  // Fetch historical costs for the chart based on timePeriod
  const fetchHistoricalCosts = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/costs/historical?timePeriod=${encodeURIComponent(timePeriod)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch historical costs");
      }
      const data: MonthlyCost[] = await response.json();
      setHistoricalCosts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching historical costs:", err);
    } finally {
      setRefreshing(false);
    }
  }, [timePeriod]);

  useEffect(() => {
    fetchHistoricalCosts();
  }, [fetchHistoricalCosts]);

  const handleRefresh = async () => {
    await Promise.all([fetchCurrentAndPreviousCosts(), fetchHistoricalCosts()]);
    toast.success("Costs data refreshed");
  };

  const handleCalculateCosts = async () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/admin/costs/calculate", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to calculate costs");
        }
        await handleRefresh();
        resolve("Costs calculated successfully.");
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Calculating monthly costs...",
      success: (message) => `${message}`,
      error: (err) => `Error: ${err.message}`,
    });
  };

  const allCostsData = [];

  if (currentMonthCosts) {
    const digitalOceanChange = calculatePercentageChange(
      currentMonthCosts.digitalOcean,
      previousMonthCosts?.digitalOcean || 0
    );
    const resendEmailsChange = calculatePercentageChange(
      currentMonthCosts.resendEmails,
      previousMonthCosts?.resendEmails || 0
    );
    const hostingChange = calculatePercentageChange(
      currentMonthCosts.hosting,
      previousMonthCosts?.hosting || 0
    );
    const totalChange = calculatePercentageChange(
      currentMonthCosts.total,
      previousMonthCosts?.total || 0
    );

    allCostsData.push(
      {
        service: "DigitalOcean Spaces",
        cost: formatCurrency(currentMonthCosts.digitalOcean),
        change: `${digitalOceanChange >= 0 ? "+" : ""}${digitalOceanChange.toFixed(1)}%`,
        changeType: getChangeType(digitalOceanChange),
        icon: "storage",
        details: `Previous: ${formatCurrency(previousMonthCosts?.digitalOcean || 0)}`,
        trend: digitalOceanChange,
      },
      {
        service: "Resend Emails",
        cost: formatCurrency(currentMonthCosts.resendEmails),
        change: `${resendEmailsChange >= 0 ? "+" : ""}${resendEmailsChange.toFixed(1)}%`,
        changeType: getChangeType(resendEmailsChange),
        icon: "email",
        details: `Previous: ${formatCurrency(previousMonthCosts?.resendEmails || 0)}`,
        trend: resendEmailsChange,
      },
      {
        service: "Hosting & Domains",
        cost: formatCurrency(currentMonthCosts.hosting),
        change: `${hostingChange >= 0 ? "+" : ""}${hostingChange.toFixed(1)}%`,
        changeType: getChangeType(hostingChange),
        icon: "cloud",
        details: `Previous: ${formatCurrency(previousMonthCosts?.hosting || 0)}`,
        trend: hostingChange,
      },
      {
        service: "Total Monthly Costs",
        cost: formatCurrency(currentMonthCosts.total),
        change: `${totalChange >= 0 ? "+" : ""}${totalChange.toFixed(1)}%`,
        changeType: getChangeType(totalChange),
        icon: "payments",
        details: `Previous: ${formatCurrency(previousMonthCosts?.total || 0)}`,
        trend: totalChange,
        isTotal: true,
      }
    );
  }

  // Loading Skeleton
  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Header Skeleton */}
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Current Month Overview Skeleton */}
          <section>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </section>

          {/* Historical Chart Skeleton */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-80 w-full rounded-xl" />
          </section>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !currentMonthCosts) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 sm:gap-8">
          <CostsHeader />

          <Alert variant="destructive" className="border-l-4 border-l-red-500">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="flex-1">{error}</span>
              <div className="flex gap-2">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="text-4xl mb-4">💸</div>
            <h3 className="text-lg font-semibold mb-2">Unable to Load Costs</h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
              We're having trouble loading your cost data. Please check your
              connection and try again.
            </p>
            <Button
              onClick={handleRefresh}
              className="flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Header with Refresh Button */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4">
          <CostsHeader />
          <div className="flex gap-2">
            <Button
              onClick={handleCalculateCosts}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 w-full xs:w-auto"
            >
              Calculate Costs
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="flex items-center gap-2 w-full xs:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Error Alert (if any) */}
        {error && (
          <Alert variant="destructive" className="border-l-4 border-l-red-500">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Current Month Overview */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold leading-tight tracking-tight">
              Current Month Overview
            </h2>
            <div className="text-xs text-muted-foreground hidden xs:block">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {allCostsData.length > 0 ? (
              allCostsData.map((cost, index) => (
                <CostCard
                  key={index}
                  service={cost.service}
                  cost={cost.cost}
                  change={cost.change}
                  changeType={cost.changeType}
                  icon={cost.icon}
                  details={cost.details}
                  trend={cost.trend}
                  isTotal={cost.isTotal}
                  className="h-full"
                />
              ))
            ) : (
              // Empty State
              <div className="col-span-full text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">No Cost Data</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
                  No cost data available for the current month. Costs will
                  appear here once they are calculated.
                </p>
                <Button onClick={handleRefresh}>Check for Updates</Button>
              </div>
            )}
          </div>

          {/* Mobile Date Info */}
          <div className="xs:hidden text-center mt-3">
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </section>

        {/* Historical Cost Analysis */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl font-bold leading-tight tracking-tight">
              Historical Cost Analysis
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground hidden sm:block">
                {refreshing
                  ? "Updating..."
                  : `${historicalCosts.length} months`}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <span>{timePeriod}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px]">
                  <DropdownMenuItem
                    onClick={() => setTimePeriod("Last 6 Months")}
                  >
                    Last 6 Months
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTimePeriod("Last 12 Months")}
                  >
                    Last 12 Months
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimePeriod("All Time")}>
                    All Time
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Data Count */}
          <div className="sm:hidden text-center mb-4">
            <div className="text-xs text-muted-foreground">
              {refreshing
                ? "Updating..."
                : `${historicalCosts.length} months of data`}
            </div>
          </div>

          <HistoricalCostChart
            historicalCosts={historicalCosts}
            timePeriod={timePeriod}
            loading={refreshing}
          />
        </section>
      </div>
    </div>
  );
};

export default CostsPage;
