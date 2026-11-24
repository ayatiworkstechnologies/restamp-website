/**
 * Company details shown in the Terms & Conditions, Privacy Policy and other
 * legal pages. Update them here and every legal page picks up the change.
 *
 * CONFIRM BEFORE RELEASE: the registered legal name, registered office address
 * and a named Grievance Officer are required by the IT (Intermediary
 * Guidelines) Rules, 2021 and the Digital Personal Data Protection Act, 2023,
 * and are checked by the App Store and Google Play reviewers.
 */
export const LEGAL = {
  brand: 'Restamp',
  /** Registered legal entity name (e.g. "Restamp Realty Private Limited"). */
  legalName: 'RESTAMP Real Estate Marketplace',
  /** Registered office address. */
  address: '5/69, Kalaimagal Nagar 3rd Main Road, Ekkattuthangal, Chennai 600032, Tamil Nadu, India',
  website: 'www.restamp.in',
  supportEmail: 'support@restamp.in',
  /** Grievance Officer (IT Rules 2021, Rule 3(2)) and DPDP Act contact. Add the officer's name. */
  grievanceOfficer: {
    name: 'Grievance Officer',
    email: 'support@restamp.in',
    hours: 'Monday to Saturday, 10:00 am to 6:00 pm IST',
  },
  /** City whose courts have jurisdiction. */
  jurisdiction: 'Chennai, Tamil Nadu',
  apps: {
    ios: 'Restamp on the Apple App Store',
    android: 'Restamp on Google Play',
    bundleId: 'com.restamp.app',
  },
} as const;
