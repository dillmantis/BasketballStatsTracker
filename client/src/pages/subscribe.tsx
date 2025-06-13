import { useEffect, useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, X } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You are subscribed!",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" disabled={!stripe} className="w-full bg-blue-600 hover:bg-blue-700">
        Subscribe
      </Button>
    </form>
  );
};

function SubscribeContent() {
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      // Create subscription as soon as the page loads
      apiRequest("POST", "/api/get-or-create-subscription")
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to initialize subscription. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [isAuthenticated, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-black text-gray-800 mb-4">Subscription Setup Required</h1>
            <p className="text-xl text-gray-600 mb-8">
              Payment processing is not yet configured. Please contact support to enable subscriptions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading subscription details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 mb-4">Upgrade to Pro</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock premium features and take your fantasy game to the next level
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pro Plan Features</span>
                <Badge className="bg-blue-600 text-white">MOST POPULAR</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-blue-600 mb-2">$19<span className="text-lg font-normal text-gray-600">/month</span></div>
                <p className="text-gray-600">For serious fantasy players</p>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Unlimited Fantasy Leagues</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Advanced Player Analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Real-time Notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Injury Reports & News</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Trade Analyzer</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Priority Customer Support</span>
                </li>
              </ul>

              <div className="border-t pt-4 mt-6">
                <h4 className="font-semibold mb-2">Free Plan Limitations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                    <span>Limited to 1 fantasy league</span>
                  </li>
                  <li className="flex items-center">
                    <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                    <span>Basic stats only</span>
                  </li>
                  <li className="flex items-center">
                    <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                    <span>No advanced analytics</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm />
              </Elements>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your subscription will automatically renew monthly. 
                  You can cancel anytime from your account settings.
                </p>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Secure payment processing powered by Stripe. 
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function Subscribe() {
  return <SubscribeContent />;
}
