import { getStripeServer } from "@/lib/stripe/server";

/** Create a Stripe Connect Express account for a contractor */
export async function createConnectAccount(
  contractorEmail: string,
  businessName: string,
  country: string = "CA"
) {
  const stripe = getStripeServer();
  const account = await stripe.accounts.create({
    type: "express",
    country,
    email: contractorEmail,
    business_type: "individual",
    capabilities: {
      transfers: { requested: true },
    },
    business_profile: {
      name: businessName,
      mcc: "7349", // Building maintenance services
    },
  });
  return account;
}

/** Generate an onboarding link for the contractor to complete Stripe setup */
export async function createAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
) {
  const stripe = getStripeServer();
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });
  return link;
}

/** Check if a Connect account has completed onboarding */
export async function getAccountStatus(accountId: string) {
  const stripe = getStripeServer();
  const account = await stripe.accounts.retrieve(accountId);
  return {
    id: account.id,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
    requirements: account.requirements,
  };
}

/** Create a transfer (payout) to a contractor's Connect account */
export async function createTransfer(
  amount: number, // in cents
  destinationAccountId: string,
  description: string,
  metadata?: Record<string, string>
) {
  const stripe = getStripeServer();
  const transfer = await stripe.transfers.create({
    amount,
    currency: "cad",
    destination: destinationAccountId,
    description,
    metadata,
  });
  return transfer;
}

/** Get transfer history for a Connect account */
export async function getTransfers(
  destinationAccountId: string,
  limit: number = 20
) {
  const stripe = getStripeServer();
  const transfers = await stripe.transfers.list({
    destination: destinationAccountId,
    limit,
  });
  return transfers.data;
}

/** Create a login link for the contractor to access their Stripe Express dashboard */
export async function createDashboardLink(accountId: string) {
  const stripe = getStripeServer();
  const link = await stripe.accounts.createLoginLink(accountId);
  return link;
}
