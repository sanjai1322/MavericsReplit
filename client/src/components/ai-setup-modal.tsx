import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, CheckCircle } from "lucide-react";

interface AISetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AIStatus {
  configured: boolean;
  service: string;
  message: string;
}

export default function AISetupModal({ open, onOpenChange }: AISetupModalProps) {
  const { data: aiStatus } = useQuery<AIStatus>({
    queryKey: ["/api/ai/status"],
    enabled: open,
  });

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
            <div className="text-center py-4">
              <Bot className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">AI Service Status</h3>
              <p className="text-gray-300 mb-2">
                Service: {aiStatus?.service || 'Qwen/Qwen2.5-Coder-32B-Instruct'}
              </p>
              <p className="text-yellow-500 text-sm">
                {aiStatus?.message || 'AI service is being configured...'}
              </p>
            </div>
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 text-[var(--space-900)]"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}