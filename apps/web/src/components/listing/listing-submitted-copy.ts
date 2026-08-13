/** Post-submit confirmation — pending review, not live. */

export const LISTING_SUBMITTED_COPY = {
  title: "Listing Submitted",
  statusLabel: "Pending Review",
  /** Full body as specified for the confirmation state. */
  paragraphs: [
    "Listing Submitted. Your vehicle has been submitted to Carasta for review.",
    "We’ll review your listing and reach out if we have any questions. Once your auction start date has been selected, we’ll notify you.",
    "You can view your pending listing anytime in the Auctions tab on your profile.",
  ],
  viewListing: "View Listing",
  createAnother: "Create Another Listing",
} as const;
