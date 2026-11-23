import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/legal/LegalPage';
import { LEGAL } from '@/lib/legal-entity';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Restamp',
  description:
    'The terms that govern your use of the Restamp website and the Restamp mobile apps for iOS and Android, including listings, plans, payments and acceptable use.',
};

const mail = (subject?: string) => (
  <a href={`mailto:${LEGAL.supportEmail}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`}>{LEGAL.supportEmail}</a>
);

// Legal content: have it reviewed by a qualified legal advisor before each release.
export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and Conditions"
      updated="21 November 2026"
      intro={
        <>
          <p>
            These Terms and Conditions (&ldquo;Terms&rdquo;) form a legally binding agreement between you and {LEGAL.legalName}
            (&ldquo;{LEGAL.brand}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;). They govern your access to and use of the
            website at {LEGAL.website}, the {LEGAL.brand} mobile applications for iOS and Android, and all related features, content
            and services (together, the &ldquo;Platform&rdquo;).
          </p>
          <p>
            By creating an account, signing in, posting a listing, purchasing a plan or otherwise using the Platform, you confirm that you
            have read, understood and agree to these Terms and to our <Link href="/privacy-policy">Privacy Policy</Link> and{' '}
            <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>, which form part of these Terms. If you do not agree, please
            do not use the Platform.
          </p>
          <p>
            These Terms are an electronic record under the Information Technology Act, 2000 and the rules made under it, and are published
            in accordance with Rule 3(1) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
          </p>
        </>
      }
      sections={[
        {
          id: 'definitions',
          title: '1. Definitions',
          body: (
            <ul>
              <li><strong>&ldquo;User&rdquo;</strong> or <strong>&ldquo;you&rdquo;</strong> means any person who accesses or uses the Platform, whether or not registered.</li>
              <li><strong>&ldquo;Buyer&rdquo;</strong> means a User looking to buy, rent or lease property, including tenants and lessees.</li>
              <li><strong>&ldquo;Owner&rdquo;</strong> means a User who owns a property, or is lawfully authorised by the owner, and lists it on the Platform.</li>
              <li><strong>&ldquo;Dealer&rdquo;</strong> means a real estate agent, broker or agency using the Platform to post properties for clients and respond to enquiries.</li>
              <li><strong>&ldquo;Listing&rdquo;</strong> means any property advertisement, including its description, price, photos, documents and other details.</li>
              <li><strong>&ldquo;Plan&rdquo;</strong> means any paid or free subscription, package or service offered on the Platform.</li>
              <li><strong>&ldquo;Content&rdquo;</strong> means any text, images, video, documents, data or other material on the Platform.</li>
            </ul>
          ),
        },
        {
          id: 'about',
          title: '2. About the Platform and our role',
          body: (
            <>
              <p>
                {LEGAL.brand} is an online real estate marketplace that helps Buyers discover properties for sale, resale, rent and lease,
                and helps Owners and Dealers advertise properties and receive enquiries.
              </p>
              <p>
                {LEGAL.brand} acts as an <strong>intermediary</strong> within the meaning of Section 2(1)(w) of the Information Technology
                Act, 2000. We provide the technology that lets Users publish and find Listings. Unless we expressly agree otherwise in
                writing, {LEGAL.brand}:
              </p>
              <ul>
                <li>is not a real estate agent or broker, and is not a party to any sale, purchase, rental, lease or other agreement between Users;</li>
                <li>does not own, sell, rent or manage any property listed on the Platform;</li>
                <li>does not collect or hold any token amount, advance, deposit, rent or sale consideration on behalf of Users; and</li>
                <li>does not guarantee that any Listing will result in a transaction.</li>
              </ul>
              <p>Any transaction you enter into with another User is solely between you and that User.</p>
            </>
          ),
        },
        {
          id: 'eligibility',
          title: '3. Eligibility',
          body: (
            <ul>
              <li>You must be at least 18 years old and competent to contract under the Indian Contract Act, 1872 to register or transact on the Platform.</li>
              <li>If you use the Platform on behalf of a company, firm or other entity, you confirm that you are authorised to bind it to these Terms.</li>
              <li>You may not use the Platform if we have previously suspended or removed your account, or if you are barred from doing so under any applicable law.</li>
            </ul>
          ),
        },
        {
          id: 'accounts',
          title: '4. Your account',
          body: (
            <>
              <p>
                You register and sign in with your mobile number, verified by a one-time password (OTP). You agree that:
              </p>
              <ul>
                <li>the information you provide (name, mobile number, email address, city and role) is true, accurate and kept up to date;</li>
                <li>you will register only one account per role, and will not create an account using another person&rsquo;s identity or mobile number;</li>
                <li>you are responsible for all activity under your account and for keeping your device, OTPs and sign-in credentials confidential; and</li>
                <li>you will tell us immediately at {mail('Unauthorised account access')} if you suspect any unauthorised use of your account.</li>
              </ul>
              <p>We may refuse registration, or suspend or close an account, if we reasonably believe these Terms have been breached.</p>
            </>
          ),
        },
        {
          id: 'listings',
          title: '5. Listings by Owners and Dealers',
          body: (
            <>
              <p>When you post a Listing, you represent and warrant that:</p>
              <ul>
                <li>you are the owner of the property, or are authorised in writing by the owner to advertise it, and can produce proof on request;</li>
                <li>all details, including price, area, location, configuration, amenities, availability, ownership and legal status, are accurate and not misleading;</li>
                <li>photos and videos show the actual property and you have the right to publish them;</li>
                <li>the property is not under any undisclosed dispute, encumbrance or restriction that would prevent the advertised transaction; and</li>
                <li>where the property or project is required to be registered under the Real Estate (Regulation and Development) Act, 2016 (&ldquo;RERA&rdquo;), it is registered and you display the RERA registration number, and Dealers hold a valid RERA agent registration where required.</li>
              </ul>
              <p>
                We may review, verify, edit for format, refuse, hide or remove any Listing, or limit its visibility, at our discretion,
                including Listings that are duplicate, inaccurate, expired, unlawful or reported by other Users. A &ldquo;Verified&rdquo; or
                similar badge means only that the Listing passed our internal checks at the time; it is not a guarantee of title, condition
                or legality.
              </p>
            </>
          ),
        },
        {
          id: 'buyers',
          title: '6. Responsibilities of Buyers',
          body: (
            <>
              <p>Before making any payment or entering into any agreement for a property found on the Platform, you are responsible for:</p>
              <ul>
                <li>physically inspecting the property and independently verifying ownership, title documents, approvals, RERA registration and all other details;</li>
                <li>confirming the identity and authority of the Owner or Dealer you deal with; and</li>
                <li>seeking independent legal, financial and technical advice where appropriate.</li>
              </ul>
              <p>
                Never pay a token amount, advance or deposit before you have verified the property and the counterparty. {LEGAL.brand} will
                never ask you to transfer money to an individual on its behalf.
              </p>
            </>
          ),
        },
        {
          id: 'enquiries',
          title: '7. Enquiries, contact details and communications',
          body: (
            <>
              <p>
                When you send an enquiry, request a site visit or choose to view a contact number, you agree that we may share your name,
                mobile number and enquiry details with the relevant Owner or Dealer so they can respond to you. Owners and Dealers may use
                these details only to respond to that enquiry, and not for unrelated marketing or resale.
              </p>
              <p>
                By registering, you consent to receive calls, SMS, WhatsApp messages, emails and push notifications from {LEGAL.brand} and
                from Owners or Dealers you have contacted, relating to your account, Listings, enquiries and transactions. This consent
                applies even if your number is registered on the National Customer Preference Register (DND), to the extent permitted
                by TRAI regulations. You can opt out of promotional messages at any time; service and transactional messages may still be
                sent while your account is active.
              </p>
            </>
          ),
        },
        {
          id: 'plans',
          title: '8. Plans, pricing and payments',
          body: (
            <>
              <ul>
                <li>Basic browsing and, where offered, free listing are available at no charge. Paid Plans for Owners, Dealers and Buyers give additional benefits such as more listings, wider reach, coverage of more micro-markets or access to contact details.</li>
                <li>The benefits, limits, validity period and price of each Plan are shown on the relevant plan page and at checkout. Prices are in Indian Rupees and are exclusive of GST unless stated; applicable GST is added and shown before you pay.</li>
                <li>Payments are processed by authorised third-party payment gateways. We do not store your full card details, UPI PIN or net-banking credentials.</li>
                <li>A Plan is activated only after successful payment confirmation. We issue an invoice for every payment, which you can download from your dashboard.</li>
                <li>Plans are personal to the account that bought them and cannot be transferred, resold or split across accounts.</li>
                <li>We may change Plan features or prices for future purchases. Changes do not affect a Plan you have already paid for during its current validity.</li>
                <li>Refunds and cancellations are governed by our <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>.</li>
              </ul>
              <p>
                Purchases made inside the iOS or Android app may also be subject to the payment terms of Apple or Google where their billing
                systems are used.
              </p>
            </>
          ),
        },
        {
          id: 'reva',
          title: '9. Reva AI assistant',
          body: (
            <>
              <p>
                The Platform includes Reva, an AI assistant that answers questions about properties, localities and how to use{' '}
                {LEGAL.brand}, by text or voice. Reva&rsquo;s answers are generated automatically and are provided for general guidance only.
              </p>
              <ul>
                <li>Reva may make mistakes. Do not rely on its answers as legal, financial, tax or investment advice, and always verify property details independently.</li>
                <li>Do not share sensitive information such as bank details, card numbers, passwords, Aadhaar or PAN numbers with Reva.</li>
                <li>How we handle your messages and voice input is described in our <Link href="/privacy-policy">Privacy Policy</Link>.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'conduct',
          title: '10. Acceptable use',
          body: (
            <>
              <p>
                In line with Rule 3(1)(b) of the IT Rules, 2021, you must not host, display, upload, publish, transmit or share any Content,
                and must not use the Platform in any way, that:
              </p>
              <ul>
                <li>belongs to another person and to which you have no right, or infringes any patent, trademark, copyright or other proprietary right;</li>
                <li>is false, misleading, fraudulent or knowingly deceptive, including fake Listings, bait pricing or properties that are not genuinely available;</li>
                <li>is defamatory, obscene, pornographic, harassing, hateful, or discriminatory on the basis of religion, caste, gender, community or any other ground;</li>
                <li>is harmful to children or violates any law for the time being in force;</li>
                <li>impersonates another person or misrepresents your identity, ownership or authority;</li>
                <li>contains viruses, malware or any code designed to interrupt, damage or limit the Platform;</li>
                <li>threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign states, or public order;</li>
                <li>involves scraping, crawling, bulk downloading or copying Listings or User data, or using automated systems to access the Platform without our written permission;</li>
                <li>involves sending spam, unsolicited messages or contacting Users for purposes unrelated to their Listing or enquiry; or</li>
                <li>attempts to bypass the Platform to avoid Plan limits, or probes, tests or breaches the security of the Platform.</li>
              </ul>
              <p>
                We may remove infringing Content and suspend or terminate accounts for breach of this section, and may report unlawful
                activity to the appropriate authorities.
              </p>
            </>
          ),
        },
        {
          id: 'ip',
          title: '11. Intellectual property',
          body: (
            <>
              <p>
                The Platform, including its design, software, logos, the {LEGAL.brand} name and trademarks, text, graphics and the
                compilation of Listings, is owned by or licensed to {LEGAL.legalName} and protected by Indian and international
                intellectual property laws. Except as these Terms allow, you may not copy, modify, distribute, sell or create derivative
                works from any part of the Platform.
              </p>
              <p>
                You keep ownership of the Content you upload. By uploading it, you grant {LEGAL.brand} a non-exclusive, worldwide,
                royalty-free, transferable licence to host, store, reproduce, format, display and distribute that Content on the Platform
                and in marketing of the Platform, for as long as it remains on the Platform and for a reasonable period afterwards for
                backup and legal purposes. You confirm you have the rights needed to grant this licence.
              </p>
            </>
          ),
        },
        {
          id: 'apps',
          title: '12. Mobile apps',
          body: (
            <>
              <p>
                Subject to these Terms, we grant you a limited, personal, non-exclusive, non-transferable, revocable licence to download
                and use the {LEGAL.brand} app on devices you own or control, for your personal or business use of the Platform. You must
                not reverse-engineer, decompile or modify the app, except to the extent the law allows.
              </p>
              <p>
                The app may request access to features of your device, such as your photos (to add property pictures) or microphone (to
                speak with Reva). You can allow or deny these permissions at any time in your device settings; some features will not
                work without them. Updates may be required to keep using the app.
              </p>
              <p><strong>Apple App Store.</strong> If you downloaded the app from the Apple App Store:</p>
              <ul>
                <li>these Terms are between you and {LEGAL.legalName} only, not Apple Inc. (&ldquo;Apple&rdquo;), and {LEGAL.brand}, not Apple, is solely responsible for the app and its content;</li>
                <li>your licence is limited to use on Apple-branded products you own or control, as permitted by the Usage Rules in the Apple Media Services Terms and Conditions;</li>
                <li>Apple has no obligation to provide any maintenance or support for the app;</li>
                <li>if the app fails to conform to any applicable warranty, you may notify Apple and Apple will refund the purchase price (if any); to the maximum extent permitted by law, Apple has no other warranty obligation with respect to the app;</li>
                <li>{LEGAL.brand}, not Apple, is responsible for addressing any claims relating to the app, including product liability claims, claims that the app fails to meet legal or regulatory requirements, and consumer protection or privacy claims;</li>
                <li>{LEGAL.brand}, not Apple, is responsible for the investigation, defence, settlement and discharge of any third-party claim that the app infringes intellectual property rights;</li>
                <li>you confirm that you are not located in a country subject to a U.S. Government embargo, or designated as a &ldquo;terrorist supporting&rdquo; country, and are not on any U.S. Government list of prohibited or restricted parties; and</li>
                <li>Apple and its subsidiaries are third-party beneficiaries of these Terms and, once you accept them, Apple may enforce them against you.</li>
              </ul>
              <p>
                <strong>Google Play.</strong> If you downloaded the app from Google Play, you also agree to the Google Play Terms of Service.
                In case of conflict regarding your use of Google Play, the Google Play Terms prevail.
              </p>
            </>
          ),
        },
        {
          id: 'third-party',
          title: '13. Third-party services and links',
          body: (
            <p>
              The Platform may contain links to, or integrations with, third-party websites and services, such as maps, payment gateways,
              home-loan partners or legal and documentation services. These are provided for convenience only. We do not
              control and are not responsible for their content, policies or services, and your use of them is governed by their own terms.
            </p>
          ),
        },
        {
          id: 'disclaimer',
          title: '14. Disclaimers',
          body: (
            <>
              <p>
                The Platform and all Content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To the fullest extent
                permitted by law, {LEGAL.brand} disclaims all warranties, express or implied, including warranties of merchantability, fitness
                for a particular purpose, accuracy and non-infringement.
              </p>
              <p>
                Listings, prices, locality insights, price trends, estimates and AI-generated answers are provided by Users or generated
                automatically, and are for information only. {LEGAL.brand} does not verify, and makes no representation about, the title,
                legal status, approvals, condition, measurements or value of any property, or the identity or conduct of any User. We do not
                guarantee that the Platform will be uninterrupted, error-free or free of harmful components.
              </p>
            </>
          ),
        },
        {
          id: 'liability',
          title: '15. Limitation of liability',
          body: (
            <>
              <p>To the maximum extent permitted by law:</p>
              <ul>
                <li>{LEGAL.brand} is not liable for any indirect, incidental, special, consequential or punitive loss, or for loss of profit, data, goodwill or business opportunity, arising from your use of the Platform;</li>
                <li>{LEGAL.brand} is not liable for any act, omission, misrepresentation, fraud or default of any User, or for any loss arising from a transaction or dispute between Users; and</li>
                <li>our total aggregate liability to you for any claim relating to the Platform is limited to the amount you paid to {LEGAL.brand} for the Plan giving rise to the claim in the 6 months before the claim arose, or ₹1,000 if you have paid nothing.</li>
              </ul>
              <p>Nothing in these Terms limits any liability that cannot be limited under applicable law.</p>
            </>
          ),
        },
        {
          id: 'indemnity',
          title: '16. Indemnity',
          body: (
            <p>
              You agree to indemnify and hold harmless {LEGAL.legalName}, its directors, employees, partners and agents from any claim,
              demand, loss, liability, penalty or expense (including reasonable legal fees) arising out of your Listings or other Content, your
              breach of these Terms or of any law, your transactions with other Users, or your violation of the rights of any third party.
            </p>
          ),
        },
        {
          id: 'termination',
          title: '17. Suspension and termination',
          body: (
            <>
              <p>
                You may stop using the Platform and request deletion of your account at any time, as explained in our{' '}
                <Link href="/privacy-policy#delete-account">Privacy Policy</Link>.
              </p>
              <p>
                We may suspend, restrict or terminate your access, or remove your Listings, with or without notice, if you breach these Terms,
                if we are required to by law or a competent authority, or if we reasonably believe your use creates risk or harm for other Users
                or for {LEGAL.brand}. If we terminate your account for breach, fees already paid are not refundable except as stated in the{' '}
                <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>. Sections that by their nature should survive termination,
                including intellectual property, disclaimers, limitation of liability, indemnity and governing law, will survive.
              </p>
            </>
          ),
        },
        {
          id: 'grievance',
          title: '18. Grievance redressal',
          body: (
            <>
              <p>
                In accordance with the Information Technology Act, 2000, the IT Rules, 2021 and the Consumer Protection (E-Commerce) Rules,
                2020, you can raise any complaint about the Platform, a Listing, Content you believe is unlawful or infringing, or these Terms,
                with our Grievance Officer:
              </p>
              <ul>
                <li><strong>Name:</strong> {LEGAL.grievanceOfficer.name}</li>
                <li><strong>Company:</strong> {LEGAL.legalName}</li>
                <li><strong>Address:</strong> {LEGAL.address}</li>
                <li><strong>Email:</strong> <a href={`mailto:${LEGAL.grievanceOfficer.email}?subject=Grievance`}>{LEGAL.grievanceOfficer.email}</a></li>
                <li><strong>Hours:</strong> {LEGAL.grievanceOfficer.hours}</li>
              </ul>
              <p>
                Please include your name, registered mobile number, a description of the issue and links or Listing IDs. We will acknowledge
                your complaint within 24 hours and resolve it within 15 days of receipt. Requests to remove Content that is prima facie
                unlawful, or that exposes a person&rsquo;s private area, nudity or is impersonation, will be acted on within 72 hours or 24 hours
                respectively, as required by the IT Rules, 2021.
              </p>
            </>
          ),
        },
        {
          id: 'law',
          title: '19. Governing law and disputes',
          body: (
            <>
              <p>These Terms are governed by the laws of India.</p>
              <p>
                If a dispute arises, please contact us first so we can try to resolve it amicably. Any dispute that is not resolved within 30
                days shall be referred to arbitration by a sole arbitrator appointed by {LEGAL.brand}, under the Arbitration and Conciliation
                Act, 1996. The seat and venue of arbitration shall be {LEGAL.jurisdiction}, and the proceedings shall be in English. Subject to
                this, the courts at {LEGAL.jurisdiction} have exclusive jurisdiction. Nothing here prevents you from approaching a consumer
                commission where the law entitles you to do so.
              </p>
            </>
          ),
        },
        {
          id: 'general',
          title: '20. General',
          body: (
            <ul>
              <li><strong>Entire agreement.</strong> These Terms, with the policies referred to in them, are the entire agreement between you and {LEGAL.brand} about the Platform.</li>
              <li><strong>Severability.</strong> If any provision is found invalid or unenforceable, the rest of these Terms remain in full force.</li>
              <li><strong>No waiver.</strong> Our failure to enforce any right is not a waiver of that right.</li>
              <li><strong>Assignment.</strong> You may not transfer your rights under these Terms. We may assign them to an affiliate or a successor business.</li>
              <li><strong>Force majeure.</strong> We are not liable for any delay or failure caused by events beyond our reasonable control, including natural disasters, epidemics, network failures, government action or third-party service outages.</li>
            </ul>
          ),
        },
        {
          id: 'changes',
          title: '21. Changes to these Terms',
          body: (
            <p>
              We may update these Terms from time to time to reflect changes to the Platform, our Plans or the law. We will post the updated
              Terms on this page and change the &ldquo;Last updated&rdquo; date, and will notify you of material changes through the Platform,
              the app or by message. Your continued use of the Platform after the changes take effect means you accept the updated Terms.
            </p>
          ),
        },
        {
          id: 'contact',
          title: '22. Contact us',
          body: (
            <p>
              For any questions about these Terms, write to us at {mail('Question about Terms and Conditions')} or use our{' '}
              <Link href="/contact">Contact page</Link>. {LEGAL.legalName}, {LEGAL.address}.
            </p>
          ),
        },
      ]}
    />
  );
}
