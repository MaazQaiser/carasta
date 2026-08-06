"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Lock, ShoppingBag } from "lucide-react";
import type { Order, PaymentMethodId, ShippingMethodId } from "@carasta/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckoutProgress,
  OrderSession,
  OrderSummaryCard,
  SHIPPING_METHODS,
  computeTotals,
  parseVariantDetails,
} from "@/components/merch";
import { OrderPlacedBanner } from "@/components/merch/OrderPlacedBanner";
import {
  NotificationProvider,
  useListingNotifications,
} from "@/components/listing/notifications/NotificationProvider";
import { cn, formatPrice } from "@/lib/utils";
import { useCart, unitPrice } from "@/lib/context/cart-context";

type FieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "country"
  | "street"
  | "city"
  | "state"
  | "postalCode"
  | "cardNumber"
  | "cardName"
  | "cardExpiry"
  | "cardCvc";

const PAYMENT_OPTIONS: {
  id: PaymentMethodId;
  label: string;
  placeholder?: boolean;
}[] = [
  { id: "credit", label: "Credit Card" },
  { id: "debit", label: "Debit Card" },
  { id: "apple-pay", label: "Apple Pay", placeholder: true },
  { id: "google-pay", label: "Google Pay", placeholder: true },
];

function CheckoutView() {
  const router = useRouter();
  const { items, clear } = useCart();
  const { notify } = useListingNotifications();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [billingSame, setBillingSame] = useState(true);

  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [lastOrder, setLastOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem("carasta.merch.discount");
    const parsed = raw ? Number(raw) : 0;
    setDiscount(Number.isFinite(parsed) ? parsed : 0);
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      setLastOrder(null);
      return;
    }
    setLastOrder(OrderSession.load());
  }, [items.length]);

  const totals = useMemo(
    () => computeTotals(items, shippingMethod, discount),
    [items, shippingMethod, discount]
  );

  const fieldErrors = useMemo(() => {
    const errors: Partial<Record<FieldKey, string>> = {};
    if (!firstName.trim()) errors.firstName = "First name is required.";
    if (!lastName.trim()) errors.lastName = "Last name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!phone.trim()) errors.phone = "Phone number is required.";
    else if (phone.replace(/\D/g, "").length < 7) {
      errors.phone = "Enter a valid phone number.";
    }
    if (!country.trim()) errors.country = "Country is required.";
    if (!street.trim()) errors.street = "Street address is required.";
    if (!city.trim()) errors.city = "City is required.";
    if (!state.trim()) errors.state = "State is required.";
    if (!postalCode.trim()) errors.postalCode = "Postal code is required.";

    if (paymentMethod === "credit" || paymentMethod === "debit") {
      if (cardNumber.replace(/\s/g, "").length < 12) {
        errors.cardNumber = "Enter a valid card number.";
      }
      if (!cardName.trim()) errors.cardName = "Cardholder name is required.";
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) {
        errors.cardExpiry = "Enter expiry as MM/YY.";
      }
      if (cardCvc.trim().length < 3) errors.cardCvc = "CVV is required.";
    }
    return errors;
  }, [
    firstName,
    lastName,
    email,
    phone,
    country,
    street,
    city,
    state,
    postalCode,
    paymentMethod,
    cardNumber,
    cardName,
    cardExpiry,
    cardCvc,
  ]);

  const paymentPlaceholder =
    paymentMethod === "apple-pay" || paymentMethod === "google-pay";

  const isValid = Object.keys(fieldErrors).length === 0 && !paymentPlaceholder;

  const showError = (key: FieldKey) =>
    Boolean((touched[key] || submitAttempted) && fieldErrors[key]);

  const markTouched = (key: FieldKey) =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const placeOrder = async () => {
    setSubmitAttempted(true);
    if (!isValid) {
      notify({
        title: "Complete required fields",
        description: paymentPlaceholder
          ? "Apple Pay and Google Pay are placeholders — choose Credit or Debit."
          : "Please fix the highlighted fields before placing your order.",
        tone: "error",
      });
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const order = OrderSession.placeOrder({
      items,
      address: {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        street: street.trim(),
        apartment: apartment.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      },
      shippingMethod,
      paymentMethod,
      discount,
    });

    clear();
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("carasta.merch.discount");
      window.sessionStorage.removeItem("carasta.merch.promo");
    }
    setSubmitting(false);
    notify({
      title: "Order placed",
      description: `Confirmation ${order.id}`,
      tone: "success",
    });
    router.push(`/shop/order/success?order=${encodeURIComponent(order.id)}`);
  };

  if (items.length === 0) {
    if (lastOrder === undefined) {
      return (
        <div className="mx-auto max-w-lg px-4 py-24 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      );
    }
    if (lastOrder) {
      return <OrderPlacedBanner order={lastOrder} />;
    }
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Add items from the Merch Store before checking out.
        </p>
        <Button variant="bid" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const selectedShipping = SHIPPING_METHODS.find((m) => m.id === shippingMethod);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8 pb-28 lg:pb-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Merch
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link href="/shop/cart" className="hover:text-foreground transition-colors">
              Cart
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="text-foreground font-medium">Checkout</li>
        </ol>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-bold mb-6">Checkout</h1>
      <CheckoutProgress current="checkout" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <section className="rounded-2xl border bg-card p-5 sm:p-6 space-y-4">
            <h2 className="font-semibold text-lg">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="first-name"
                label="First Name"
                error={showError("firstName") ? fieldErrors.firstName : undefined}
              >
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => markTouched("firstName")}
                  className={cn(showError("firstName") && "border-destructive")}
                  autoComplete="given-name"
                />
              </Field>
              <Field
                id="last-name"
                label="Last Name"
                error={showError("lastName") ? fieldErrors.lastName : undefined}
              >
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => markTouched("lastName")}
                  className={cn(showError("lastName") && "border-destructive")}
                  autoComplete="family-name"
                />
              </Field>
              <Field
                id="email"
                label="Email Address"
                error={showError("email") ? fieldErrors.email : undefined}
              >
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched("email")}
                  className={cn(showError("email") && "border-destructive")}
                  autoComplete="email"
                  placeholder="you@email.com"
                />
              </Field>
              <Field
                id="phone"
                label="Phone Number"
                error={showError("phone") ? fieldErrors.phone : undefined}
              >
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => markTouched("phone")}
                  className={cn(showError("phone") && "border-destructive")}
                  autoComplete="tel"
                  placeholder="(555) 000-0000"
                />
              </Field>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="rounded-2xl border bg-card p-5 sm:p-6 space-y-4">
            <h2 className="font-semibold text-lg">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field
                  id="country"
                  label="Country"
                  error={showError("country") ? fieldErrors.country : undefined}
                >
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    onBlur={() => markTouched("country")}
                    className={cn(showError("country") && "border-destructive")}
                    autoComplete="country-name"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field
                  id="street"
                  label="Street Address"
                  error={showError("street") ? fieldErrors.street : undefined}
                >
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    onBlur={() => markTouched("street")}
                    className={cn(showError("street") && "border-destructive")}
                    autoComplete="street-address"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="apartment" label="Apartment / Suite">
                  <Input
                    id="apartment"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Optional"
                    autoComplete="address-line2"
                  />
                </Field>
              </div>
              <Field
                id="city"
                label="City"
                error={showError("city") ? fieldErrors.city : undefined}
              >
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={() => markTouched("city")}
                  className={cn(showError("city") && "border-destructive")}
                  autoComplete="address-level2"
                />
              </Field>
              <Field
                id="state"
                label="State"
                error={showError("state") ? fieldErrors.state : undefined}
              >
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  onBlur={() => markTouched("state")}
                  className={cn(showError("state") && "border-destructive")}
                  autoComplete="address-level1"
                />
              </Field>
              <Field
                id="postal"
                label="Postal Code"
                error={showError("postalCode") ? fieldErrors.postalCode : undefined}
              >
                <Input
                  id="postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  onBlur={() => markTouched("postalCode")}
                  className={cn(showError("postalCode") && "border-destructive")}
                  autoComplete="postal-code"
                />
              </Field>
            </div>
            <label className="flex items-start gap-2.5 text-sm cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={billingSame}
                onChange={(e) => setBillingSame(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-input"
              />
              <span>Billing address same as shipping.</span>
            </label>
          </section>

          {/* Shipping Method */}
          <section className="rounded-2xl border bg-card p-5 sm:p-6 space-y-4">
            <h2 className="font-semibold text-lg">Shipping Method</h2>
            <div className="space-y-3" role="radiogroup" aria-label="Shipping method">
              {SHIPPING_METHODS.map((method) => {
                const active = shippingMethod === method.id;
                const cost =
                  method.id === "standard" && totals.subtotal >= 100
                    ? "Free"
                    : formatPrice(method.price);
                return (
                  <button
                    key={method.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setShippingMethod(method.id)}
                    className={cn(
                      "w-full text-left rounded-xl border p-4 transition-colors",
                      active ? "border-primary bg-primary/5" : "hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{method.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Estimated delivery: {method.eta}
                        </p>
                      </div>
                      <span className="text-sm font-semibold shrink-0">{cost}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedShipping ? (
              <p className="text-xs text-muted-foreground">
                {selectedShipping.description}
                {shippingMethod === "standard" && totals.subtotal >= 100
                  ? " Free on orders $100+."
                  : ""}
              </p>
            ) : null}
          </section>

          {/* Payment */}
          <section className="rounded-2xl border bg-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-lg">Payment</h2>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Your payment details are encrypted and secure
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_OPTIONS.map((option) => {
                const active = paymentMethod === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={cn(
                      "px-3.5 py-2 rounded-full text-sm font-medium border transition-colors",
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {option.label}
                    {option.placeholder ? (
                      <Badge variant="outline" className="ml-1.5 text-[10px] border-current">
                        Soon
                      </Badge>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {(paymentMethod === "credit" || paymentMethod === "debit") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="sm:col-span-2">
                  <Field
                    id="card-number"
                    label="Card Number"
                    error={showError("cardNumber") ? fieldErrors.cardNumber : undefined}
                  >
                    <Input
                      id="card-number"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      onBlur={() => markTouched("cardNumber")}
                      className={cn(showError("cardNumber") && "border-destructive")}
                      autoComplete="cc-number"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field
                    id="card-name"
                    label="Cardholder Name"
                    error={showError("cardName") ? fieldErrors.cardName : undefined}
                  >
                    <Input
                      id="card-name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      onBlur={() => markTouched("cardName")}
                      className={cn(showError("cardName") && "border-destructive")}
                      autoComplete="cc-name"
                    />
                  </Field>
                </div>
                <Field
                  id="card-expiry"
                  label="Expiry Date"
                  error={showError("cardExpiry") ? fieldErrors.cardExpiry : undefined}
                >
                  <Input
                    id="card-expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    onBlur={() => markTouched("cardExpiry")}
                    className={cn(showError("cardExpiry") && "border-destructive")}
                    autoComplete="cc-exp"
                  />
                </Field>
                <Field
                  id="card-cvc"
                  label="CVV"
                  error={showError("cardCvc") ? fieldErrors.cardCvc : undefined}
                >
                  <Input
                    id="card-cvc"
                    inputMode="numeric"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    onBlur={() => markTouched("cardCvc")}
                    className={cn(showError("cardCvc") && "border-destructive")}
                    autoComplete="cc-csc"
                  />
                </Field>
              </div>
            )}

            {paymentPlaceholder ? (
              <p className="text-sm text-muted-foreground">
                {PAYMENT_OPTIONS.find((p) => p.id === paymentMethod)?.label} is a placeholder.
                Select Credit Card or Debit Card to continue.
              </p>
            ) : null}
          </section>

          {/* Order Review */}
          <section className="rounded-2xl border bg-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-lg">Order Review</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/shop/cart">Return to Cart</Link>
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => {
                const price = unitPrice(item.product, item.variant);
                const details = parseVariantDetails(item.variant);
                const image = item.product.images[0];
                return (
                  <div
                    key={`review-${item.product.id}-${item.variant?.id ?? "default"}`}
                    className="flex gap-3 p-3 rounded-xl border bg-background"
                  >
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.product.name}</p>
                      {details.label ? (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {details.label}
                        </p>
                      ) : null}
                      <p className="text-xs text-muted-foreground mt-1">
                        Qty {item.quantity} · {formatPrice(price)} each
                      </p>
                    </div>
                    <p className="text-sm font-bold shrink-0">
                      {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <SummaryRow label="Subtotal" value={formatPrice(totals.subtotal)} />
              <SummaryRow
                label="Shipping"
                value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
              />
              <SummaryRow label="Tax" value={formatPrice(totals.tax)} />
              <SummaryRow
                label="Discount"
                value={
                  totals.discount > 0
                    ? `−${formatPrice(totals.discount)}`
                    : formatPrice(0)
                }
              />
              <div className="flex justify-between font-semibold text-base pt-1">
                <span>Grand Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
          </section>
        </div>

        <OrderSummaryCard
          totals={totals}
          primaryLabel={submitting ? "Placing order…" : "Place Order"}
          onPrimary={() => void placeOrder()}
          primaryDisabled={submitting || !isValid}
          secondaryLabel="Back to Cart"
          secondaryHref="/shop/cart"
          totalLabel="Estimated Total"
          taxLabel="Tax"
          footerNote="Secure checkout — no real payment is processed in this preview."
        >
          {!billingSame ? (
            <p className="text-[11px] text-muted-foreground">
              Separate billing address can be collected after payment setup.
            </p>
          ) : null}
        </OrderSummaryCard>
      </div>

      {/* Mobile sticky Place Order */}
      <div className="fixed inset-x-0 bottom-16 z-40 border-t bg-background/95 backdrop-blur px-4 py-3 lg:hidden">
        <div className="mx-auto max-w-screen-2xl flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-muted-foreground">Estimated Total</p>
            <p className="text-sm font-bold tabular-nums">{formatPrice(totals.total)}</p>
          </div>
          <Button
            variant="bid"
            className="shrink-0"
            disabled={submitting || !isValid}
            onClick={() => void placeOrder()}
          >
            {submitting ? "Placing…" : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CheckoutClient() {
  return (
    <NotificationProvider>
      <CheckoutView />
    </NotificationProvider>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium mb-1.5 block">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-destructive mt-1.5">{error}</p> : null}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
