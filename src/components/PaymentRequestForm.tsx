import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CyberButton } from "./CyberButton";

interface PaymentRequestFormProps {
  onSubmitRequest: (request: PaymentRequest) => void;
}

interface PaymentRequest {
  amount: string;
  currency: string;
  description: string;
  method: string;
}

export const PaymentRequestForm = ({ onSubmitRequest }: PaymentRequestFormProps) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRequest({
      amount,
      currency,
      description,
      method,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/90 backdrop-blur-sm border-accent/30 cyber-glow">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center cyber-text uppercase tracking-wider">
          Payment Request Portal
        </CardTitle>
        <p className="text-center text-accent">Submit your payment request for approval</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-accent uppercase tracking-wide">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-muted border-accent/30 focus:border-accent cyber-glow"
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-accent uppercase tracking-wide">
                Currency
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-muted border-accent/30 focus:border-accent cyber-glow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-accent/30">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method" className="text-accent uppercase tracking-wide">
              Payment Method
            </Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="bg-muted border-accent/30 focus:border-accent cyber-glow">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className="bg-card border-accent/30">
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-accent uppercase tracking-wide">
              Request Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted border-accent/30 focus:border-accent cyber-glow min-h-[120px]"
              placeholder="Describe your payment request details..."
              required
            />
          </div>

          <CyberButton type="submit" className="w-full">
            Submit Payment Request
          </CyberButton>
        </form>
      </CardContent>
    </Card>
  );
};