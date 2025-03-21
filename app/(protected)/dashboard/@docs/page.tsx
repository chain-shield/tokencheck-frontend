import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function DocsPage() {
    return (
        <Card className="p-6 bg-secondary/50">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="font-semibold mb-2">API Documentation</h3>
              <p className="text-muted-foreground mb-4">
                For developers interested in building applications using our API Service, please refer to our comprehensive documentation.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                View Documentation
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
    )
}