
import CustomDesignForm from "@/components/custom-design/CustomDesignForm";
import CustomDesignHeader from "@/components/custom-design/CustomDesignHeader";
import { Card, CardContent } from "@/components/ui/card";

const CustomDesignPage = () => {
  return (
    <div className="flex-1 bg-gray-50 p-10 dark:bg-gray-900">
      <Card className="max-w-4xl mx-auto bg-transparent shadow-none">
        <CustomDesignHeader />
        <CardContent>
          <CustomDesignForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomDesignPage;
