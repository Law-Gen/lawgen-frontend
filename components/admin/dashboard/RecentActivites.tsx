import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowUp, ClipboardList, FileText, Info } from "lucide-react";

export default function RecentActivites() {
  return (
    <div>
      {/* Pinned Activities */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Pinned Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 px-4 border-border hover:bg-accent"
          >
            <Users className="w-4 h-4" />
            <span className="text-card-foreground">Manage Users</span>
            <ArrowUp className="w-4 h-4 ml-auto rotate-90 text-muted-foreground" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 px-4 border-border hover:bg-accent"
          >
            <ClipboardList className="w-4 h-4" />
            <span className="text-card-foreground">Create New Quiz</span>
            <ArrowUp className="w-4 h-4 ml-auto rotate-90 text-muted-foreground" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 px-4 border-border hover:bg-accent"
          >
            <FileText className="w-4 h-4" />
            <span className="text-card-foreground">Upload Legal Document</span>
            <ArrowUp className="w-4 h-4 ml-auto rotate-90 text-muted-foreground" />
          </Button>
          {/* Pro Tip */}
          <div className="bg-chart-4/10 border border-chart-4/20 rounded-lg p-4 mt-2">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-chart-4">Pro Tip</p>
                <p className="text-xs text-chart-4/80 mt-1">
                  Pin your most used actions for quick access. You can customize
                  this list in settings.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
