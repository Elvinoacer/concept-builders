import CustomDesignForm from "@/components/custom-design/CustomDesignForm";
import CustomDesignHeader from "@/components/custom-design/CustomDesignHeader";
import { Card, CardContent } from "@/components/ui/card";

const CustomDesignPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-10 xl:py-12 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
        <Card className="w-full mx-auto bg-transparent shadow-none border-0 sm:border sm:shadow-sm md:shadow-md">
          <CustomDesignHeader />
          <CardContent className="px-2 sm:px-4 md:px-6 lg:px-8">
            <CustomDesignForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomDesignPage;
