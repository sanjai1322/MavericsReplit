import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Bot, ExternalLink, CheckCircle } from "lucide-react";

interface AISetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AISetupModal({ open, onOpenChange }: AISetupModalProps) {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const { data: aiStatus } = useQuery({
    queryKey: ["/api/ai/status"],
    enabled: open,
  });

  const updateKeyMutation = useMutation({
    mutationFn: async (key: string) => {
      const response = await apiRequest("POST", "/api/ai/update-key", { apiKey: key });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/status"] });
      toast({
        title: "Success!",
        description: "AI service is now configured and ready to use.",
      });
      onOpenChange(false);
      setApiKey("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to configure AI service. Please check your API key.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your API key.",
        variant: "destructive",
      });
      return;
    }
    updateKeyMutation.mutate(apiKey.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[var(--space-800)] border-[var(--space-600)]">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-xl flex items-center">
            <Bot className="w-6 h-6 mr-2 text-[var(--neon-green)]" />
            Setup AI Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {aiStatus?.configured ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-[var(--neon-green)] mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">AI Service Configured</h3>
              <p className="text-gray-300 text-sm">
                Using: {aiStatus.service}
              </p>
              <p className="text-[var(--neon-green)] text-sm mt-2">
                Your AI assistant is ready to help!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold">Configure Qwen AI Service</h3>
                <p className="text-gray-300 text-sm">
                  To enable AI features, you need to provide your Qwen API key from Together AI.
                </p>
                
                <div className="bg-[var(--space-700)] p-4 rounded-lg border border-[var(--space-600)]">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Key className="w-4 h-4 mr-2" />
                    How to get your API key:
                  </h4>
                  <ol className="text-sm text-gray-300 space-y-1 ml-6 list-decimal">
                    <li>Visit <a href="https://api.together.xyz" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-blue)] hover:underline inline-flex items-center">api.together.xyz <ExternalLink className="w-3 h-3 ml-1" /></a></li>
                    <li>Sign up or log in to your account</li>
                    <li>Navigate to API Keys section</li>
                    <li>Create a new API key</li>
                    <li>Copy and paste it below</li>
                  </ol>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Together AI API key"
                    className="bg-[var(--space-700)] border-[var(--space-600)]"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateKeyMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 text-[var(--space-900)]"
                  >
                    {updateKeyMutation.isPending ? "Configuring..." : "Configure AI"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}