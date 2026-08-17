export interface FaqItem {
  question: string;
  answer: string[];
}

export interface FaqCategory {
  id: "bidding" | "selling" | "general";
  title: string;
  items: FaqItem[];
}

export const CARASTA_FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "bidding",
    title: "Bidding Questions",
    items: [
      {
        question: "Buyer Fees",
        answer: [
          "Buyers will pay 5% (up to $7,500) above the ending auction price to Carasta LLC. The buyer’s fee due to Carasta will be processed automatically to the payment method on file (via Stripe) after the auction has ended.",
          "First, 5% (up to $7,500) will be due to Carasta LLC through Stripe.",
          "ACH or Debit Card: no fee. Credit Card: 2.9%.",
          "Second, the ending bid price of the vehicle will be prompted via email to Caramel, for processing to complete the vehicle price.",
          "Caramel will hold funds in escrow until processing of both parties has been completed and verified.",
        ],
      },
      {
        question: "Financing Options",
        answer: [
          "Financing options are available through third-party sources via Caramel during the checkout process. Some users may not apply.",
        ],
      },
      {
        question: "Secure transactions",
        answer: [
          "Every transaction is securely processed through a third-party partnership (Caramel), ensuring funds for both buyers and sellers are validated and exchanged in sync with the transaction process.",
          "Documentation processing will be easy and worry-free. Guidance will be provided from financing and fund transfer to temporary and permanent DMV registration.",
          "Fund schedule: 50% of the final price will be released to the seller after both parties have signed off on proper paperwork. Once the vehicle has been delivered, the remaining 50% will be released from Caramel to the seller.",
        ],
      },
      {
        question: "Buy it now feature",
        answer: [
          "The Buy Now feature is optional depending on the seller’s choice. If selected, Buy Now is available for the initial 24 hours of the listing at an exclusive price.",
          "If Buy Now is not fulfilled after 24 hours, the auction will transition into an additional 6-day bidding period (9 days for premium).",
        ],
      },
      {
        question: "Canceling Bid",
        answer: [
          "Bids are non-cancellable. Bidding is serious, as agreed upon in the Terms & Conditions. Buyers will be held responsible for the commitment and bid they make.",
        ],
      },
      {
        question: "Reserve gauge / Meeting Reserve",
        answer: [
          "Reserve prices are optional when a seller is listing. When a reserve applies, buyers will be able to gauge progress on a metered tracker.",
          "If the reserve is not met, sellers can relist their vehicle within 24 hours with no listing fee, with the exception of a lower reserve requirement than the previous listing.",
        ],
      },
      {
        question: "Delivery Set up",
        answer: [
          "Assistance with transportation is available from point A to point B, along with GPS tracking services (may not pertain to all preferred vendor companies). Preferred vendors for vehicle transportation are available upon checkout.",
          "Shipping costs are additional to the cost of the vehicle and are the responsibility of the buyer.",
        ],
      },
    ],
  },
  {
    id: "selling",
    title: "Selling Questions",
    items: [
      {
        question: "Cost to listing a vehicle",
        answer: [
          "Listing fee of $99. This includes listing the vehicle on Carasta upon approval, plus the security of funds initiated from the buyer to the seller through Caramel (digital title transfer, DMV authentication, and virtual progress of documents and funds).",
        ],
      },
      {
        question: "Setting a reserve",
        answer: [
          "If you set a reserve price on your vehicle, it must be competitive with the market and will be verified by Carasta LLC.",
          "We work to sell your vehicle in a timely period, so pricing may be comparable to market evaluations of the car details.",
        ],
      },
      {
        question: "Auction length",
        answer: [
          "Standard auction length is 7 days (168 hours) from listing date to closing date. Countdown on the listing is in live time.",
          "Upon close of the auction, there is a 60-second population period to ensure the last and final bidder and/or highest bidding price is granted to the auction winner.",
        ],
      },
      {
        question: "Buy it now feature",
        answer: [
          "This is optional. If selected, you can set a premium Buy Now price available within the initial 24 hours.",
          "If Buy Now is not fulfilled, the auction resumes as a normal auction for the remaining six additional days.",
          "We recommend setting this above your minimum reserve price.",
        ],
      },
      {
        question: "Post auction process",
        answer: [
          "Sellers will be prompted over to the Caramel platform to complete transactions and documentation.",
        ],
      },
      {
        question: "Receiving funds",
        answer: [
          "During checkout, buyer payment terms are processed through a secured third party (Caramel). Funds are held in escrow until proper documentation for both parties has been processed.",
          "This process can take 24 hours up to 5 business days, depending on loan payoffs, liens, Carfax reporting, DMV, and identity verification. Progress can be tracked in live time through Caramel.",
          "Buyer and seller will be notified via their communication preference at each staged process.",
          "Fund schedule: 50% of the final price will be released to the seller after both parties have signed off on proper paperwork. Once the vehicle has been delivered, the remaining 50% will be released from Caramel to the seller.",
        ],
      },
    ],
  },
  {
    id: "general",
    title: "General Q & A’s",
    items: [
      {
        question: "Bidding",
        answer: [
          "Within the bidding process, bids increase in a minimum of $250 increments from the lowest/current bid.",
        ],
      },
      {
        question: "Security",
        answer: [
          "With multiple partnerships, we ensure personal security for each buyer and seller so the transaction is enjoyable and rewarding. Bid with confidence.",
        ],
      },
      {
        question: "Reporting / Flagging",
        answer: [
          "Reporting or flagging comments will be promptly reviewed. Inappropriate comments on a listing are sent to the corporate team for further validation and may be removed.",
        ],
      },
      {
        question: "Returns",
        answer: [
          "There are no returns between sales or purchases made by either party. All sales are final.",
          "You are welcome to relist the item on the site under the same rules and regulations of a standard seller listing.",
        ],
      },
      {
        question: "Shipping of a vehicle",
        answer: [
          "We have preferred vendors for vehicle transportation available upon checkout. Shipping costs are additional to the cost of the vehicle and are the responsibility of the buyer.",
          "Transportation tracking is an option for various vendors. These details can be identified further at checkout.",
        ],
      },
    ],
  },
];
