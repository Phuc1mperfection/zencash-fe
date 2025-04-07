import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Budget = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Budget</h2>
        <p className="text-muted-foreground">
          Manage your budget and track your spending
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget</CardTitle>
            <CardDescription>Your budget for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,500</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spent</CardTitle>
            <CardDescription>Amount spent this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200</div>
            <p className="text-xs text-muted-foreground">48% of your budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Remaining</CardTitle>
            <CardDescription>Amount left to spend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,300</div>
            <p className="text-xs text-muted-foreground">52% of your budget</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Budget;
