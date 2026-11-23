import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/legal/LegalPage';
import { LEGAL } from '@/lib/legal-entity';

export const metadata: Metadata = {
  title: 'Privacy Policy | Restamp',
  description:
    'How RESTAMP collects, uses, shares and protects your personal information on the website and mobile application, and the rights and choices available to you.',
};

// Legal content: have it reviewed by a qualified legal advisor before each release.
// Keep the "Information we collect" section in step with the App Store privacy labels
// and the Google Play Data safety form.
export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="23 November 2026"
      intro={null}
      sections={[
        {
          id: 'introduction',
          title: '1. Introduction',
          body: (
            <>
              <p>Welcome to RESTAMP.</p>
              <p>
                RESTAMP (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo; or &ldquo;the Platform&rdquo;) is a real estate marketplace
                that connects property Owners, Buyers and Brokers through its website and mobile application.
              </p>
              <p>
                We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what
                information we collect, how we use it, when we share it, how we protect it and what choices and rights are available to you
                when using our services.
              </p>
              <p>
                By accessing or using the RESTAMP website or mobile application, you acknowledge that you have read this Privacy Policy.
                Please also read our <Link href="/terms">Terms and Conditions</Link>.
              </p>
            </>
          ),
        },
        {
          id: 'collect',
          title: '2. Information we collect',
          body: (
            <>
              <p>
                We may collect the following categories of information when you register, create an account, list a property, search for
                properties or use our services.
              </p>
              <p><strong>2.1 Personal information</strong></p>
              <ul>
                <li><strong>Phone number:</strong> used for account registration, OTP verification, authentication and service-related communication.</li>
                <li><strong>Name:</strong> first name, last name and display name provided during registration or profile updates.</li>
                <li><strong>Email address:</strong> used for account identification, communication, notifications and transaction-related updates.</li>
                <li><strong>Location information:</strong> location information provided by you or collected with your permission when location-based features are used.</li>
                <li><strong>Address:</strong> residential addresses, property addresses and other address information submitted through the platform.</li>
              </ul>
              <p><strong>2.2 Property information</strong></p>
              <p>When property owners or authorized users create property listings, we may collect:</p>
              <ul>
                <li>Property photos and images.</li>
                <li>Property address and location.</li>
                <li>Property type and specifications.</li>
                <li>Sale price or rental price.</li>
                <li>Property descriptions and amenities.</li>
                <li>Ownership or listing-related information.</li>
                <li>Other details submitted during property registration and verification.</li>
              </ul>
              <p>
                Property information and photographs may be displayed publicly or to relevant platform users according to the listing&rsquo;s
                visibility and access settings.
              </p>
              <p><strong>2.3 Account and user role information</strong></p>
              <p>RESTAMP supports different user roles, including Buyer, Owner and Broker.</p>
              <p>
                We collect information about your selected and assigned user role, account status, profile information, verification status
                and activities associated with your account.
              </p>
              <p><strong>2.4 Pricing and subscription information</strong></p>
              <p>We may collect and process:</p>
              <ul>
                <li>Property sale and rental prices.</li>
                <li>Brokerage and other listing-related pricing information.</li>
                <li>Subscription plan details.</li>
                <li>Selected membership plans.</li>
                <li>Subscription status and validity.</li>
                <li>Plan purchase and renewal information.</li>
                <li>Applicable charges, discounts and payment status.</li>
              </ul>
              <p><strong>2.5 Payment information</strong></p>
              <p>When you purchase a subscription or use paid features, we may collect transaction-related information, including:</p>
              <ul>
                <li>Transaction reference or order ID.</li>
                <li>Payment amount.</li>
                <li>Payment date and time.</li>
                <li>Payment status.</li>
                <li>Subscription purchase details.</li>
                <li>Refund and payment reconciliation information.</li>
              </ul>
              <p>
                Payments may be processed through third-party payment gateway providers. Your card numbers, banking credentials, UPI PINs and
                other sensitive payment credentials are handled by the relevant payment provider where applicable. RESTAMP does not claim to
                store these credentials unless explicitly stated in the relevant payment process.
              </p>
              <p><strong>2.6 Technical and usage information</strong></p>
              <p>We may collect technical information such as:</p>
              <ul>
                <li>IP address.</li>
                <li>Device type and operating system.</li>
                <li>Browser information.</li>
                <li>Application version.</li>
                <li>Login timestamps.</li>
                <li>Website and application usage information.</li>
                <li>Error logs and diagnostic information.</li>
              </ul>
              <p>This information helps us maintain platform functionality, troubleshoot problems and protect user accounts.</p>
            </>
          ),
        },
        {
          id: 'use',
          title: '3. How we use your information',
          body: (
            <>
              <p>RESTAMP uses collected information for the following purposes:</p>
              <ol>
                <li>To create and manage user accounts.</li>
                <li>To authenticate users through OTP or supported login methods.</li>
                <li>To provide property listing and property discovery services.</li>
                <li>To display relevant property information and photographs.</li>
                <li>To facilitate communication between Buyers, Owners and Brokers.</li>
                <li>To process property enquiries and property visit requests.</li>
                <li>To manage subscription plans and paid services.</li>
                <li>To process and verify payment transactions.</li>
                <li>To improve website and application functionality.</li>
                <li>To prevent fraudulent activities and unauthorized access.</li>
                <li>To provide customer support and respond to complaints.</li>
                <li>To comply with applicable legal and regulatory requirements.</li>
              </ol>
              <p>We will use personal information only for specified purposes and in accordance with applicable law.</p>
            </>
          ),
        },
        {
          id: 'property-location',
          title: '4. Property information and location sharing',
          body: (
            <>
              <p>RESTAMP allows property owners and authorized users to submit property details and photographs for listing purposes.</p>
              <p>Property information may include the exact property address and geographical location.</p>
              <p>
                Depending on the property&rsquo;s listing visibility and the features available on the platform, property details may be
                accessible to Buyers and Brokers.
              </p>
              <p>
                Users should ensure that they have the necessary rights and authorization before uploading property photographs, addresses or
                other information belonging to another person.
              </p>
              <p>RESTAMP may use location information to support property discovery, location display and related services.</p>
              <p>Users should avoid uploading confidential personal information in public property descriptions or photographs.</p>
            </>
          ),
        },
        {
          id: 'share',
          title: '5. Sharing of information',
          body: (
            <>
              <p>RESTAMP may share relevant information in the following circumstances:</p>
              <p><strong>5.1 With other platform users</strong></p>
              <p>We may share relevant property and user information to facilitate marketplace services. For example:</p>
              <ul>
                <li>Property listing details may be visible to Buyers and Brokers.</li>
                <li>Buyer enquiry details may be shared with the relevant Owner or Broker.</li>
                <li>Property visit requests may be shared with the relevant property contact.</li>
                <li>Contact information may be made available through the platform&rsquo;s applicable contact-access features.</li>
              </ul>
              <p><strong>5.2 With service providers</strong></p>
              <p>We may share necessary information with third-party service providers who support our operations, including:</p>
              <ul>
                <li>Cloud hosting and infrastructure providers.</li>
                <li>OTP and SMS service providers.</li>
                <li>Email communication providers.</li>
                <li>Google authentication services, where applicable.</li>
                <li>Payment gateway providers.</li>
                <li>Analytics and technical support providers.</li>
              </ul>
              <p>
                Such providers may process information only as necessary to provide their services, subject to applicable contractual and
                legal requirements.
              </p>
              <p><strong>5.3 Legal requirements</strong></p>
              <p>
                We may disclose information when required by applicable law, court orders, government authorities or other lawful requests.
              </p>
              <p><strong>5.4 Business transfers</strong></p>
              <p>
                If RESTAMP undergoes a merger, acquisition, restructuring or business transfer, relevant information may be transferred as
                part of that transaction, subject to applicable privacy requirements.
              </p>
              <p>RESTAMP does not authorize the sale of personal information as an independent commercial data product.</p>
            </>
          ),
        },
        {
          id: 'authentication',
          title: '6. OTP authentication and Google login',
          body: (
            <>
              <p>RESTAMP may provide account authentication through mobile OTP verification and supported Google authentication.</p>
              <p>
                For OTP authentication, we process your registered mobile number and authentication-related information to verify your
                identity.
              </p>
              <p>For Google login, authentication information may be processed through Google&rsquo;s authentication services.</p>
              <p>We use authentication information to secure accounts and provide access to authorized platform features.</p>
              <p>Users should keep their login credentials and authentication devices secure.</p>
            </>
          ),
        },
        {
          id: 'payments',
          title: '7. Subscriptions and payments',
          body: (
            <>
              <p>RESTAMP may offer paid subscription plans and other paid services to Owners, Brokers and other eligible users.</p>
              <p>When purchasing a plan:</p>
              <ul>
                <li>Relevant account and subscription information may be processed.</li>
                <li>Payment transactions may be handled by authorized payment service providers.</li>
                <li>Transaction references and payment status may be retained for account management and reconciliation.</li>
                <li>
                  Refunds, cancellations and payment disputes may be handled according to the applicable platform terms and{' '}
                  <Link href="/refund-policy">refund policy</Link>.
                </li>
              </ul>
              <p>
                RESTAMP does not guarantee successful transactions where payment processing is dependent on external payment providers or
                banking systems.
              </p>
            </>
          ),
        },
        {
          id: 'cookies',
          title: '8. Cookies and similar technologies',
          body: (
            <>
              <p>The RESTAMP website may use cookies and similar technologies to:</p>
              <ul>
                <li>Maintain login sessions.</li>
                <li>Remember user preferences.</li>
                <li>Improve website performance.</li>
                <li>Understand website usage.</li>
                <li>Support security and fraud prevention.</li>
              </ul>
              <p>Where required, we will obtain consent before using non-essential cookies or similar technologies.</p>
              <p>
                Users can manage cookie preferences through available website controls and browser settings. Disabling certain cookies may
                affect website functionality.
              </p>
            </>
          ),
        },
        {
          id: 'security',
          title: '9. Data storage and security',
          body: (
            <>
              <p>
                RESTAMP takes reasonable steps to protect personal information against unauthorized access, disclosure, alteration, loss or
                misuse.
              </p>
              <p>
                Depending on the nature of the information and applicable requirements, security measures may include access controls,
                authentication safeguards, secure communication and appropriate technical and organizational measures.
              </p>
              <p>However, no method of electronic storage or internet transmission can be guaranteed to be completely secure.</p>
              <p>
                Users are responsible for maintaining the confidentiality of their account credentials and notifying RESTAMP if they suspect
                unauthorized account access.
              </p>
            </>
          ),
        },
        {
          id: 'retention',
          title: '10. Data retention',
          body: (
            <>
              <p>RESTAMP retains personal information only for as long as reasonably necessary to:</p>
              <ul>
                <li>Provide the requested services.</li>
                <li>Maintain user accounts and property listings.</li>
                <li>Complete payment and subscription-related activities.</li>
                <li>Resolve disputes and complaints.</li>
                <li>Prevent fraud and unauthorized activities.</li>
                <li>Comply with applicable legal and regulatory obligations.</li>
              </ul>
              <p>
                When personal information is no longer required, it will be deleted or anonymized in accordance with applicable laws and our
                retention practices, subject to any legal requirements to retain it.
              </p>
            </>
          ),
        },
        {
          id: 'rights',
          title: '11. User rights and choices',
          body: (
            <>
              <p>Subject to applicable laws, users may have the right to:</p>
              <ul>
                <li>Request access to their personal information.</li>
                <li>Request correction or updating of inaccurate information.</li>
                <li>Request deletion of personal information (see <a href="#delete-account">Deleting your account</a>).</li>
                <li>Withdraw consent where processing is based on consent.</li>
                <li>Raise grievances regarding the processing of personal information.</li>
                <li>Nominate another individual where permitted under applicable law.</li>
              </ul>
              <p>Users may submit privacy-related requests through the contact details provided in this policy.</p>
              <p>We may request reasonable information to verify the identity of the person making the request.</p>
              <p>Certain information may need to be retained where required by applicable law or for legitimate legal obligations.</p>
            </>
          ),
        },
        {
          id: 'third-party',
          title: '12. Third-party websites and services',
          body: (
            <>
              <p>The RESTAMP website or application may contain links or integrations with third-party websites and services.</p>
              <p>These third parties may have their own privacy policies and data-processing practices.</p>
              <p>RESTAMP is not responsible for the privacy practices of external websites or services that are not operated by us.</p>
              <p>We encourage users to review the privacy policies of third-party services before providing their information.</p>
            </>
          ),
        },
        {
          id: 'children',
          title: "13. Children's privacy",
          body: (
            <>
              <p>
                RESTAMP is intended for individuals who are legally eligible to use the platform and its property-related services.
              </p>
              <p>We do not knowingly seek to collect personal information from children in violation of applicable laws.</p>
              <p>Where applicable, parental or guardian consent and other legally required safeguards will be implemented.</p>
              <p>
                If we become aware that personal information has been collected in violation of applicable requirements, we will take
                appropriate steps in accordance with the law.
              </p>
            </>
          ),
        },
        {
          id: 'changes',
          title: '14. Changes to this Privacy Policy',
          body: (
            <>
              <p>
                RESTAMP may update this Privacy Policy from time to time to reflect changes in our services, business practices, technology
                or applicable legal requirements.
              </p>
              <p>Any revised policy will be published on the RESTAMP website with an updated effective date or last-updated date.</p>
              <p>Where required by law, we will provide notice of material changes and obtain any necessary consent.</p>
              <p>Users are encouraged to review this page periodically.</p>
            </>
          ),
        },
        {
          id: 'grievance',
          title: '15. Grievance redressal and privacy contact',
          body: (
            <>
              <p>
                If you have questions, concerns or complaints regarding this Privacy Policy or the processing of your personal information,
                you may contact RESTAMP using the details below.
              </p>
              <ul>
                <li><strong>Company name:</strong> {LEGAL.legalName}</li>
                <li><strong>Brand name:</strong> RESTAMP</li>
                <li><strong>Registered office address:</strong> {LEGAL.address}</li>
                <li>
                  <strong>Privacy / grievance email:</strong>{' '}
                  <a href={`mailto:${LEGAL.grievanceOfficer.email}?subject=Privacy%20grievance`}>{LEGAL.grievanceOfficer.email}</a>
                </li>
                <li><strong>Grievance Officer:</strong> {LEGAL.grievanceOfficer.name}</li>
                <li><strong>Website:</strong> <a href="https://restamp.in">https://restamp.in</a></li>
              </ul>
              <p>We will review and respond to privacy-related requests and grievances within the timelines prescribed by applicable law.</p>
            </>
          ),
        },
        {
          id: 'law',
          title: '16. Applicable law and jurisdiction',
          body: (
            <>
              <p>This Privacy Policy is governed by the laws of India.</p>
              <p>
                RESTAMP will handle personal information in accordance with applicable Indian data protection and privacy laws, including the
                Digital Personal Data Protection Act, 2023, and the applicable provisions of the Digital Personal Data Protection Rules, 2025,
                as they come into force.
              </p>
              <p>
                Any disputes arising in connection with this Privacy Policy will be subject to the jurisdiction of the competent courts in{' '}
                {LEGAL.jurisdiction}, India, subject to applicable law.
              </p>
            </>
          ),
        },
        {
          id: 'delete-account',
          title: '17. Deleting your account',
          body: (
            <p>
              To delete your account and its data, email{' '}
              <a href={`mailto:${LEGAL.supportEmail}?subject=Delete%20my%20Restamp%20account`}>{LEGAL.supportEmail}</a> from your
              registered details or use our <Link href="/contact">Contact page</Link>. We will verify your request and delete your data
              within 30 days, except records we must keep by law.
            </p>
          ),
        },
      ]}
    />
  );
}
