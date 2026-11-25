import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/legal/LegalPage';
import { LEGAL } from '@/lib/legal-entity';

export const metadata: Metadata = {
  title: 'Privacy Policy | Restamp',
  description:
    'How RESTAMP processes personal data across its website and mobile application under the Digital Personal Data Protection Act, 2023, including data categories, retention, security and user rights.',
};

const privacyMail = (subject?: string) => (
  <a href={`mailto:${LEGAL.grievanceOfficer.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`}>
    {LEGAL.grievanceOfficer.email}
  </a>
);

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate={LEGAL.effectiveDate}
      updated={LEGAL.effectiveDate}
      intro={
        <p className="text-sm text-slate-500">
          Website: <a href={LEGAL.websiteUrl}>{LEGAL.websiteUrl}</a> · Application: RESTAMP Mobile Application
        </p>
      }
      sections={[
        {
          id: 'introduction',
          title: '1. Introduction and Acceptance',
          body: (
            <>
              <p>
                RESTAMP (&ldquo;RESTAMP&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo; or &ldquo;us&rdquo;) operates a
                real-estate marketplace through its website and mobile application (collectively, the
                &ldquo;Platform&rdquo;). The Platform enables property owners and persons authorised by them,
                prospective buyers, tenants, brokers and other users to publish, discover and enquire about properties
                and to use related features.
              </p>
              <p>
                This Privacy Policy explains the categories of personal data that RESTAMP may collect, the purposes and
                manner of processing, the circumstances in which data may be disclosed, the safeguards and retention
                practices adopted, and the rights and choices available to individuals (&ldquo;you&rdquo; or
                &ldquo;User&rdquo;).
              </p>
              <p>
                This Policy is to be read with the Platform&rsquo;s{' '}
                <Link href="/terms">Terms and Conditions</Link> and any separate notice displayed at the point of
                collection. If a separate notice describes a specific processing activity, that notice shall be read
                together with this Policy. Nothing in this Policy excludes or limits any right or remedy that cannot
                lawfully be excluded or limited.
              </p>
              <p>
                By using the Platform, you acknowledge that you have been given access to this Policy. Where applicable
                law requires consent for a particular processing activity, mere use of the Platform or acceptance of this
                Policy shall not, by itself, be treated as a substitute for the specific consent required by law.
              </p>
            </>
          ),
        },
        {
          id: 'data-fiduciary',
          title: '2. Who Is Responsible for Your Data',
          body: (
            <>
              <p>
                The entity identified below is the operator of the Platform and, where it determines the purposes and
                means of processing, acts as the Data Fiduciary under the Digital Personal Data Protection Act, 2023
                (&ldquo;DPDP Act&rdquo;) for the personal data processed through the Platform:
              </p>
              <ul>
                <li><strong>Legal Entity Name:</strong> {LEGAL.legalName}</li>
                <li><strong>Brand / Platform:</strong> RESTAMP</li>
                <li><strong>Registered Office:</strong> {LEGAL.address}</li>
                <li><strong>Privacy / Grievance Email:</strong> {privacyMail('Privacy inquiry')}</li>
                <li><strong>Grievance Officer / Privacy Contact:</strong> {LEGAL.grievanceOfficer.name}</li>
                <li><strong>Website:</strong> <a href={LEGAL.websiteUrl}>{LEGAL.websiteUrl}</a></li>
              </ul>
              <p>
                A third-party service provider that processes personal data on RESTAMP&rsquo;s documented instructions is
                a data processor. Such provider is not authorised to use the data for its own independent purposes
                merely because it provides services to RESTAMP.
              </p>
            </>
          ),
        },
        {
          id: 'scope',
          title: '3. Scope and Applicability',
          body: (
            <>
              <p>
                This Policy applies to personal data processed in digital form through the Platform, including data
                submitted by Users, generated through use of the Platform, or received from service providers and other
                lawful sources. It applies to visitors, registered Buyers, Owners, Brokers and other persons who interact
                with RESTAMP.
              </p>
              <p>
                This Policy does not govern websites, applications or services operated independently by third parties,
                even if links to or integrations with those services are available on the Platform. Such third parties
                are responsible for their own privacy notices and practices.
              </p>
            </>
          ),
        },
        {
          id: 'categories',
          title: '4. Categories of Personal Data We May Process',
          body: (
            <>
              <h3>4.1 Identity and contact information</h3>
              <ul>
                <li>Name, username, profile/display name and user role (Buyer, Owner, Broker or other available role).</li>
                <li>Mobile number, email address and communication preferences.</li>
                <li>Address and location details supplied by you or required for a property-related interaction.</li>
                <li>Account identifiers, verification status and account-related records.</li>
              </ul>

              <h3>4.2 Property and listing information</h3>
              <ul>
                <li>Property address, locality, geographical coordinates or map location, where supplied or enabled.</li>
                <li>Property type, dimensions, specifications, amenities, description, photographs, videos and other listing material.</li>
                <li>Sale or rental price, availability, listing status and property-related preferences.</li>
                <li>
                  Ownership, authority-to-list or verification information and supporting documents, but only where
                  requested for a stated platform or compliance purpose.
                </li>
              </ul>

              <h3>4.3 Enquiries, communications and activity</h3>
              <ul>
                <li>Enquiry details, messages, call-back requests, property-visit requests and responses.</li>
                <li>Records of interactions between Buyers, Owners, Brokers and relevant property contacts through Platform features.</li>
                <li>Customer-support requests, complaints, feedback and correspondence.</li>
                <li>Information about searches, saved properties, viewed listings and use of Platform features, where such activity is recorded.</li>
              </ul>

              <h3>4.4 Subscription and payment information</h3>
              <ul>
                <li>Subscription or membership plan, purchase, renewal, expiry and status information.</li>
                <li>Order or transaction reference, amount, date, payment status, refund and reconciliation information.</li>
                <li>
                  Payment credentials such as card numbers, bank credentials and UPI PINs are ordinarily collected and
                  handled by the relevant payment gateway and not by RESTAMP. Do not share such credentials with RESTAMP
                  personnel.
                </li>
              </ul>

              <h3>4.5 Device, technical and usage information</h3>
              <ul>
                <li>IP address, device type, operating system, browser, application version and language settings.</li>
                <li>Login dates and times, session and diagnostic data, crash/error logs and security events.</li>
                <li>Cookie identifiers and similar technology data, subject to applicable consent requirements.</li>
              </ul>

              <h3>4.6 Location information</h3>
              <p>
                Location may be provided directly by you or collected through device permissions where you enable a
                location-based feature. You may disable device-level location permission; however, location-dependent
                features may then be unavailable or less accurate. RESTAMP will not treat a device permission as consent
                for unrelated uses.
              </p>

              <h3>4.7 Information received from other persons</h3>
              <p>
                Where a User lists or enquires about a property on behalf of another person, RESTAMP may receive that
                person&rsquo;s name, contact details, property information or other data from the submitting User. The
                submitting User must have lawful authority to provide such information and must give the concerned
                individual any notice and obtain any consent required by law.
              </p>
            </>
          ),
        },
        {
          id: 'collection',
          title: '5. How We Collect Personal Data',
          body: (
            <>
              <p>
                We may collect personal data: (a) directly from you when you register, create or update an account,
                submit a listing, make an enquiry, purchase a plan or contact support; (b) automatically through
                cookies, logs and similar technologies when you use the Platform; (c) from authentication, payment,
                hosting, communication and other service providers in connection with a transaction or feature you use;
                and (d) from another User who submits information about you or a property, subject to that User having
                the necessary authority and complying with applicable law.
              </p>
              <p>
                You should provide information that is accurate, current and complete. If you provide personal data
                relating to another individual, you represent that you are authorised to do so and have provided any
                legally required notice and obtained any required consent.
              </p>
            </>
          ),
        },
        {
          id: 'purposes',
          title: '6. Purposes of Processing',
          body: (
            <>
              <p>
                Subject to applicable law and the notices and choices presented to you, RESTAMP may process personal data
                for the following specific purposes:
              </p>
              <ul>
                <li>To create, authenticate, administer and secure User accounts and to verify mobile numbers or supported login credentials.</li>
                <li>To enable Owners and authorised users to create, manage, update and remove property listings.</li>
                <li>To enable Buyers and other Users to search, view, save and enquire about properties.</li>
                <li>To transmit an enquiry or property-visit request to the relevant Owner, Broker or property contact and facilitate a response.</li>
                <li>To display listing information and contact details in accordance with the visibility settings and contact-access features selected or used on the Platform.</li>
                <li>To administer subscriptions, paid features, invoices, payment confirmations, refunds and transaction reconciliation.</li>
                <li>To provide customer support, address complaints, investigate misuse and communicate service or security notices.</li>
                <li>To maintain, troubleshoot, test and improve the security, reliability and functionality of the Platform.</li>
                <li>To detect, prevent and investigate fraud, impersonation, spam, unauthorised access, security incidents and violations of the Terms and Conditions.</li>
                <li>To comply with applicable laws, lawful directions, court orders and requests from competent authorities, and to establish, exercise or defend legal claims.</li>
                <li>To send promotional communications only where permitted by law and, where required, after obtaining your consent or providing an effective opt-out.</li>
              </ul>
              <p>
                RESTAMP shall not knowingly process personal data for a materially different purpose without providing
                the notice and obtaining the consent or identifying another lawful basis required by applicable law.
              </p>
            </>
          ),
        },
        {
          id: 'consent',
          title: '7. Notice, Consent and Your Choices',
          body: (
            <>
              <p>
                Where consent is the applicable basis for processing, RESTAMP will seek consent through an appropriate
                affirmative action and will provide a notice that is clear, specific and understandable, identifying the
                personal data sought and the purpose(s) for which it is proposed to be processed. The notice may be
                displayed in the website, application, registration flow, listing form or relevant feature.
              </p>
              <p>
                You may withdraw consent through the method made available for the relevant processing activity or by
                contacting the Privacy Contact stated in this Policy. The method for withdrawal shall be as accessible as
                the method by which consent was given, where required by law. Withdrawal will not affect the lawfulness
                of processing carried out before withdrawal. It may affect our ability to continue providing the feature
                or service for which the data is required.
              </p>
              <p>
                Where processing is permitted on a lawful ground other than consent, RESTAMP may continue such processing
                to the extent permitted by law. You may opt out of promotional communications through the unsubscribe
                mechanism in the communication or by contacting us. Essential service, account, security, legal and
                transaction messages may still be sent where necessary.
              </p>
            </>
          ),
        },
        {
          id: 'visibility',
          title: '8. Property Listings, Public Visibility and Contact Sharing',
          body: (
            <>
              <p>
                Property listings may be visible to the public or to relevant categories of Platform Users, depending on
                the feature, listing status and visibility settings. A listing may contain a property address or
                location, photographs, videos, price, description and contact or enquiry information. Before publishing
                a listing, the submitting User should review the information and remove confidential or unnecessary
                personal information from photographs, documents and descriptions.
              </p>
              <p>
                When a Buyer submits an enquiry or visit request, the information reasonably necessary to respond may be
                shared with the relevant Owner, Broker or property contact. Where a contact-access feature is used, the
                relevant contact information may be displayed or made available in accordance with that feature. Once
                information is made available to another User, RESTAMP cannot control that User&rsquo;s independent use,
                copying, storage or onward disclosure of the information. Users must use information obtained through
                the Platform lawfully and must not misuse it for spam, harassment, unsolicited marketing or any unlawful
                purpose.
              </p>
              <p>
                RESTAMP may remove, restrict or disable access to a listing or related information where reasonably
                necessary for security, legal compliance, investigation of a complaint, enforcement of the Terms and
                Conditions or protection of Users, subject to applicable law.
              </p>
            </>
          ),
        },
        {
          id: 'sharing',
          title: '9. Sharing and Disclosure of Personal Data',
          body: (
            <>
              <h3>9.1 With other Users</h3>
              <p>
                We may disclose listing information, enquiry details, visit requests and relevant contact information to
                the Owner, Broker, Buyer or property contact concerned, to the extent reasonably necessary to operate the
                marketplace feature requested or used by you.
              </p>

              <h3>9.2 With service providers and processors</h3>
              <p>
                We may engage hosting and cloud infrastructure providers, OTP/SMS and email providers, authentication
                providers (including Google, where enabled), payment gateways, analytics and diagnostic providers,
                customer-support tools, security vendors and other technology or operational service providers. They may
                process personal data only for the services they provide to RESTAMP, under appropriate contractual,
                confidentiality and security obligations and subject to applicable law.
              </p>

              <h3>9.3 For legal, regulatory and safety reasons</h3>
              <p>
                We may disclose information where we reasonably believe disclosure is required or authorised by
                applicable law, a court, tribunal, regulator, law-enforcement agency or other competent authority; or is
                reasonably necessary to investigate fraud, protect the rights, property or safety of RESTAMP, Users or
                the public, or establish, exercise or defend legal claims. We will assess the legal validity and scope of
                a request where reasonably practicable.
              </p>

              <h3>9.4 Corporate transactions</h3>
              <p>
                In connection with a proposed or completed merger, acquisition, restructuring, financing, sale of assets
                or transfer of business, relevant information may be disclosed to the extent necessary for the
                transaction, subject to appropriate confidentiality safeguards and applicable law.
              </p>
              <p>
                RESTAMP does not offer personal data as an independent commercial data product or authorise service
                providers to sell personal data obtained through RESTAMP. This does not prevent disclosures expressly
                described in this Policy or otherwise permitted or required by law.
              </p>
            </>
          ),
        },
        {
          id: 'transfers',
          title: '10. International Processing and Transfers',
          body: (
            <p>
              Some service providers may store or process information in locations outside India. Where personal data is
              transferred outside India, RESTAMP will do so subject to applicable Indian law, including any
              restrictions, conditions or requirements imposed by the Central Government. RESTAMP will take reasonable
              steps to ensure that relevant service providers are subject to appropriate contractual and security
              obligations. Details of material service-provider locations may be provided upon a reasonable privacy
              request, subject to security and confidentiality considerations.
            </p>
          ),
        },
        {
          id: 'cookies',
          title: '11. Cookies and Similar Technologies',
          body: (
            <p>
              The website may use cookies, pixels, SDKs and similar technologies to maintain sessions, remember
              preferences, support security, measure performance and understand usage. Strictly necessary technologies
              may be used to operate the Platform. Where required by law, non-essential analytics, personalisation or
              advertising technologies will be activated only after obtaining the required consent. You may manage
              available cookie choices through the website controls and browser settings. Blocking certain cookies may
              affect Platform functionality.
            </p>
          ),
        },
        {
          id: 'security',
          title: '12. Data Security and Personal Data Breaches',
          body: (
            <>
              <p>
                RESTAMP will implement and maintain reasonable technical and organisational safeguards appropriate to the
                nature, volume and risks of the personal data processed. Depending on the system and data involved,
                safeguards may include access controls, authentication controls, encryption or masking where
                appropriate, secure transmission, backups, logging, monitoring, vulnerability management, staff
                confidentiality obligations and contractual security requirements for processors.
              </p>
              <p>
                No method of transmission or storage is completely secure. Users must protect their devices, OTPs,
                passwords and email accounts, avoid sharing authentication credentials and promptly notify RESTAMP of
                suspected unauthorised access.
              </p>
              <p>
                If RESTAMP becomes aware of a personal data breach, it will assess, contain, investigate and remediate
                the incident and provide notices to affected individuals and competent authorities within the manner and
                timelines required by applicable law. Such notices may describe the nature and extent of the breach,
                likely consequences, mitigation measures, steps individuals can take and a contact for further queries.
              </p>
            </>
          ),
        },
        {
          id: 'retention',
          title: '13. Data Retention, Erasure and Account Closure',
          body: (
            <>
              <span id="delete-account" className="block scroll-mt-24" />
              <p>
                RESTAMP will retain personal data only for as long as reasonably necessary for the purpose for which it
                was collected, for the continued provision of the relevant service, and for compliance with applicable
                legal, accounting, tax, payment, dispute-resolution, security and record-keeping requirements.
              </p>
              <p>
                When the purpose has been fulfilled and retention is no longer necessary or legally required, RESTAMP
                will erase or anonymise the personal data in accordance with its retention schedule and applicable law.
                Certain transaction records, consent records, security logs, complaint records and information required
                for legal claims or regulatory obligations may be retained for the period required by law, even if an
                account is closed or a deletion request is made.
              </p>
              <p>
                Where applicable law or the DPDP Rules require a minimum retention period for specified data or logs,
                RESTAMP will comply with that requirement. Account closure or deletion may not result in immediate
                deletion from backups, archived records or systems where retention is legally required; such data will
                be protected and deleted in accordance with the applicable retention cycle.
              </p>
              <p>
                RESTAMP may notify inactive Users before erasing data where such notice is required by law or its
                applicable retention process. The User may be required to log in or contact RESTAMP to continue using the
                service, where legally permissible.
              </p>
            </>
          ),
        },
        {
          id: 'rights',
          title: '14. Your Rights and How to Exercise Them',
          body: (
            <>
              <p>Subject to the DPDP Act and other applicable law, you may be entitled to:</p>
              <ul>
                <li>Obtain information about personal data being processed and a summary of the processing activities, as provided by law.</li>
                <li>Request correction, completion or updating of inaccurate or incomplete personal data.</li>
                <li>Request erasure of personal data for which the purpose of processing is no longer served, subject to lawful retention requirements.</li>
                <li>Withdraw consent where processing is based on consent.</li>
                <li>Use the grievance-redressal mechanism and, where applicable, nominate another individual to exercise rights in the event of death or incapacity.</li>
                <li>Seek available remedies or approach the competent authority in accordance with applicable law.</li>
              </ul>
              <p>
                Submit a request to {privacyMail('Privacy Rights Request')} with the subject &ldquo;Privacy Rights
                Request&rdquo;. Please identify the account or listing concerned and specify the request. RESTAMP may
                seek reasonable information to verify your identity and prevent unauthorised disclosure or deletion. We
                will respond within the period prescribed by applicable law and may refuse or limit a request where
                permitted by law, explaining the reason where required.
              </p>
              <p>
                You may also raise a grievance through the contact details in Section 18. The applicable
                grievance-resolution period will be published on the Platform and will not exceed the period prescribed
                by law.
              </p>
            </>
          ),
        },
        {
          id: 'children',
          title: '15. Children and Persons Requiring a Lawful Guardian',
          body: (
            <>
              <p>
                The Platform is intended for persons legally capable of entering into and using the relevant
                property-related services. RESTAMP does not knowingly invite children to create accounts or submit
                personal data independently. Where processing of a child&rsquo;s personal data is permitted and
                necessary, RESTAMP will obtain verifiable parental or lawful guardian consent and implement the
                safeguards required by applicable law. If you believe a child has provided personal data in breach of
                this Policy, please contact the Privacy Contact.
              </p>
              <p>
                Where applicable law requires consent from a lawful guardian for processing personal data of a person
                who has a legally recognised guardian, RESTAMP will follow the applicable verification and consent
                requirements.
              </p>
            </>
          ),
        },
        {
          id: 'third-party',
          title: '16. Third-Party Services and Links',
          body: (
            <p>
              The Platform may contain links to or integrations with third-party websites, applications, maps,
              authentication tools, payment services or communication services. Your use of those services may be
              governed by their own terms and privacy policies. RESTAMP does not control independent third-party
              platforms and is not responsible for their privacy practices. You should review their policies before
              submitting information directly to them.
            </p>
          ),
        },
        {
          id: 'responsibilities',
          title: '17. User Responsibilities',
          body: (
            <ul>
              <li>Provide accurate and lawful information and promptly update material changes to your account or listing.</li>
              <li>Upload only photographs, documents, contact details and property information that you own or are authorised to submit and publish.</li>
              <li>Do not upload another person&rsquo;s personal data unless you have lawful authority and have provided any required notice and obtained any required consent.</li>
              <li>Do not publish identity documents, bank details, signatures, access credentials or other confidential information in a public listing unless specifically required through a secure and authorised process.</li>
              <li>Do not scrape, harvest, copy, sell, misuse or unlawfully disclose personal data or contact information obtained through the Platform.</li>
              <li>Keep your password, OTP and authentication devices confidential and report suspected account compromise promptly.</li>
            </ul>
          ),
        },
        {
          id: 'grievance',
          title: '18. Grievance Redressal and Privacy Contact',
          body: (
            <>
              <p>For privacy questions, requests, complaints or grievances, contact the designated person below:</p>
              <ul>
                <li><strong>Legal Entity Name:</strong> {LEGAL.legalName}</li>
                <li><strong>Grievance Officer / Privacy Contact:</strong> {LEGAL.grievanceOfficer.name}</li>
                <li><strong>Postal Address:</strong> {LEGAL.address}</li>
                <li><strong>Email:</strong> {privacyMail('Privacy grievance')}</li>
                <li><strong>Website:</strong> <a href={LEGAL.websiteUrl}>{LEGAL.websiteUrl}</a></li>
                <li><strong>Acknowledgement / response process:</strong> {LEGAL.grievanceOfficer.process}</li>
              </ul>
              <p>
                Please include sufficient details to identify the account and the nature of the concern. RESTAMP may
                request reasonable verification before acting on a request. Complaints will be acknowledged, examined and
                resolved within the period required by applicable law. Where the law provides a right to approach the
                Data Protection Board or another competent authority after following the prescribed process, this Policy
                does not restrict that right.
              </p>
            </>
          ),
        },
        {
          id: 'changes',
          title: '19. Changes to This Policy',
          body: (
            <p>
              RESTAMP may revise this Policy to reflect changes in the Platform, data practices, service providers,
              technology or applicable law. The revised version will be published on the website or application with an
              updated &ldquo;Last Updated&rdquo; date. Where a change materially affects the purposes or manner of
              processing, RESTAMP will provide additional notice and obtain fresh consent where required by law.
              Continued use of the Platform shall not be treated as consent where a separate affirmative consent is
              legally required.
            </p>
          ),
        },
        {
          id: 'law',
          title: '20. Governing Law and Jurisdiction',
          body: (
            <p>
              This Policy shall be governed by the laws of India, including, to the extent applicable and in force from
              time to time, the Digital Personal Data Protection Act, 2023 and the rules made thereunder, and other
              applicable Indian laws. Subject to mandatory statutory remedies and the jurisdiction of competent
              authorities, courts at {LEGAL.jurisdiction}, India shall have jurisdiction over disputes arising out of or
              in connection with this Policy.
            </p>
          ),
        },
      ]}
    />
  );
}
