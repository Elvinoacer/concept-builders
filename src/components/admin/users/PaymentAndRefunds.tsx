
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentAndRefunds = ({ user }) => {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle>Payment & Refunds</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Payment and refunds information for {user.name}.</p>
      </CardContent>
    </Card>
  );
};

export default PaymentAndRefunds;
