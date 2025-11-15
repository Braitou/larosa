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
import { Truck, Car, LogIn } from "lucide-react";
import { formatPlaque } from "@/lib/utils";

interface TemporaryReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleType: "lourd" | "leger";
  clientName: string;
  plaque: string;
  expectedCode: string;
  onValidate: (code: string) => Promise<void>;
}

export function TemporaryReturnDialog({
  open,
  onOpenChange,
  vehicleType,
  clientName,
  plaque,
  expectedCode,
  onValidate,
}: TemporaryReturnDialogProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Vérifier que le code correspond
    if (code !== expectedCode) {
      setError("Code incorrect");
      return;
    }

    setLoading(true);
    try {
      await onValidate(code);
      setCode("");
      onOpenChange(false);
    } catch (err) {
      setError("Erreur lors de la validation");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-green-600" />
            Retour au parking
          </DialogTitle>
          <DialogDescription>
            Le véhicule revient sur le parking après une sortie temporaire
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Infos véhicule */}
          <div className="p-3 bg-background-card rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              {vehicleType === "lourd" ? (
                <Truck className="w-5 h-5 text-text-secondary" />
              ) : (
                <Car className="w-5 h-5 text-text-secondary" />
              )}
              <span className="font-semibold">
                Véhicule {vehicleType === "lourd" ? "lourd" : "léger"}
              </span>
            </div>
            <div className="text-sm text-text-secondary">
              <p>Client : {clientName}</p>
              <p className="font-mono">Plaque : {formatPlaque(plaque)}</p>
            </div>
          </div>

          {/* Input code */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code de confirmation</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl tracking-wider font-mono"
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={code.length !== 6 || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? "Validation..." : "Valider le retour"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

