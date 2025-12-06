import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-xl">Page Not Found</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link href="/">
            <Button className="w-full" data-testid="button-back-home">
              <Home className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
