import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const digitalOceanApiKey = process.env.DIGITALOCEAN_API_KEY;

    if (!digitalOceanApiKey) {
      return new NextResponse('DigitalOcean API Key not configured.', { status: 500 });
    }

    // Fetch Billing History
    const billingHistoryResponse = await fetch('https://api.digitalocean.com/v2/customers/my/billing_history', {
      headers: {
        'Authorization': `Bearer ${digitalOceanApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!billingHistoryResponse.ok) {
      const errorData = await billingHistoryResponse.json();
      console.error('Error fetching DigitalOcean billing history:', errorData);
      return new NextResponse(`Error fetching billing history: ${errorData.message || billingHistoryResponse.statusText}`, { status: billingHistoryResponse.status });
    }

    const billingHistory = await billingHistoryResponse.json();
    let totalUsage = 0;
    // Assuming billing_history items have a 'amount' field for cost
    billingHistory.billing_history.forEach((item: any) => {
      totalUsage += parseFloat(item.amount);
    });

    // Fetch Account Information for Spaces Usage
    const accountResponse = await fetch('https://api.digitalocean.com/v2/account', {
      headers: {
        'Authorization': `Bearer ${digitalOceanApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!accountResponse.ok) {
      const errorData = await accountResponse.json();
      console.error('Error fetching DigitalOcean account info:', errorData);
      return new NextResponse(`Error fetching account info: ${errorData.message || accountResponse.statusText}`, { status: accountResponse.status });
    }

    const accountInfo = await accountResponse.json();
    // DigitalOcean API does not directly provide 'storageUsedGB' in /v2/account
    // This would typically be part of a more detailed billing or usage report,
    // or calculated from individual Spaces object sizes. 
    // For now, we'll use a placeholder or assume it's part of the billing breakdown if available.
    // If not directly available, a more complex solution involving listing spaces and summing object sizes would be needed.
    const storageUsedGB = accountInfo.account.spaces_usage_bytes ? accountInfo.account.spaces_usage_bytes / (1024 * 1024 * 1024) : 0;
    const bandwidthUsedGB = accountInfo.account.bandwidth_usage_bytes ? accountInfo.account.bandwidth_usage_bytes / (1024 * 1024 * 1024) : 0;


    const digitalOceanCosts = {
      totalUsage: totalUsage,
      storageUsedGB: storageUsedGB.toFixed(2),
      bandwidthUsedGB: bandwidthUsedGB.toFixed(2),
    };

    return NextResponse.json(digitalOceanCosts);
  } catch (error) {
    console.error('Error fetching DigitalOcean costs:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
