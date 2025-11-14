"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Car, CheckCircle2 } from "lucide-react";

interface ValidateDepartureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleType: "lourd" | "leger";
  clientName: string;
  plaque: string;
  expectedCode: string;
  onValidate: (code: string) => Promise<void>;
}

export function ValidateDepartureDialog({
  open,
  onOpenChange,
  vehicleType,
  clientName,
  plaque,
  expectedCode,
  onValidate,
}: ValidateDepartureDialogProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsValidating(true);
    try {
      await onValidate(code);
      setCode("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {vehicleType === "lourd" ? (
              <Truck className="w-5 h-5 text-blue-primary" />
            ) : (
              <Car className="w-5 h-5 text-blue-primary" />
            )}
            Validation de départ
          </DialogTitle>
          <DialogDescription>
            Client : <strong>{clientName}</strong>
            <br />
            Plaque : <strong>{plaque}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code de confirmation (6 chiffres)</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="text-xl font-mono text-center"
              required
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={code.length !== 6 || isValidating}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {isValidating ? "Validation..." : "Valider le départ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}




