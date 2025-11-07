import { useEffect, useState } from "react";
import { FiBarChart2, FiPieChart, FiTrendingUp } from "react-icons/fi";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  date: string;
  spending: number;
  orders: number;
  designViews: number;
  logins: number;
}

interface UserAnalyticsChartsProps {
  data: ChartDataPoint[];
}

const UserAnalyticsCharts = ({ data }: UserAnalyticsChartsProps) => {
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");
  const [isMobile, setIsMobile] = useState(false);
  const [activeChart, setActiveChart] = useState<string>("all");

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 xs:py-12 text-center">
        <FiBarChart2 className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Chart Data Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
          There's no analytics data available for the selected time period.
        </p>
      </div>
    );
  }

  // Format data for better mobile display
  const formattedData = data.map((item) => ({
    ...item,
    // Shorten date labels for mobile
    shortDate: isMobile
      ? new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "2-digit",
        }),
    // Create compact display values
    spendingK:
      item.spending >= 1000
        ? `${(item.spending / 1000).toFixed(1)}k`
        : item.spending,
    viewsK:
      item.designViews >= 1000
        ? `${(item.designViews / 1000).toFixed(1)}k`
        : item.designViews,
  }));

  // Calculate totals for summary
  const totals = {
    spending: data.reduce((sum, item) => sum + item.spending, 0),
    orders: data.reduce((sum, item) => sum + item.orders, 0),
    designViews: data.reduce((sum, item) => sum + item.designViews, 0),
    logins: data.reduce((sum, item) => sum + item.logins, 0),
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 xs:p-4">
          <p className="font-medium text-gray-900 dark:text-white text-sm mb-2">
            {new Date(label).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-400 capitalize">
                {entry.dataKey}:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {entry.dataKey === "spending"
                  ? `$${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Chart color schemes
  const colorSchemes = {
    spending: "#8884d8",
    orders: "#82ca9d",
    designViews: "#ffc658",
    logins: "#ff7300",
  };

  // Mobile-optimized chart configuration
  const chartConfig = {
    margin: isMobile
      ? { top: 10, right: 10, left: 10, bottom: 20 }
      : { top: 20, right: 30, left: 20, bottom: 20 },
    fontSize: isMobile ? 12 : 14,
    tickCount: isMobile ? 5 : 8,
  };

  // Chart type selector for mobile
  const ChartTypeSelector = () => (
    <div className="flex items-center gap-1 xs:gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
      {[
        { key: "line", label: "Line", icon: FiTrendingUp },
        { key: "bar", label: "Bar", icon: FiBarChart2 },
        { key: "area", label: "Area", icon: FiPieChart },
      ].map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.key}
            onClick={() => setChartType(type.key as any)}
            className={`flex items-center gap-1 xs:gap-2 px-2 xs:px-3 py-1.5 xs:py-2 rounded-md text-xs xs:text-sm font-medium transition-colors ${
              chartType === type.key
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Icon className="w-3 h-3 xs:w-4 xs:h-4" />
            <span className="hidden xs:inline">{type.label}</span>
          </button>
        );
      })}
    </div>
  );

  // Filter buttons for mobile
  const ChartFilterButtons = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {[
        { key: "all", label: "All Metrics" },
        { key: "spending", label: "Spending" },
        { key: "orders", label: "Orders" },
        { key: "designViews", label: "Views" },
        { key: "logins", label: "Logins" },
      ].map((filter) => (
        <button
          key={filter.key}
          onClick={() => setActiveChart(filter.key)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            activeChart === filter.key
              ? "bg-primary text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );

  // Render the appropriate chart based on type and active filter
  const renderChart = (
    chartData: any[],
    dataKeys: string[],
    colors: string[]
  ) => {
    const commonProps = {
      data: chartData,
      margin: chartConfig.margin,
    };

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="shortDate"
              stroke="#888"
              fontSize={chartConfig.fontSize}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 40}
            />
            <YAxis
              stroke="#888"
              fontSize={chartConfig.fontSize}
              width={isMobile ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: chartConfig.fontSize,
                paddingTop: isMobile ? 10 : 20,
              }}
            />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index]}
                radius={[2, 2, 0, 0]}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="shortDate"
              stroke="#888"
              fontSize={chartConfig.fontSize}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 40}
            />
            <YAxis
              stroke="#888"
              fontSize={chartConfig.fontSize}
              width={isMobile ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: chartConfig.fontSize,
                paddingTop: isMobile ? 10 : 20,
              }}
            />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.3}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </AreaChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="shortDate"
              stroke="#888"
              fontSize={chartConfig.fontSize}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 40}
            />
            <YAxis
              stroke="#888"
              fontSize={chartConfig.fontSize}
              width={isMobile ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: chartConfig.fontSize,
                paddingTop: isMobile ? 10 : 20,
              }}
            />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                strokeWidth={2}
                dot={{ r: isMobile ? 2 : 3 }}
                activeDot={{ r: isMobile ? 4 : 6 }}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </LineChart>
        );
    }
  };

  // Get data keys and colors based on active filter
  const getChartConfig = () => {
    switch (activeChart) {
      case "spending":
        return {
          dataKeys: ["spending"],
          colors: [colorSchemes.spending],
        };
      case "orders":
        return {
          dataKeys: ["orders"],
          colors: [colorSchemes.orders],
        };
      case "designViews":
        return {
          dataKeys: ["designViews"],
          colors: [colorSchemes.designViews],
        };
      case "logins":
        return {
          dataKeys: ["logins"],
          colors: [colorSchemes.logins],
        };
      default: // all
        return {
          dataKeys: ["spending", "orders", "designViews", "logins"],
          colors: [
            colorSchemes.spending,
            colorSchemes.orders,
            colorSchemes.designViews,
            colorSchemes.logins,
          ],
        };
    }
  };

  const { dataKeys, colors } = getChartConfig();

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Mobile Controls */}
      <div className="lg:hidden space-y-3">
        <ChartTypeSelector />
        <ChartFilterButtons />
      </div>

      {/* Desktop Controls */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Analytics Overview
          </h3>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {["line", "bar", "area"].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type as any)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  chartType === type
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3">
        {[
          {
            key: "spending",
            label: "Total Spending",
            value: `$${totals.spending.toLocaleString()}`,
            color: colorSchemes.spending,
          },
          {
            key: "orders",
            label: "Total Orders",
            value: totals.orders.toLocaleString(),
            color: colorSchemes.orders,
          },
          {
            key: "designViews",
            label: "Total Views",
            value: totals.designViews.toLocaleString(),
            color: colorSchemes.designViews,
          },
          {
            key: "logins",
            label: "Total Logins",
            value: totals.logins.toLocaleString(),
            color: colorSchemes.logins,
          },
        ].map((metric) => (
          <div
            key={metric.key}
            className="bg-white dark:bg-gray-800 rounded-xl p-3 xs:p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: metric.color }}
              />
              <p className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.label}
              </p>
            </div>
            <p className="text-lg xs:text-xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6 border border-gray-200 dark:border-gray-700">
        <div className="h-64 xs:h-72 sm:h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(formattedData, dataKeys, colors)}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mini Charts for Mobile */}
      {isMobile && (
        <div className="space-y-4">
          {[
            {
              key: "spending",
              label: "Spending Trend",
              color: colorSchemes.spending,
            },
            {
              key: "orders",
              label: "Orders Trend",
              color: colorSchemes.orders,
            },
            {
              key: "designViews",
              label: "Views Trend",
              color: colorSchemes.designViews,
            },
            { key: "logins", label: "Login Trend", color: colorSchemes.logins },
          ].map((metric) => (
            <div
              key={metric.key}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {metric.label}
                </h4>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: metric.color }}
                />
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formattedData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <Line
                      type="monotone"
                      dataKey={metric.key}
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAnalyticsCharts;
