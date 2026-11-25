import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/legal/LegalPage';
import { LEGAL } from '@/lib/legal-entity';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Restamp',
  description:
    'Terms and Conditions governing access to and use of the RESTAMP website and RESTAMP Mobile Application, including listings, brokerage disclosures, subscriptions, liability and grievance redressal.',
};

const mail = (subject?: string) => (
  <a href={`mailto:${LEGAL.grievanceOfficer.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`}>
    {LEGAL.grievanceOfficer.email}
  </a>
);

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and Conditions"
      effectiveDate={LEGAL.effectiveDate}
      updated={LEGAL.effectiveDate}
      intro={
        <>
          <p className="text-sm text-slate-500">
            Website:{' '}
            <a href={LEGAL.websiteUrl}>{LEGAL.websiteUrl}</a> · Application: RESTAMP Mobile Application
          </p>
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800">
            IMPORTANT NOTICE: PLEASE READ THESE TERMS CAREFULLY. BY REGISTERING, ACCESSING, BROWSING, POSTING A LISTING,
            MAKING AN ENQUIRY, PURCHASING A SUBSCRIPTION OR OTHERWISE USING RESTAMP, YOU CONFIRM THAT YOU HAVE READ,
            UNDERSTOOD AND AGREED TO THESE TERMS AND THE <Link href="/privacy-policy">PRIVACY POLICY</Link>. IF YOU DO
            NOT AGREE, YOU MUST NOT ACCESS OR USE THE PLATFORM.
          </p>
        </>
      }
      sections={[
        {
          id: 'operator',
          title: '1. Operator, Scope and Acceptance',
          body: (
            <>
              <p>
                These Terms and Conditions (&ldquo;Terms&rdquo;) govern access to and use of the RESTAMP website, mobile
                application, software, features, listings, communications and related services (collectively, the
                &ldquo;Platform&rdquo;). The Platform is operated by {LEGAL.legalName}, a company incorporated under the
                laws of India, having its registered office at {LEGAL.address} (&ldquo;RESTAMP&rdquo;,
                &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;). RESTAMP is the brand
                and trading name of the Company.
              </p>
              <p>
                These Terms constitute an electronic record and are intended to be accepted electronically in accordance
                with applicable Indian law. Acceptance may be evidenced by clicking &ldquo;I Agree&rdquo;, ticking an
                acceptance box, OTP verification, account registration, purchase of a plan, posting a listing or
                continued use after reasonable notice of revised Terms. The User should retain a copy of the Terms.
              </p>
              <p>
                These Terms must be read with the <Link href="/privacy-policy">Privacy Policy</Link>, applicable{' '}
                <Link href="/refund-policy">Refund/Cancellation Policy</Link>, listing rules, subscription plan
                conditions and any additional terms displayed for a particular feature. In case of conflict, the specific
                feature or plan terms shall prevail only for that feature, and applicable law shall prevail over all
                contractual terms.
              </p>
            </>
          ),
        },
        {
          id: 'definitions',
          title: '2. Definitions',
          body: (
            <ul>
              <li>
                <strong>&ldquo;User&rdquo;</strong> means every person or entity accessing or using the Platform,
                including a Buyer, Owner, Broker, advertiser or visitor.
              </li>
              <li>
                <strong>&ldquo;Buyer&rdquo;</strong> includes a person seeking to purchase, lease or rent property or
                making an enquiry in relation to property.
              </li>
              <li>
                <strong>&ldquo;Owner&rdquo;</strong> means the owner, co-owner, lawful title holder or a person holding
                valid written authority to advertise or deal with a property.
              </li>
              <li>
                <strong>&ldquo;Broker&rdquo;</strong> means a real estate agent, broker, channel partner or intermediary
                using the Platform in a professional or commercial capacity.
              </li>
              <li>
                <strong>&ldquo;Listing&rdquo;</strong> means any property advertisement or information uploaded or
                displayed on the Platform.
              </li>
              <li>
                <strong>&ldquo;User Content&rdquo;</strong> includes listings, photographs, videos, documents,
                descriptions, messages, reviews, contact details and other material submitted by a User.
              </li>
              <li>
                <strong>&ldquo;Subscription&rdquo;</strong> means a paid or free plan, membership, listing package, lead
                package or other paid feature.
              </li>
              <li>
                <strong>&ldquo;Transaction&rdquo;</strong> means any sale, purchase, lease, licence, rental,
                development, joint venture, brokerage or other arrangement between Users.
              </li>
            </ul>
          ),
        },
        {
          id: 'eligibility',
          title: '3. Eligibility, Authority and Account',
          body: (
            <>
              <p>
                A User must be at least 18 years of age, legally competent to contract and not prohibited by law from
                using the Platform. A person acting for a company, partnership, trust, HUF or other entity represents
                that he or she has due authority to bind that entity.
              </p>
              <p>
                Users shall provide true, current, complete and verifiable information, including identity, contact
                particulars, role and authority. RESTAMP may request identity, business, address, ownership or
                authorization documents. Submission of documents does not amount to certification of their genuineness,
                legal sufficiency or title by RESTAMP.
              </p>
              <p>
                Users are responsible for safeguarding their devices, OTPs, passwords and accounts and for all activity
                through their accounts. Users must promptly notify RESTAMP of suspected unauthorized access. RESTAMP
                shall not be liable for loss caused by a User&rsquo;s failure to secure credentials, subject always to
                liabilities that cannot lawfully be excluded.
              </p>
              <p>
                Unless expressly permitted, one person shall maintain one account per role or such account structure as
                RESTAMP may approve. Fake, duplicate, automated, proxy or impersonation accounts are prohibited. RESTAMP
                may verify, restrict, merge, suspend or close accounts where reasonably necessary.
              </p>
            </>
          ),
        },
        {
          id: 'nature-of-platform',
          title: '4. Nature of Platform; No Brokerage or Transactional Role',
          body: (
            <>
              <p>
                RESTAMP provides an online technology and advertising marketplace intended to facilitate discovery and
                communication between Users. Unless a separate written agreement expressly states otherwise, RESTAMP is
                not the owner, seller, purchaser, lessor, lessee, developer, builder, promoter, property manager, broker,
                agent, legal adviser, valuer, surveyor, escrow agent or representative of any User.
              </p>
              <p>
                RESTAMP is not a party to, negotiator of, or guarantor for any Transaction. No listing, enquiry, contact,
                verification indicator, subscription or communication creates an agency, partnership, joint venture,
                employment, fiduciary or representative relationship between RESTAMP and a User.
              </p>
              <p>
                Users independently negotiate and conclude Transactions, conduct due diligence, execute documents, pay
                consideration and comply with applicable laws. RESTAMP does not receive, hold, transfer or safeguard
                token advances, deposits, rent, sale consideration or brokerage between Users unless a separately
                documented service expressly provides otherwise.
              </p>
              <p>
                Nothing in this clause is intended to contract out of any licence, registration, disclosure, consumer,
                intermediary or other statutory obligation that applies to RESTAMP on the facts or under applicable law.
                If RESTAMP undertakes any additional regulated activity, the relevant separate terms and statutory
                requirements shall apply.
              </p>
            </>
          ),
        },
        {
          id: 'due-diligence',
          title: '5. Property Information, Verification and Due Diligence',
          body: (
            <>
              <p>
                All property information is supplied by Users or third-party sources. RESTAMP does not independently
                investigate or guarantee ownership, title, chain of title, possession, boundaries, measurements,
                classification, land use, zoning, access, road width, survey particulars, encumbrances, litigation,
                acquisition, tenancy, approvals, building condition, structural safety, amenities, utilities, RERA
                status, CMDA/DTCP/local-body approval, tax status, price, marketability or legal compliance.
              </p>
              <p>
                Any &ldquo;verified&rdquo;, &ldquo;checked&rdquo;, &ldquo;featured&rdquo;, &ldquo;premium&rdquo;,
                &ldquo;genuine&rdquo; or similar label means only that a limited check may have been performed in
                accordance with the stated scope and at the stated time. It is not a title certificate, legal opinion,
                valuation, approval, guarantee or assurance that the information remains current. RESTAMP may change or
                withdraw a verification indicator.
              </p>
              <p>
                Before paying any amount or entering into a Transaction, Buyers must independently inspect the property
                and verify original title deeds, parent documents, encumbrance certificates,
                patta/chitta/adangal/A-register/FMB or equivalent revenue records, approvals, sanctioned plans, RERA
                registration where applicable, identity and authority of the counterparty, possession, access, litigation
                and all other relevant matters through qualified professionals.
              </p>
              <p>
                Users must not rely solely on photographs, videos, maps, floor plans, virtual tours, descriptions,
                chatbot responses, badges or statements appearing on the Platform. Measurements, distances, areas,
                boundaries and location pins are indicative unless expressly confirmed by competent records and on-site
                verification.
              </p>
            </>
          ),
        },
        {
          id: 'owners',
          title: '6. Responsibilities of Owners',
          body: (
            <>
              <p>
                The Owner must be the lawful owner or hold current, valid and sufficient written authority from every
                person whose consent or authority is legally required to advertise the property.
              </p>
              <p>
                The Owner warrants that the Listing, documents, photographs, price, area, location, approvals,
                availability and statements are true, complete, current and not misleading.
              </p>
              <p>
                The Owner must disclose co-ownership, succession issues, powers of attorney, tenancy, possession
                disputes, mortgages, charges, litigation, acquisition notices, restrictions, approvals and other material
                facts affecting the property.
              </p>
              <p>
                The Owner must have the right to upload all documents, photographs and personal information and must
                obtain all necessary consents.
              </p>
              <p>
                The Owner must promptly update, pause or remove a Listing once the property is sold, leased, withdrawn,
                unavailable or materially changed.
              </p>
              <p>
                The Owner shall deal directly and lawfully with prospective Buyers and shall not use the Platform to
                advertise illegal, prohibited or unauthorized transactions.
              </p>
            </>
          ),
        },
        {
          id: 'brokers',
          title: '7. Responsibilities of Brokers and Agents',
          body: (
            <>
              <p>
                A Broker shall obtain and maintain all registrations, licences and approvals required under the Real
                Estate (Regulation and Development) Act, 2016, applicable State RERA rules and all other applicable laws.
                A Broker shall provide its registration details when required and shall not advertise or facilitate a
                project or transaction in violation of RERA or other law.
              </p>
              <p>
                A Broker warrants that it has valid written authority from the Owner, accurately identifies the Owner and
                its own role, discloses brokerage/commission and other charges before they become payable, and does not
                falsely claim exclusivity, ownership, authorization or approval.
              </p>
              <p>
                A Broker shall not upload duplicate, bait, fictitious or unauthorized listings; divert leads through
                deception; collect money without authority; make false assurances; conceal material facts; or use another
                broker&rsquo;s credentials or documents. RESTAMP may seek supporting authorization and registration
                records and may remove or restrict listings pending verification.
              </p>
            </>
          ),
        },
        {
          id: 'buyers',
          title: '8. Responsibilities of Buyers and Other Enquirers',
          body: (
            <>
              <p>
                Buyers shall use contact details and information only for genuine property-related enquiries and shall not
                harass, threaten, spam, stalk, scrape, publish or commercially exploit another User&rsquo;s details.
                Buyers shall independently verify the property and counterparty and shall not make payment based solely on
                a Listing, message, call, badge or representation appearing on the Platform.
              </p>
              <p>
                Users must exercise reasonable care during site visits and meetings, verify the identity of persons they
                meet, avoid carrying or transferring large sums in unsafe circumstances and promptly report suspicious
                conduct. RESTAMP does not supervise site visits or guarantee the safety, conduct or identity of persons
                met through the Platform.
              </p>
            </>
          ),
        },
        {
          id: 'ip',
          title: '9. Listings, Content and Intellectual Property Licence',
          body: (
            <>
              <p>
                The User retains ownership of User Content, subject to the rights and licences granted in these Terms.
                The User grants RESTAMP a non-exclusive, worldwide, royalty-free licence, for the duration reasonably
                necessary to operate and promote the Platform, to host, store, reproduce, display, distribute,
                communicate, adapt for formatting, create thumbnails, index and technically process User Content on the
                Platform and through service providers and distribution channels used for the Platform.
              </p>
              <p>
                The licence includes the right to display listings and related material to other Users and to use listing
                excerpts or promotional material to market the Platform, subject to the{' '}
                <Link href="/privacy-policy">Privacy Policy</Link> and applicable law. The User confirms that it has all
                rights and consents required to grant this licence. The licence shall continue for copies already shared,
                cached, backed up, archived or retained for legal, security, dispute-resolution or compliance purposes, to
                the extent permitted by law.
              </p>
              <p>
                RESTAMP may, but is not obliged to, review, moderate, reject, disable, edit for formatting, demote or
                remove any Listing or User Content where it reasonably considers this necessary for compliance, safety,
                quality, rights protection or Platform integrity. Such action does not constitute an admission that
                RESTAMP has verified other content or assumed responsibility for it.
              </p>
              <p>
                The RESTAMP name, logo, software, design, databases, layout, text and other Company materials are owned by
                or licensed to RESTAMP. No User receives ownership or an unrestricted licence to copy, scrape, reverse
                engineer, reproduce, sell or commercially exploit them.
              </p>
            </>
          ),
        },
        {
          id: 'conduct',
          title: '10. Prohibited Conduct',
          body: (
            <>
              <p>Users shall not, directly or indirectly:</p>
              <ul>
                <li>upload false, misleading, fraudulent, duplicate, unlawful or unauthorized listings or documents;</li>
                <li>
                  impersonate another person or misstate identity, ownership, authority, registration or professional
                  status;
                </li>
                <li>commit or facilitate fraud, cheating, forgery, money laundering, benami transactions, bribery or any unlawful activity;</li>
                <li>
                  scrape, crawl, harvest, copy, extract, index, compile, resell or commercially exploit listings, leads,
                  contact details or Platform data without prior written permission;
                </li>
                <li>
                  use contact details obtained through the Platform for spam, harassment, intimidation, unsolicited
                  marketing or unrelated purposes;
                </li>
                <li>bypass access controls, subscription restrictions, contact limits, security systems or technical protections;</li>
                <li>upload malware, malicious code, harmful files or content infringing intellectual property, privacy or other rights;</li>
                <li>publish defamatory, obscene, threatening, hateful or otherwise unlawful material;</li>
                <li>interfere with Platform operations, servers, networks, other accounts or service providers;</li>
                <li>
                  circumvent RESTAMP&rsquo;s paid features, manipulate ranking or enquiry metrics, or create artificial
                  leads or reviews;
                </li>
                <li>use the Platform in a manner that exposes RESTAMP or other Users to legal, regulatory, security or reputational risk.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'enforcement',
          title: '11. Platform Discretion, Moderation and Enforcement',
          body: (
            <>
              <p>
                To protect Users and the Platform, RESTAMP may, acting reasonably and subject to applicable law, request
                additional information, verify contact details, flag or label content, restrict visibility, disable
                contact access, remove or suspend a Listing, block an account, suspend a Subscription feature, preserve
                relevant records, report suspected unlawful conduct to competent authorities or take other proportionate
                measures.
              </p>
              <p>
                RESTAMP may act with or without prior notice where urgent action is reasonably required to prevent fraud,
                harm, unlawful activity, security threats, evidence destruction or continuing violation. Where
                practicable, RESTAMP may provide a reason and an opportunity to submit an explanation or appeal. RESTAMP
                is not required to disclose confidential fraud-detection methods, security controls or information whose
                disclosure is prohibited by law.
              </p>
              <p>
                A User shall not be entitled to compensation merely because content is moderated or an account or feature
                is restricted in good faith under these Terms. This does not affect any mandatory statutory remedy or a
                User&rsquo;s right to challenge an action through the applicable grievance mechanism.
              </p>
            </>
          ),
        },
        {
          id: 'subscriptions',
          title: '12. Subscriptions, Fees, Taxes and Payments',
          body: (
            <>
              <p>
                Subscription features, prices, validity periods, usage limits, taxes and renewal terms shall be
                displayed before purchase. A Subscription is activated after successful payment confirmation. Unless
                expressly stated, a Subscription provides access to specified Platform features only and does not
                guarantee leads, views, calls, site visits, conversions, sales, rentals or any commercial result.
              </p>
              <p>
                Fees are payable in Indian Rupees and applicable taxes, including GST, shall be charged as required by
                law. Invoices and tax documents shall be issued in accordance with applicable law. Payments may be
                processed by third-party payment service providers and are subject to their terms and security
                procedures.
              </p>
              <p>
                RESTAMP does not store card numbers, banking passwords or UPI PINs where payment processing is handled by
                a third-party gateway. RESTAMP is not responsible for delays, declines, reversals or failures
                attributable to banks, payment gateways, telecom networks or other third parties, except to the extent
                caused by RESTAMP&rsquo;s own breach or liability imposed by law.
              </p>
              <p>
                A Subscription is personal or business-account specific, non-transferable and may not be resold, shared
                or sublicensed unless expressly permitted. RESTAMP may revise prices and plans prospectively. A price
                change shall not alter the paid price for the unexpired portion of an existing fixed-term Subscription.
              </p>
              <p>
                Unless a specific plan or applicable law provides otherwise, fees for a Subscription that has been
                activated or made available are non-refundable. This shall not exclude refunds required by law or for
                duplicate, failed, unauthorized or incorrectly processed charges. Any refund request shall be handled
                under the published <Link href="/refund-policy">Refund/Cancellation Policy</Link>. No clause shall permit
                RESTAMP to retain money where such retention is prohibited by law.
              </p>
              <p>
                Where auto-renewal is offered, the renewal amount, frequency and cancellation method shall be disclosed
                before consent. Users may cancel future renewal through the available account or payment-provider
                process. Cancellation of renewal does not automatically refund the current paid period.
              </p>
              <p>
                All token amounts, deposits, rents, sale consideration, brokerage and other payments between Users are
                outside the Platform unless a separate written service expressly states otherwise. RESTAMP is not an
                escrow holder, trustee or stakeholder for such funds and shall not be responsible for their collection,
                refund, appropriation or settlement.
              </p>
            </>
          ),
        },
        {
          id: 'communications',
          title: '13. Communications and Consent',
          body: (
            <>
              <p>
                The Platform may facilitate calls, messages, enquiries, chat, notifications and visit requests. Users are
                responsible for the content, accuracy and lawfulness of their communications and for their conduct online
                and offline. RESTAMP does not guarantee delivery, receipt, response or authenticity of communications
                between Users.
              </p>
              <p>
                Users may receive essential service communications, security alerts, transaction-related messages and
                legal notices. Promotional communications shall be handled in accordance with applicable consent and
                opt-out requirements. A User may opt out of promotional messages through the available mechanism, without
                affecting essential service or legally required communications.
              </p>
            </>
          ),
        },
        {
          id: 'third-party',
          title: '14. Third-Party Services, Links and Information',
          body: (
            <>
              <p>
                The Platform may rely on third-party services including cloud hosting, maps, analytics, identity or OTP
                providers, payment gateways, communication providers and social login. Such services may be governed by
                separate terms and privacy policies. RESTAMP does not control third-party services and does not
                guarantee their availability, accuracy or security, but this clause does not exclude liability that
                applicable law places on RESTAMP.
              </p>
              <p>
                Maps, geolocation, area calculations, automated recommendations and other technology-generated
                information are indicative and may contain errors. Users must independently confirm material information
                before relying on it.
              </p>
            </>
          ),
        },
        {
          id: 'disclaimers',
          title: '15. Disclaimers and Availability',
          body: (
            <>
              <p>
                To the maximum extent permitted by law, the Platform and its features are provided on an &ldquo;as
                available&rdquo; basis. RESTAMP does not warrant uninterrupted, error-free, secure or continuous
                availability, compatibility with every device, or that defects will always be corrected immediately.
              </p>
              <p>
                RESTAMP does not warrant the accuracy, completeness, legality, availability or quality of User Content or
                any property, User, Broker, lead or Transaction. RESTAMP does not promise any minimum number or quality
                of listings, enquiries, impressions, leads, visits or completed Transactions.
              </p>
              <p>
                The disclaimers in these Terms allocate responsibility for matters controlled by Users and third
                parties. They shall not exclude any express undertaking made by RESTAMP in a separate written agreement
                or any right or liability that cannot lawfully be excluded.
              </p>
            </>
          ),
        },
        {
          id: 'liability',
          title: '16. Limitation of Liability',
          body: (
            <>
              <p>
                To the maximum extent permitted by applicable law, RESTAMP and its directors, officers, employees,
                affiliates, contractors and service providers shall not be liable for indirect, incidental, special,
                exemplary or consequential loss, loss of profit, revenue, business, opportunity, goodwill, anticipated
                savings or data, arising out of or connected with use of the Platform.
              </p>
              <p>
                Subject to the exceptions below, RESTAMP&rsquo;s aggregate liability arising out of or in connection with
                these Terms or the Platform shall not exceed the Subscription fees actually paid by the affected User to
                RESTAMP for the relevant service during the three (3) months immediately preceding the event giving rise
                to the claim, or {LEGAL.liabilityCapInr}, whichever is lower.
              </p>
              <p>
                The above exclusions and cap shall not apply to liability that cannot be excluded or limited under
                applicable law, including where applicable fraud, wilful misconduct, gross negligence, death or personal
                injury caused by negligence, breach of mandatory data-protection obligations, or any mandatory consumer
                remedy. Nothing in these Terms restricts a consumer from exercising a non-waivable statutory right.
              </p>
              <p>
                RESTAMP shall not be liable for loss arising from a User&rsquo;s decision to transact, a defect in
                property or title, inaccurate User Content, acts or omissions of another User, failure to conduct due
                diligence, payment made directly to another User, or third-party service failure, except to the extent
                such loss is directly caused by RESTAMP&rsquo;s own legally actionable act or omission.
              </p>
            </>
          ),
        },
        {
          id: 'indemnity',
          title: '17. User Indemnity',
          body: (
            <>
              <p>
                To the maximum extent permitted by law, each User (&ldquo;Indemnifying User&rdquo;) shall indemnify,
                defend and hold harmless RESTAMP, the Company, its affiliates and each of their directors, officers,
                employees, agents, contractors and service providers (&ldquo;Indemnified Parties&rdquo;) from and
                against third-party claims, demands, proceedings, losses, damages, liabilities, penalties, costs and
                reasonable legal fees arising out of or relating to:
              </p>
              <ul>
                <li>the User&rsquo;s Listing, User Content, documents, representations or omissions;</li>
                <li>
                  any defect in title, ownership, authority, possession, approval, registration or legal status of
                  property advertised by the User;
                </li>
                <li>
                  fraud, forgery, misrepresentation, unauthorized listing, unlawful conduct or infringement of third-party
                  rights by the User;
                </li>
                <li>
                  any Transaction, payment, brokerage, deposit, refund, agreement or dispute between the User and another
                  person;
                </li>
                <li>breach of these Terms or applicable law by the User; or</li>
                <li>negligent, reckless or wilful acts or omissions of the User.</li>
              </ul>
              <p>
                RESTAMP shall give reasonable notice of a claim where practicable and may participate in its defence
                through counsel of its choice. The User shall not settle a claim in a manner that admits liability on
                behalf of, imposes an obligation on, or prejudices an Indemnified Party without that party&rsquo;s prior
                written consent. This indemnity shall not apply to the extent a claim is finally determined to have
                resulted from the fraud or wilful misconduct of the Indemnified Party.
              </p>
            </>
          ),
        },
        {
          id: 'termination',
          title: '18. Suspension, Termination and Consequences',
          body: (
            <>
              <p>
                A User may stop using the Platform and request account closure through the available process. Account
                closure does not automatically cancel amounts already due, resolve pending disputes or entitle the User
                to a refund except as provided by law or the <Link href="/refund-policy">Refund Policy</Link>.
              </p>
              <p>
                RESTAMP may suspend, restrict or terminate access, remove listings or discontinue features where the
                User breaches these Terms, provides inaccurate information, creates risk, fails verification, violates
                law, receives credible complaints, fails to pay fees, or where required by a competent authority or
                reasonably necessary for Platform security or business continuity.
              </p>
              <p>
                On termination, the User&rsquo;s right to access the relevant services ceases. Clauses which by their
                nature should survive, including intellectual property, licences for retained content, disclaimers,
                liability, indemnity, dispute resolution, payment obligations and record retention, shall survive to the
                extent necessary and lawful.
              </p>
            </>
          ),
        },
        {
          id: 'privacy',
          title: '19. Privacy and Data Protection',
          body: (
            <>
              <p>
                Personal data shall be handled in accordance with the RESTAMP{' '}
                <Link href="/privacy-policy">Privacy Policy</Link> and applicable Indian data-protection and
                information-technology laws, including the Digital Personal Data Protection Act, 2023 and the rules and
                commencement notifications applicable from time to time. The applicability and commencement of particular
                statutory obligations may be phased; RESTAMP shall implement obligations as and when they become
                applicable.
              </p>
              <p>
                Users shall provide personal data lawfully and shall not upload or disclose another person&rsquo;s
                personal data, identity documents, contact details, photographs or property documents without a lawful
                basis and all required notices or consents. Users shall not use Platform data for unlawful profiling,
                unsolicited marketing, harassment or any purpose inconsistent with the{' '}
                <Link href="/privacy-policy">Privacy Policy</Link>.
              </p>
              <p>
                RESTAMP may retain records for security, dispute resolution, fraud prevention, legal compliance and
                responding to lawful requests, subject to applicable law and the{' '}
                <Link href="/privacy-policy">Privacy Policy</Link>. Nothing in these Terms authorises processing that is
                prohibited by applicable data-protection law.
              </p>
            </>
          ),
        },
        {
          id: 'grievance',
          title: '20. Grievance Redressal and Notices',
          body: (
            <>
              <p>
                Users may submit complaints through the contact details and grievance mechanism published on the
                Platform. RESTAMP shall acknowledge and process complaints within the timelines applicable to its legal
                classification and the nature of the complaint. A complaint involving unlawful content, impersonation,
                fraud, privacy, intellectual property or a property listing should include the relevant URL/listing ID,
                a clear description, supporting material and the complainant&rsquo;s contact details.
              </p>
              <ul>
                <li><strong>Company:</strong> {LEGAL.legalName}</li>
                <li><strong>Brand:</strong> RESTAMP</li>
                <li><strong>Registered Office:</strong> {LEGAL.address}</li>
                <li><strong>Grievance Officer:</strong> {LEGAL.grievanceOfficer.name}</li>
                <li><strong>Email:</strong> {mail('Grievance')}</li>
                <li><strong>Website:</strong> <a href={LEGAL.websiteUrl}>{LEGAL.websiteUrl}</a></li>
              </ul>
              <p>
                Notices to Users may be sent to the registered email address, mobile number, in-app notification or other
                contact details provided by the User. Users are responsible for keeping such details current. Legal
                notices shall also be served in any manner required by applicable law.
              </p>
            </>
          ),
        },
        {
          id: 'dispute-resolution',
          title: '21. Dispute Resolution, Arbitration and Jurisdiction',
          body: (
            <>
              <p>
                The parties shall first attempt in good faith to resolve disputes arising directly between RESTAMP and a
                User by submitting a written complaint to the Grievance Officer. If the dispute is not resolved within
                thirty (30) days, either party may pursue remedies available under applicable law.
              </p>
              <p>
                Subject to non-arbitrable matters, mandatory statutory forums and rights of consumers, disputes arising
                between RESTAMP and a User out of these Terms may be referred to arbitration under the Arbitration and
                Conciliation Act, 1996, as amended. The parties shall mutually appoint a sole independent arbitrator
                within thirty (30) days of a written request. If they fail to agree, the arbitrator shall be appointed
                in accordance with the Act by the competent court or institution. No unilateral appointment by RESTAMP is
                intended.
              </p>
              <p>
                The seat and legal place of arbitration shall be {LEGAL.jurisdiction}, India. Hearings may be conducted
                physically or virtually as determined by the arbitrator. The language shall be English. The award shall
                be reasoned and binding, subject to statutory rights of challenge.
              </p>
              <p>
                Subject to the foregoing and to mandatory jurisdiction conferred by consumer, property, data-protection
                or other applicable laws, courts at {LEGAL.jurisdiction} shall have jurisdiction over disputes arising
                from these Terms. Nothing in this clause prevents a User from approaching a consumer commission or other
                statutory authority having jurisdiction under applicable law.
              </p>
            </>
          ),
        },
        {
          id: 'changes',
          title: '22. Changes to Terms',
          body: (
            <p>
              RESTAMP may revise these Terms to reflect changes in the Platform, business model, security practices or
              applicable law. The revised version shall be published with an updated effective or revision date. Where
              required by law or where a material change affects Users&rsquo; rights, RESTAMP shall provide appropriate
              notice and obtain fresh consent where legally required. Continued use after the effective date may
              constitute acceptance only to the extent permitted by law. If a User does not agree to a material change,
              the User must stop using the affected service and may close the account, subject to accrued obligations.
            </p>
          ),
        },
        {
          id: 'general',
          title: '23. General Provisions',
          body: (
            <ul>
              <li>
                <strong>Entire Agreement:</strong> These Terms, the <Link href="/privacy-policy">Privacy Policy</Link>,{' '}
                <Link href="/refund-policy">Refund Policy</Link> and applicable plan-specific terms constitute the
                agreement between RESTAMP and the User concerning the Platform.
              </li>
              <li>
                <strong>Severability:</strong> If any provision is held invalid or unenforceable, it shall be modified to
                the minimum extent necessary, and the remaining provisions shall continue in force.
              </li>
              <li>
                <strong>No Waiver:</strong> Failure or delay in exercising a right is not a waiver of that right.
              </li>
              <li>
                <strong>Assignment:</strong> A User may not assign or transfer rights or obligations without
                RESTAMP&rsquo;s prior written consent. RESTAMP may assign or transfer its rights and obligations to an
                affiliate, successor or acquirer in connection with restructuring, merger, acquisition or business
                transfer, subject to applicable law.
              </li>
              <li>
                <strong>Force Majeure:</strong> RESTAMP shall not be liable for delay or failure caused by events beyond
                its reasonable control, including natural disasters, epidemics, war, civil disturbance, government action,
                power failure, cyberattack, telecom or internet outage, cloud-service failure, strikes or disruption of
                third-party services.
              </li>
              <li>
                <strong>Independent Relationship:</strong> These Terms do not create a partnership, joint venture,
                employment, franchise, agency or fiduciary relationship between RESTAMP and any User.
              </li>
              <li>
                <strong>No Third-Party Beneficiary:</strong> Except for the Indemnified Parties expressly identified in
                the indemnity clause, no person who is not a party to these Terms shall have a right to enforce them,
                subject to applicable law.
              </li>
              <li>
                <strong>Language:</strong> The English version shall prevail in case of inconsistency, to the extent
                permitted by law. Any translated version may be provided for convenience or statutory compliance.
              </li>
              <li>
                <strong>Electronic Records:</strong> RESTAMP may maintain electronic logs, OTP records, consent records,
                payment confirmations, communications and system records in accordance with applicable law. Their
                admissibility and evidentiary value shall be determined by the competent forum under applicable law.
              </li>
            </ul>
          ),
        },
        {
          id: 'acknowledgement',
          title: '24. Acknowledgement',
          body: (
            <p>
              By clicking &ldquo;I Agree&rdquo;, registering, accessing or using the Platform, the User confirms that the
              User has read and accepted these Terms, has authority to accept them, and agrees to comply with them and
              all applicable laws.
            </p>
          ),
        },
      ]}
    />
  );
}
