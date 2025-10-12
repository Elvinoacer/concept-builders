import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timePeriod = searchParams.get("timePeriod") || "1Y"; // Default to 1 year

    // In a real application, you would fetch historical cost data from your database
    // based on the timePeriod. This is mock data for demonstration.
    let data = [];
    if (timePeriod === "1M") {
      data = [
        { name: 'Week 1', value: 60 },
        { name: 'Week 2', value: 70 },
        { name: 'Week 3', value: 65 },
        { name: 'Week 4', value: 80 },
      ];
    } else if (timePeriod === "6M") {
      data = [
        { name: 'Month 1', value: 300 },
        { name: 'Month 2', value: 320 },
        { name: 'Month 3', value: 310 },
        { name: 'Month 4', value: 350 },
        { name: 'Month 5', value: 340 },
        { name: 'Month 6', value: 380 },
      ];
    } else if (timePeriod === "1Y") {
      data = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 420 },
        { name: 'Mar', value: 410 },
        { name: 'Apr', value: 450 },
        { name: 'May', value: 440 },
        { name: 'Jun', value: 480 },
        { name: 'Jul', value: 470 },
        { name: 'Aug', value: 500 },
        { name: 'Sep', value: 490 },
        { name: 'Oct', value: 520 },
        { name: 'Nov', value: 510 },
        { name: 'Dec', value: 550 },
      ];
    } else if (timePeriod === "All") {
      data = [
        { name: '2022', value: 3000 },
        { name: '2023', value: 3500 },
        { name: '2024', value: 4000 },
        { name: '2025', value: 4500 },
      ];
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching historical costs:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
