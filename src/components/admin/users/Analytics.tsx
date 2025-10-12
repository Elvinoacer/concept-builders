
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = ({ user }) => {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Analytics information for {user.name}.</p>
      </CardContent>
    </Card>
  );
};

export default Analytics;
