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
import type { Vehicle } from "@/types/database.types";

interface ValidateArrivalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleType: "lourd" | "leger";
  clientName: string;
  onValidate: (code: string, plaque: string) => Promise<void>;
}

export function ValidateArrivalDialog({
  open,
  onOpenChange,
  vehicleType,
  clientName,
  onValidate,
}: ValidateArrivalDialogProps) {
  const [code, setCode] = useState("");
  const [plaque, setPlaque] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || !plaque.trim()) return;

    setIsValidating(true);
    try {
      await onValidate(code, plaque);
      setCode("");
      setPlaque("");
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
            Validation d'arrivée
          </DialogTitle>
          <DialogDescription>
            Client : <strong>{clientName}</strong> - Véhicule {vehicleType}
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plaque">Plaque d'immatriculation</Label>
            <Input
              id="plaque"
              value={plaque}
              onChange={(e) => setPlaque(e.target.value.toUpperCase())}
              placeholder="AB-123-CD"
              className="text-lg text-center uppercase"
              required
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
              disabled={code.length !== 6 || !plaque.trim() || isValidating}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {isValidating ? "Validation..." : "Valider l'arrivée"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}




