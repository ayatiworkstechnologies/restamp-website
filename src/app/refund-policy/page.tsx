import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Restamp',
  description: 'When Restamp plan payments can be refunded, how to cancel a plan, and how long refunds take.',
};

// DRAFT: review with a legal advisor before publishing.
export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund & Cancellation Policy"
      updated="19 November 2026"
      intro={
        <p>
          This policy explains how cancellations and refunds work for paid plans on Restamp, such as owner listing plans and dealer locality packages. Searching for
          properties and contacting owners as a buyer or tenant is free, so no payment or refund applies to it.
        </p>
      }
      sections={[
        {
          id: 'paid',
          title: 'What you pay for',
          body: (
            <>
              <p>Owners and dealers can buy plans that unlock features for a fixed validity period, for example a number of listings, premium placement or locality leads. Each plan&apos;s price, benefits and validity are shown on the plan page and at checkout, including applicable GST.</p>
              <p>A plan starts as soon as the payment is confirmed by our payment partner.</p>
            </>
          ),
        },
        {
          id: 'cancel',
          title: 'Cancelling a plan',
          body: (
            <ul>
              <li>You can stop using a plan at any time. Plans do not renew automatically, so nothing more is charged after the validity ends.</li>
              <li>If you cancel during the validity period, the plan stays active until its end date unless you ask us to end it immediately.</li>
              <li>Unused days, listings or leads are not refunded or carried over, except in the cases listed below.</li>
              <li>Restamp may cancel a plan without a refund if the account breaks our <Link href="/terms">Terms and Conditions</Link>, for example by posting fake or misleading listings.</li>
            </ul>
          ),
        },
        {
          id: 'eligible',
          title: 'When we refund',
          body: (
            <>
              <p>Plan fees are non-refundable once the plan is active. We will refund you in full when:</p>
              <ul>
                <li>You were charged more than once for the same order.</li>
                <li>Money was debited but the payment failed, or the plan was never activated on your account.</li>
                <li>A technical fault on our side stopped you from using the plan and we could not fix it within 7 days of your complaint.</li>
                <li>Restamp withdraws or discontinues a plan you paid for before its validity ends (refunded for the unused period).</li>
              </ul>
              <p>Refunds may also be given where the law requires it.</p>
            </>
          ),
        },
        {
          id: 'request',
          title: 'How to request a refund',
          body: (
            <>
              <p>
                Email <a href="mailto:support@restamp.in">support@restamp.in</a> or use our <Link href="/contact">Contact page</Link> within <strong>7 days</strong> of the payment, with:
              </p>
              <ul>
                <li>The mobile number on your Restamp account.</li>
                <li>The invoice number or transaction ID (shown in your dashboard under Payments).</li>
                <li>A short description of the problem, with a screenshot if possible.</li>
              </ul>
              <p>We reply within 2 working days and tell you whether the refund is approved.</p>
            </>
          ),
        },
        {
          id: 'timeline',
          title: 'How long refunds take',
          body: (
            <ul>
              <li>Approved refunds are sent to the original payment method (card, UPI, net banking or wallet) within 5–7 working days.</li>
              <li>Your bank or payment provider may take a few more days to show the money in your account.</li>
              <li>Failed or auto-reversed payments are usually returned by the bank automatically within 7 working days.</li>
            </ul>
          ),
        },
        {
          id: 'gst',
          title: 'Invoices and GST',
          body: <p>When a refund is approved, we issue a credit note against the original invoice. Any GST charged is refunded along with the plan amount.</p>,
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          body: <p>We may update this policy from time to time. The version on this page at the time of your payment applies to that payment.</p>,
        },
      ]}
    />
  );
}
