# Carasta — Web Design Handoff Document

> **Purpose:** This document gives the web designer a complete functional reference for building the Carasta web application. It covers every screen, feature, user flow, form, state, and interaction found in the mobile app. No codebase exploration is required to design the web version.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Complete App Navigation](#2-complete-app-navigation)
3. [Complete Feature Inventory](#3-complete-feature-inventory)
4. [Screen-by-Screen Breakdown](#4-screen-by-screen-breakdown)
5. [Complete User Flows](#5-complete-user-flows)
6. [Forms and Input Fields](#6-forms-and-input-fields)
7. [Buttons, Actions, and Controls](#7-buttons-actions-and-controls)
8. [Modals, Popups, and Messages](#8-modals-popups-and-messages)
9. [User Types and Conditional Experiences](#9-user-types-and-conditional-experiences)
10. [Application States](#10-application-states)
11. [Mobile-to-Web Adaptation Guide](#11-mobile-to-web-adaptation-guide)
12. [Designer Coverage Checklist](#12-designer-coverage-checklist)

---

## 1. Product Overview

### What is Carasta?

Carasta is an **online vehicle auction and car community platform**. It lets people buy and sell cars through timed online auctions, and also connect with other car enthusiasts through a social feed called **Carmunity**.

### What problem does it solve?

Carasta makes it easy to:
- **Sell a car** by creating an auction listing with photos, video, and vehicle details, without going through a dealership.
- **Buy a car** by browsing live auctions, placing real-time bids, or purchasing a vehicle immediately at a fixed "Buy it Now" price.
- **Connect with a car community** — post about cars, share photos, follow other enthusiasts, and interact with content.

### Who are the users?

| User Type | Description |
|-----------|-------------|
| **Individual seller** | A person listing their personal car for auction |
| **Dealership seller** | A car dealer listing multiple vehicles |
| **Buyer** | Any logged-in user who places bids or uses Buy it Now |
| **Guest** | A visitor who can browse auctions but cannot bid, post, or sell |
| **New user** | Someone completing onboarding for the first time |

### What can users do?

- Browse live, upcoming, and coming-soon vehicle auctions
- Place real-time bids on live auctions
- Use "Buy it Now" to immediately purchase a vehicle at a fixed price
- Create vehicle listings for auction (with photos, video, documents)
- Follow auction reminders for upcoming vehicles
- Save favourite auctions to a watchlist
- Buy Carasta merchandise
- Post in the Carmunity social feed (text, photos, videos)
- Follow other users, comment on posts, like posts
- Manage their own profile (avatar, bio, address, notification settings)
- View their won auctions and manage payments
- Leave and view reviews for other users

### Main sections of the app

| Section | Purpose |
|---------|---------|
| **Home** | Curated auction spotlight, upcoming auctions, coming soon, deliveries feed, and testimonials |
| **Auction** | Full searchable and filterable list of all running auctions |
| **List (My Listings)** | Seller dashboard — create, edit, manage, and track vehicle listings |
| **Merch** | Carasta merchandise shop |
| **Carmunity** | Social feed — posts, search, create posts, notifications, user profile |

---

## 2. Complete App Navigation

### Navigation Tree

```
App Launch
├── Splash Screen (auto-dismiss)
│
├── Get Started Splash
│   ├── → Welcome (Sign Up)
│   └── → Login
│       └── Guest Mode (browse without account)
│
├── Authentication
│   ├── Welcome
│   │   ├── Signup as a Dealership → Gear1
│   │   ├── Signup as an Individual → Gear1
│   │   ├── Google SSO
│   │   ├── Apple SSO (iOS only)
│   │   ├── Facebook SSO
│   │   └── Log in to your account → Login
│   │
│   ├── Login
│   │   ├── Forgot Password → ForgotPassword
│   │   ├── Forgot Username → ForgotUsername
│   │   ├── Sign Up → Welcome
│   │   ├── Google SSO
│   │   ├── Apple SSO (iOS only)
│   │   └── Facebook SSO
│   │
│   ├── Sign Up Flow (Gear screens)
│   │   ├── Gear1 (role selection / intro)
│   │   ├── Gear2
│   │   ├── Gear3
│   │   ├── Gear4
│   │   └── Gear5 → SignUpWithMobile
│   │       └── OTP verification
│   │
│   ├── ForgotPassword
│   ├── ForgotUsername
│   ├── TwoFA (Two-Factor Authentication)
│   └── CreatePassword
│
├── Onboarding (10 steps, after first login or SSO)
│   ├── Step 1: Username
│   ├── Step 2: Visibility Preference
│   ├── Step 3: Personal Information
│   ├── Step 4: Select Interests
│   ├── Step 5: Notification Preferences
│   ├── Step 6: Get Started (informational)
│   ├── Step 7: How TGBs (Top Gear Bids) Work
│   ├── Step 8: How Bidding Works
│   ├── Step 9: Privacy Policy (accept)
│   └── Step 10: Terms and Conditions (accept)
│
└── Main Application
    ├── Bottom Navigation Tabs
    │   ├── Home (Tab 1)
    │   ├── Auction (Tab 2)
    │   ├── List (Tab 3)
    │   ├── Merch (Tab 4)
    │   └── Carmunity (Tab 5)
    │       ├── Inner Tab: Home Feed
    │       ├── Inner Tab: Search
    │       ├── Inner Tab: Add Post (gated for guests)
    │       ├── Inner Tab: Notifications (gated for guests)
    │       └── Inner Tab: Profile (gated for guests)
    │
    ├── Right-Side Drawer (opened from hamburger icon on Home tab)
    │   ├── [Guest] Sign Up
    │   ├── [Guest] Log In
    │   ├── [Guest] FAQ
    │   ├── [Guest] Terms & Conditions
    │   ├── [Guest] Privacy Policy
    │   ├── [Guest] Exit Guest Mode
    │   │
    │   ├── [Logged In] Profile photo + name (tap → Profile in Carmunity)
    │   ├── [Logged In] Edit Profile → EditProfile screen
    │   ├── [Logged In] Auctions Won → WonAuctions screen
    │   ├── [Logged In] Support/Send Feedback → SupportSendFeedback
    │   ├── [Logged In] Contact us (opens mail to info@carasta.com)
    │   ├── [Logged In] FAQ → FAQ screen
    │   ├── [Logged In] Terms & Conditions → TermsAndConditions
    │   ├── [Logged In] Privacy Policy → PrivacyPolicy
    │   ├── [Logged In] Credit Card Information → Payments
    │   ├── [Logged In] Change Password → ChangePassword
    │   ├── [Logged In] Delete Account (confirmation dialog)
    │   └── [Logged In] Logout (confirmation dialog)
    │
    └── Stack Screens (pushed from any tab)
        ├── VehicleDetails (auction detail page)
        │   └── Deep link: /auctionDetails/:id/
        ├── AddVehicle (create listing)
        ├── EditVehicle (edit existing listing)
        ├── VehicleList (seller's listing management — same as List tab)
        ├── DeliveriesList (all deliveries)
        ├── WonAuctionDetails (details of a won auction)
        ├── WonActionList (list of auctions won)
        ├── AuctionsTabs (active + past auctions)
        ├── AuctionDetails (Auction detail from Carmunity)
        ├── Bids (bid history)
        ├── AuctionReminder (list of auction reminders)
        ├── GetAuction (auction opened via deep link)
        │   └── Deep link: /auctionDetails/:id/
        ├── Payments (manage credit cards)
        ├── AddNewCard (add payment card)
        ├── Notifications (notification list)
        ├── ProfileUserPage (other user's public profile)
        ├── UserProfile (social user profile)
        ├── Garage (my garage + won auctions tabs)
        │   └── VehicleGallery (individual vehicle photo gallery)
        ├── Rating (user reviews/ratings)
        ├── FollowerTab (followers and following lists)
        ├── AllUsersScreen (list of all users)
        ├── PostDetails (single post view)
        │   └── Deep link: /postDetails/:id/
        ├── EditPost (edit existing post)
        ├── Carmunity (standalone, from navigation)
        ├── CaramalView (vehicle caramel/preview view)
        ├── Explore (browse/explore screen)
        ├── LoanCalculator (car loan calculator)
        ├── EditProfile (edit user profile)
        ├── ChangePassword
        ├── SupportSendFeedback
        ├── FAQ
        ├── TermsAndConditions
        ├── PrivacyPolicy
        ├── AboutUs
        ├── ListDetails (listing detail)
        └── AddCar (add car to garage)
```

### Back Navigation

- On all stack screens, a back/close button returns the user to the previous screen.
- The `EditPost` screen opens as a **modal** (slides up from the bottom), closed with an X button.
- On the Onboarding flow, a back button at each step returns to the previous step.
- If a guest tries a gated action, they are redirected to Login/Welcome, and after logging in they are automatically returned to the screen they were trying to access.

---

## 3. Complete Feature Inventory

### Feature 1: Vehicle Auctions (Browsing)

**Purpose:** Let users browse and find vehicles up for auction.

**Where:** Home tab (curated sections), Auction tab (full list).

**Who can use it:** Everyone including guests.

**How to access:** Open the app → Home tab or Auction tab.

**What is displayed per auction card:**
- Thumbnail image
- Vehicle year, make, model
- Current highest bid (live, updates in real time)
- Number of bids
- Time remaining (countdown timer, live)
- "Buy it Now" price and button (if enabled by seller)
- Favourite/watchlist icon (heart)

**Available actions:**
- Tap card → opens Vehicle Details screen
- Tap heart icon → saves/removes from watchlist (login required)
- Tap "Buy it Now" → opens purchase confirmation (login required)

**Auction categories on Home tab:**
- **Auction Spotlight** — featured active auctions
- **Upcoming** — auctions starting soon
- **Coming Soon** — announced but not yet live
- **All Auctions** — complete list
- **Deliveries** — vehicles being delivered (won auctions)

**States:** Loading (spinner), Empty ("No Auctions"), Error (silent reload on pull), Live updates without user action.

---

### Feature 2: Vehicle Auction Detail

**Purpose:** Show all details about a single vehicle up for auction.

**Where:** VehicleDetails screen, opened from any auction card.

**Who can use it:** Everyone. Bidding and favouriting require login.

**Tabs inside Vehicle Details:**

| Tab | Content |
|-----|---------|
| **Showroom** | Photo gallery, video player (if video uploaded) |
| **Description / Build Sheet** | Vehicle build sheet, technical details |
| **Owner's Notes** | Personal notes from the seller |
| **Status** | Auction status (bid count, current highest bid, time left, reserve meter, bid history) |
| **Comments** | Public comment thread on this auction |

**Information displayed:**
- Vehicle photos (swipeable gallery)
- Vehicle year, make, model, trim, mileage, VIN
- Seller name and avatar
- Current highest bid and who placed it
- Number of bids
- Live countdown timer
- Bid history list
- Reserve price indicator (shows "Reserve Not Met" / "Reserve Met" / seller has lifted reserve)
- View count and watcher count
- Video (if uploaded)
- Documents (build sheet PDFs)
- Comments thread

**Available actions:**
- Favourite / unfavourite (heart button in header)
- Place a bid → opens bid input modal (login required)
- Buy it Now → confirmation modal (login required)
- View full photo gallery
- Watch video
- Read and write comments (login required)
- **Seller only:** Lift reserve price (removes reserve) or change reserve price
- **Seller only:** Tab "Status" shows auction management options
- Share auction (via deep link)

**States:**
- Loading: Full-screen spinner while data loads
- Live updates: Bids and timer update in real time via WebSocket without refreshing
- Sold: Auction ended, shows final result
- Coming soon: No bidding actions, only viewing
- Garage view (when opened from garage): Status tab is hidden

---

### Feature 3: Real-Time Bidding

**Purpose:** Let buyers compete for vehicles through timed bids.

**Where:** Vehicle Details → Status tab → Bid button.

**Who:** Logged-in users only. Guests see a "Sign Up" prompt.

**How it works:**
1. User taps "Place Bid" button.
2. A bid input modal opens with the minimum bid amount shown.
3. User enters a bid amount and confirms.
4. Bid is submitted; all other viewers see the updated bid and countdown timer in real time.
5. Each new bid can extend the auction time.

**States:**
- Bid input modal with minimum bid shown
- Loading state on bid button while submitting
- Success: bid reflected live on screen
- Error: alert with reason (too low, not authenticated, auction ended)

---

### Feature 4: Buy it Now

**Purpose:** Allow immediate purchase at a fixed price without bidding.

**Where:** Auction cards (Home/Auction tab) and Vehicle Details.

**Who:** Logged-in users. Guests prompted to sign up.

**Conditions:** Only visible if the seller enabled "Buy it Now" and set a price when listing.

**How it works:**
1. Tap "Buy it Now" button.
2. Confirmation modal appears: "Are you sure you want to buy this vehicle?"
3. User confirms → purchase is processed → auction is marked won.

---

### Feature 5: Watchlist / Favourites

**Purpose:** Save auctions to revisit later.

**Where:** Auction cards, Vehicle Details header.

**Who:** Logged-in users. Guests are prompted to sign up.

**How to use:** Tap the heart icon. Active = saved. Tap again = removed.

**Filter:** In the Auction tab, a "Favourites" toggle shows only saved auctions.

---

### Feature 6: Auction Reminders

**Purpose:** Get reminded when an auction is about to go live.

**Where:** Auction Reminder screen, accessible from notifications or the drawer.

**Who:** Logged-in users.

**What it shows:** A list of upcoming auctions the user has set reminders for, with time remaining until they start.

---

### Feature 7: Vehicle Listing (Seller)

**Purpose:** Let sellers list their vehicles for auction on Carasta.

**Where:** List tab → "Add Vehicle" button.

**Who:** Logged-in users only (individual or dealership).

**What sellers do:**
1. Set a desired auction start date.
2. Upload up to a maximum number of photos (drag-and-drop to reorder).
3. Upload a video (max 60 seconds).
4. Choose a thumbnail image (square crop).
5. Upload documents (build sheet PDFs).
6. Enter vehicle details: VIN (optional, auto-fills year/make/model/trim via VIN lookup), Year, Make, Model, Trim, Mileage.
7. Toggle Reserve Price on/off and enter amount.
8. Toggle Buy it Now on/off and enter price.
9. Generate a Build Sheet automatically using AI (optional, requires Make/Model/Year).
10. Enter Owner's Notes manually (up to 2,000 characters).
11. Enter a Promo Code (optional).
12. Dealerships also enter a Dealer ID.
13. Save as Draft or Submit.

**Upload states:**
- Images are uploaded in the background with a progress queue visible.
- Each image shows its upload status (uploading, completed, failed).
- Failed uploads can be retried.
- Images can be reordered.
- Unsaved changes trigger a "Save as Draft or Discard" prompt on back navigation.

---

### Feature 8: Listing Management (List Tab / VehicleList)

**Purpose:** Let sellers see and manage all their vehicle listings.

**Where:** List tab.

**Who:** Logged-in users. Guests see a sign-up placeholder.

**What is shown:** A scrollable list of the seller's vehicles, each with:
- Vehicle name and thumbnail
- Status (pending approval, active, sold, draft, etc.)
- Three-dot menu per item

**Actions per vehicle:**
- **Edit** → opens Edit Vehicle screen
- **View Status** → opens a status modal showing the auction status
- **Manage Auction** → opens a bottom sheet to manage the running auction (change schedule, etc.)
- **Delete** → removes the vehicle (with loading state while deleting)

**Header action:** "Add Vehicle" button at the top.

**States:**
- Loading: full-screen spinner on initial load
- Empty: "No Vehicles Found — You have not added any vehicle yet"
- Error: shows previous data or empty state
- Pull-to-refresh: re-fetches the list

---

### Feature 9: Carmunity Social Feed

**Purpose:** A social community for car enthusiasts to post, connect, and interact.

**Where:** Carmunity tab (5th tab in bottom nav).

**Structure:** The Carmunity tab itself has 5 inner tabs:

| Inner Tab | Available to Guests? | Content |
|-----------|---------------------|---------|
| Home | Yes | Public posts from the community |
| Search | Yes | Search posts and users |
| Add Post | No | Create a new post |
| Notifications | No | Activity notifications |
| Profile | No | Own profile, posts, bio, auctions, garage |

---

### Feature 10: Create Post

**Purpose:** Share text, images, or video with the community.

**Where:** Carmunity → Add Post tab.

**Who:** Logged-in users.

**What users can do:**
- Write text (up to 280 characters)
- Use @mentions (type @ to get a dropdown of user suggestions)
- Use #hashtags
- Attach photos from camera or gallery (multiple)
- Attach videos
- Preview media before posting
- Remove individual media files
- Tap "Create Post" to publish

**Conditions:**
- Post button is disabled until there is text OR at least one media file.
- Up to 20 @mentions per post.
- Posts are public.

---

### Feature 11: Post Interactions

**Purpose:** Let users engage with posts.

**Where:** Post cards in the feed, and Post Details screen.

**Actions per post:**
- **Like / Unlike** — heart icon, shows like count
- **Comment** — opens comment sheet/thread
- **Repost** — share the post to your own feed
- **Share** — share post via deep link (external share)
- **Three-dot menu (own post):** Edit post, Delete post
- **Three-dot menu (other's post):** Report post

**Comment actions:**
- Write a comment
- Like a comment
- Reply to a comment

---

### Feature 12: User Profiles (Carmunity)

**Purpose:** Show a user's social presence — their posts, bio, auctions, and garage.

**Where:** Carmunity → Profile tab (own profile) or UserProfile screen (other users).

**Profile tabs:**
- **Posts** — the user's published posts with a "Create Post" prompt at top (own profile)
- **Bio** — name, username, bio text, location, social info
- **Auctions** — auctions this user has listed or participated in
- **Garage** — vehicles they own or have won

**Header section shows:**
- Profile photo (circular)
- Username and/or full name
- Follow / Unfollow button (other users)
- Follower count and following count (tappable → opens followers/following list)
- Post count

**Own profile:** No follow button. Tabs are sticky as the user scrolls.

---

### Feature 13: Garage

**Purpose:** Show a user's vehicle collection.

**Where:** Garage screen (from drawer or Carmunity profile Garage tab).

**Tabs:**
- **My Garage** — vehicles the user owns (added via Add Car)
- **Auctions Won** — vehicles won at auction

**Each vehicle card shows:** Photo, name, year/make/model.

**Actions:** Tap a vehicle → opens VehicleGallery (photo viewer) or VehicleDetails.

---

### Feature 14: Notifications (Notification Screen)

**Purpose:** Show a list of app notifications.

**Where:** Notifications screen (from drawer).

**Notification types:**
- New bid on your auction
- Auction ending soon
- Auction won
- Someone liked your post
- Someone commented on your post
- Someone replied to your comment
- Someone liked your comment
- Someone reposted your post
- Someone followed you

**Actions:**
- Tap a notification → navigates to the relevant screen (post, auction, user)
- "Clear all" button → deletes all notifications
- Individual notifications can be marked as read

**States:**
- Loading: full-screen spinner
- Empty: "No Notifications — You don't have any notifications yet"
- Pull-to-refresh

---

### Feature 15: Social Notifications Tab (inside Carmunity)

**Purpose:** Same as above but embedded inside the Carmunity tab as the 4th inner tab.

**Who:** Logged-in users. Guests see a "Sign Up" placeholder.

---

### Feature 16: Search (Carmunity)

**Purpose:** Search for posts and users within the community.

**Where:** Carmunity → Search inner tab.

**How it works:**
- User types in the search bar.
- Results are debounced (300–500ms).
- Two sub-tabs appear: **Posts** and **People**.
- Posts tab shows matching post cards.
- People tab shows matching user profiles.

**States:**
- Default (empty): Large search icon with "Try searching something"
- Searching: Spinner while loading
- Results shown: Post list or user list
- No results: "No posts found" or "No users found"
- Pagination: infinite scroll

---

### Feature 17: Follow / Unfollow Users

**Purpose:** Follow other users to see their posts in your feed.

**Where:** User profile pages.

**Actions:** Follow button / Unfollow button. Follower counts update.

**Followers/Following list:** Tappable; shows a list of profiles.

---

### Feature 18: Merch Store

**Purpose:** Let users browse and purchase Carasta merchandise.

**Where:** Merch tab.

**What is shown:**
- Scrolling marquee banner (promotional message)
- 2-column grid of merchandise items
- Each card: photo, item name, price

**Actions:** Tap a card → opens an external URL to purchase the item (if a URL is set). If no URL, an alert says "Link unavailable."

**States:**
- Loading: spinner
- Empty: "Stay tuned for the upcoming Merch..."
- Pull-to-refresh

---

### Feature 19: Loan Calculator

**Purpose:** Help users estimate monthly car loan payments.

**Where:** Loan Calculator screen (accessible from Home or drawer).

**Inputs:** Purchase price, down payment, loan term, interest rate.

**Output:** Estimated monthly payment.

---

### Feature 20: Payments / Credit Card Management

**Purpose:** Let users manage their payment methods for purchasing vehicles.

**Where:** Drawer → Credit Card Information.

**What is shown:** List of saved credit cards (card brand icon, last 4 digits).

**Actions:**
- Add new card → AddNewCard screen (enters card number, expiry, CVV)
- Remove a card

**Requirement:** A payment method must be added before submitting a vehicle listing.

---

### Feature 21: Won Auctions

**Purpose:** Show the user all auctions they have won.

**Where:** Drawer → Auctions Won, Garage → Auctions Won tab.

**What is shown:** List of won auctions with vehicle info and auction result.

**Actions:** Tap a won auction → WonAuctionDetails screen showing full vehicle info, seller contact, and payment status.

---

### Feature 22: Reviews and Ratings

**Purpose:** Let users rate and review other users (buyers/sellers).

**Where:** Rating screen — accessible from user profiles.

**Actions:**
- View existing reviews (filterable)
- Write a new review (star rating + text)

---

### Feature 23: Profile and Account Management

**Purpose:** Let users manage their personal information and account settings.

**Where:** Drawer → Edit Profile.

**Features:**
- Change profile photo and banner image
- Edit first/last name or dealership name
- Edit username
- Edit bio (up to 1,000 characters)
- Edit email, phone, address, city, state, zip code, country
- Choose display name visibility (username only vs. full name + username)
- Notification settings (email, SMS, in-app, push)
- Change password
- Delete account

---

### Feature 24: Edit Post

**Purpose:** Allow a user to edit a post they have already created.

**Where:** Three-dot menu on own post → Edit.

**Opens as:** Modal sliding up from the bottom.

**Fields:** Same as Create Post — text, media attachments.

---

### Feature 25: Support and Feedback

**Purpose:** Let users send messages to the Carasta support team.

**Where:** Drawer → Support/Send Feedback.

**Contact:** Also "Contact us" (mailto: info@carasta.com).

---

### Feature 26: Guest Mode

**Purpose:** Allow visitors to explore the app without creating an account.

**Where:** Get Started Splash → "Browse as guest" (or equivalent action).

**What guests can do:**
- View Home tab (auctions, upcoming, coming soon, deliveries, testimonials)
- View Auction tab (browse, search, filter auctions)
- View individual Vehicle Details (read-only — no bidding, no favouriting)
- View Carmunity Home and Search tabs (read-only — posts, search)
- View Merch tab

**What guests cannot do:**
- Place bids
- Use Buy it Now
- Favourite/save auctions
- Create posts
- View notifications
- View own profile
- Manage listings
- Access drawer account items (only FAQ, T&C, Privacy Policy, Sign Up, Log In, Exit Guest Mode)

**Prompt behaviour:** When a guest taps a gated action, a prompt appears asking them to sign up or log in.

---

### Feature 27: Onboarding (New Users)

**Purpose:** Collect additional information from new users after their first login or sign-up.

**Steps (10 total):**

| Step | Screen | What the user does |
|------|--------|-------------------|
| 1 | Username | Choose a unique username |
| 2 | Visibility Preference | Choose whether to show username only or full name + username |
| 3 | Personal Information | Enter phone, state, city, zip code |
| 4 | Select Interests | Choose car interests from a list |
| 5 | Notification Preferences | Toggle email, text, in-app, push notifications |
| 6 | Get Started | Informational screen about Carasta |
| 7 | How TGBs Work | Educational screen about Top Gear Bids |
| 8 | How Bidding Works | Educational screen about the auction format |
| 9 | Privacy Policy | Read and accept |
| 10 | Terms and Conditions | Read and accept |

---

### Feature 28: App Update Check

**Purpose:** Prompt users to update the app when a new version is available.

**Where:** On app launch.

**Behaviour:** If an update is required, a modal appears with an "Update" button linking to the app store. The modal cannot be dismissed if the update is mandatory.

---

### Feature 29: Disclosure Popups (First-Time Sellers)

**Purpose:** Educate first-time sellers about key fields when creating a listing.

**Where:** AddVehicle screen, triggered when a first-time seller focuses on or activates specific fields.

**Disclosures shown for:**
- Photos
- Reserve Price
- Buy it Now
- Build Sheet
- Owner's Notes

**Behaviour:** Each popup explains the field. User taps "I understand" to dismiss. After viewing, an info (ⓘ) icon appears next to the field so the user can re-read it.

---

## 4. Screen-by-Screen Breakdown

---

### Screen: Splash

**Purpose:** Initial loading screen while the app checks authentication state.

**How user reaches it:** App launch.

**What is shown:** Carasta logo and loading indicator.

**Behaviour:** Automatically navigates to the correct screen based on state:
- First launch → GetStartedSplash
- Already logged in → Home (main app)
- Mid-onboarding → Onboarding

**States:** Only a loading/splash state. No user interaction.

---

### Screen: Get Started Splash

**Purpose:** Entry point for new visitors.

**How user reaches it:** App first launch, or guest "Exit Guest Mode".

**Content:**
- Carasta logo and branding
- "Get Started" (or "Sign Up") button
- "Log In" button
- "Browse as Guest" option (or equivalent)

**Actions:**
- Get Started / Sign Up → Welcome screen
- Log In → Login screen
- Browse as Guest → enters guest mode → Home (main app)

---

### Screen: Welcome

**Purpose:** Let new users choose how to sign up.

**How user reaches it:** Get Started Splash, or "Sign Up" link from Login.

**Content:**
- "Welcome to Carasta" title
- Carasta logo
- "Signup as a dealership" button (primary)
- "Signup as an individual" button (primary)
- "or continue with" divider
- SSO icons: Google, Apple (iOS only), Facebook
- "New? We'll ask your account type after sign-in." hint text
- Error message area (for SSO failures)
- "OR" divider
- "Log in to your account" button (tertiary/outline)

**Actions:**
- Signup as dealership → Gear1 with userType=dealership
- Signup as individual → Gear1 with userType=individual
- Google / Apple / Facebook → SSO flow → if new user → role selection modal → Onboarding; if existing user → Home
- Log in → Login screen

**Modals triggered:**
- **SSO Role Selection Modal:** Appears after SSO if the user is new; asks "Are you a dealership or an individual?" with two options.

**States:**
- SSO button loading: shows spinner inside the icon button while authenticating
- SSO error: red error text appears below the SSO row for 3.5 seconds then disappears

---

### Screen: Login

**Purpose:** Let existing users sign in.

**How user reaches it:** Welcome screen, Get Started Splash, Drawer (guest).

**Content:**
- Carasta logo
- "Login" title
- Subtitle: "Welcome back! Please login to continue."
- Username or Email field
- Password field (with show/hide eye icon)
- "Forgot Username?" link
- "Forgot/Reset Password?" link
- "Login" button
- "Don't have an account? Sign up" link
- "or continue with" divider
- SSO icons: Google, Apple (iOS only), Facebook

**Validation:**
- Empty username → error: "Please enter your username"
- Empty password → error: "Please enter your password"
- Wrong credentials → toast: "Invalid credentials" or backend error message

**States:**
- Loading: login button shows spinner, fields disabled
- Success: toast "Login Successful" then navigates to Home
- Error: toast with error message
- Incomplete onboarding: redirects to Onboarding

---

### Screen: Forgot Password

**Purpose:** Let users reset their password by email.

**How user reaches it:** Login screen → "Forgot/Reset Password?"

**Fields:** Email address field.

**Actions:** Submit → backend sends reset email → success state shown.

---

### Screen: Forgot Username

**Purpose:** Help users recover their username by email.

**How user reaches it:** Login screen → "Forgot Username?"

**Fields:** Email address field.

**Actions:** Submit → confirmation message shown.

---

### Screen: Two-Factor Authentication (TwoFA)

**Purpose:** Verify identity with a second factor code.

**How user reaches it:** After entering username/password if 2FA is enabled.

**Fields:** 6-digit code input.

**Actions:** Submit code → if valid, proceeds to Home or Onboarding.

---

### Screen: Create Password

**Purpose:** Let new users set their account password.

**How user reaches it:** During signup flow.

**Fields:** Password, Confirm Password.

**Requirements shown:** Password strength requirements displayed inline.

---

### Screen: Sign Up Flow (Gear1 – Gear5 + SignUpWithMobile + OTP)

**Purpose:** Walk new users through creating an account with mobile number.

**How user reaches it:** Welcome screen → Signup buttons.

**Gear1:** Role info / intro for dealership or individual.

**Gear2–Gear5:** Additional steps (collecting account preferences, explaining the platform).

**SignUpWithMobile:** Enter phone number and country code.

**OTP screen:** Enter the 6-digit code sent to the phone number.

---

### Screen: Onboarding (10 steps)

*See Feature 27 above for step descriptions.*

**How user reaches it:** After first login (credentials or SSO), after OTP verification.

**Navigation:** Step progress indicator shown. Back button returns to previous step. "Skip" option available on some steps.

**Step 1 — Username Screen:**
- Field: username (text input, lowercase, no spaces)
- Validation: must be unique, no special characters
- Button: "Next"

**Step 2 — Visibility Preference:**
- Two card options: "Show username only" or "Show full name and username"
- Live preview of how name will appear
- Button: "Next"

**Step 3 — Personal Information:**
- Fields: phone number (with country code), state (dropdown), city, zip code
- Button: "Next"

**Step 4 — Select Interests:**
- Multi-select list of car-related interest categories
- Button: "Next"

**Step 5 — Notification Preferences:**
- Toggles: Email notifications, Text (SMS) notifications, In-app notifications, Push notifications
- Button: "Next"

**Steps 6–8:** Informational/educational screens with "Continue" buttons.

**Steps 9–10:** Full-text legal documents (Privacy Policy, Terms & Conditions) with "Accept & Continue" buttons. Must scroll to bottom before button activates (Assumption).

---

### Screen: Home Tab

**Purpose:** Main dashboard showing auction highlights, upcoming events, and deliveries.

**How user reaches it:** Default screen after logging in. First tab in the bottom navigation.

**Header:**
- Left: Hamburger icon (opens right-side drawer)
- Center: Carasta logo
- Right: User avatar (tap → navigates to Carmunity Profile tab)

**Scrolling marquee banner:** Promotional text message from admin, tappable (navigates to a configurable destination screen).

**Sections (vertically scrolling):**

| Section | Content |
|---------|---------|
| **Auction Spotlight** | Horizontally scrollable row of featured live auction cards |
| **Upcoming** | Horizontal row of auction cards starting soon |
| **Coming Soon** | Horizontal row of announced auctions not yet live |
| **All Auctions** | Horizontal row showing all running auctions |
| **Deliveries** | A section showing vehicles in delivery to their new owners |
| **Testimonials** | User reviews/testimonials with "See All" button |

**Auction card contains:**
- Thumbnail image
- Vehicle name (year, make, model)
- Current bid amount
- Bid count
- Countdown timer (live)
- Buy it Now button (if enabled)

**Actions:**
- Pull-to-refresh: refreshes banner and all sections
- Tap any auction card → VehicleDetails
- Tap Buy it Now → confirmation dialog (login required)
- Tap user avatar → Carmunity Profile tab
- Tap hamburger → right-side drawer
- Tap marquee banner → configured destination
- Tap "See All" on Testimonials → Rating/Reviews screen

**States:**
- Loading: individual section spinners
- Empty per section: section is hidden or shows "No auctions"
- Real-time updates: auction timers and bids update via Firebase without user action

---

### Screen: Auction Tab (home-prev / AuctionTab)

**Purpose:** Browse all running auctions with search, filter, and sort.

**How user reaches it:** Second tab in bottom navigation.

**Header:**
- Carasta logo on the right
- Profile avatar on the right (tap → Carmunity Profile tab)

**Search bar:** Text search across auctions (by vehicle name, make, model). Debounced.

**List controls:**
- **Favourites toggle:** Show only saved/favourite auctions
- **Filter button:** Opens filter modal (see Modals section)
- **Grid view / List view toggle:** Switch between card grid and detailed list

**Content:**
- In **Grid view:** 2-column grid of auction cards
- In **List view:** Full-width list items with more details per row

**Auction card (Grid):**
- Thumbnail
- Vehicle name
- Current bid
- Time remaining
- "Buy it Now" button (if applicable)

**Auction list item (List view):**
- All of the above plus additional details

**Pagination:** Infinite scroll — loads more auctions as user scrolls to the bottom.

**Pull-to-refresh:** Re-fetches auction list.

**States:**
- Loading: full-screen spinner on initial load
- Empty: "No Auctions — There are no auctions available at the moment"
- Live timer updates: all countdown timers update in real time via Firebase

---

### Screen: Vehicle Details

**Purpose:** Full detail view of a single auction with bidding.

**How user reaches it:** Tapping any auction card from Home, Auction tab, notifications, or deep links.

**Header:**
- Back button
- Vehicle name
- Heart/Favourite icon (not shown when opened from Garage)

**Tab bar (sticky horizontal scroll):**
- Showroom
- Description
- Owner's Notes
- Status
- Comments

*(Status tab is hidden when the vehicle is opened from Garage view.)*

---

#### Sub-section: Showroom Tab

- Horizontally swipeable full-width photo gallery
- Photo counter ("3/12")
- Tap photo → opens full-screen image zoom viewer
- Video section below photos (if video uploaded): large play button, tap to play
- Scroll indicator dots

---

#### Sub-section: Description (Build Sheet) Tab

- Vehicle specs: Year, Make, Model, Trim, Mileage, VIN
- Build sheet text (full description)
- Document download links (if documents uploaded)

---

#### Sub-section: Owner's Notes Tab

- Free-text notes written by the seller about the vehicle's condition, history, modifications, etc.

---

#### Sub-section: Status Tab

**Information shown:**
- Auction status (running, upcoming, ended)
- Start date and end date
- Current highest bid amount and bidder username
- Number of bids
- Reserve price status:
  - "Reserve Not Met" indicator if reserve exists and is not yet met
  - "Reserve Met" if bids have exceeded the reserve
  - No indicator if no reserve was set
- Reserve meter/progress bar (visual indicator of how close the current bid is to the reserve)
- Live countdown timer
- "Place Bid" button (login required)
- "Buy it Now" button (if enabled, within 24h of auction start)

**Seller-only controls (visible only to the auction's seller):**
- "Lift Reserve" button — removes the reserve price entirely
- "Change Reserve" — opens input to set a new reserve price

**Bid history section:**
- List of bids with bidder username and amount (most recent first)
- "See All Bids" button → opens Bids screen with full history

---

#### Sub-section: Comments Tab

- Comment input field (requires login)
- Scrollable list of comments
- Each comment: avatar, username, timestamp, text, like button, reply button
- Tap avatar/username → UserProfile screen

---

### Screen: List Tab (My Listings / VehicleList)

**Purpose:** Seller dashboard to manage vehicle listings.

**Header:** Carasta logo.

**Content:**
- "Add Vehicle" button at the top
- List of seller's vehicles

**Each vehicle card:**
- Thumbnail
- Vehicle name
- Status badge (e.g. pending, live, sold, draft)
- Three-dot (⋯) menu icon

**Three-dot menu options:**
- Edit
- View Status
- Manage Auction
- Delete

**State modals:**
- **VehicleStatusModal:** Shows the current auction status, bid count, highest bid, time remaining.
- **ManageAuctionSheet:** Bottom sheet for managing a running auction (schedule, extend, etc.).

**States:**
- Loading: full-screen spinner
- Empty: "No Vehicles Found — You have not added any vehicle yet"
- Guest: sign-up placeholder with car icon and message "Sign up to list your vehicles, manage auctions, and start selling on Carasta."
- Pull-to-refresh

---

### Screen: Add Vehicle

**Purpose:** Form for creating a new vehicle auction listing.

**How user reaches it:** List tab → "Add Vehicle" button.

**Header:** "List a Vehicle" title, back button. Back triggers "Save as Draft or Discard?" if there are unsaved changes.

**Form sections (in order):**

1. **Desired Start Date** — Date picker (required). Minimum date is today.
2. **Images** — "Add Photos" button (camera icon). Up to a maximum number of images, each up to 5MB. An upload queue shows progress per image with retry/cancel/remove options. Images can be reordered (drag-and-drop). First-time sellers see a disclosure popup.
3. **Video** — "Add a Video" button (video icon). Max 60 seconds. Shows thumbnail preview with replace/delete options.
4. **Thumbnail** — "Add Photos" button. Square crop picker. One image only.
5. **VIN Number** — Text input with "Search" button. Auto-fills Year, Make, Model, Trim on success. Optional for older vehicles.
6. **Year** — Numeric, 4-digit, required.
7. **Make** — Autocomplete dropdown (CarAPI), required.
8. **Model** — Autocomplete dropdown (dependent on Make), required.
9. **Trim** — Autocomplete dropdown (optional, dependent on Make/Model/Year).
10. **Promo Code** — Text, optional.
11. **Dealer ID** — Text, required for dealerships only.
12. **Reserve** — Toggle switch + price field (conditionally required when switch is ON).
13. **Buy it Now?** — Toggle switch + price field (conditionally required when switch is ON).
14. **Mileage** — Numeric, formatted with comma separators, required.
15. **Build Sheet** — Multi-line text (up to 2,000 characters). "Generate with AI" button appears when Make/Model/Year are filled.
16. **Owner's Notes** — Multi-line text (up to 2,000 characters).
17. **Documents** — File upload (PDFs or documents). Multiple files allowed.

**Action buttons:**
- "Save as Draft" (secondary/outline button) — saves without submitting; no photo/payment requirement
- "Submit" (primary button) — submits the listing; requires minimum photos, thumbnail, and saved payment method

**Submit validations:**
- Minimum required images not met → alert "Add more photos"
- No thumbnail selected → alert "Add a thumbnail"
- No payment method on file → alert "Please add payment method to list a vehicle" with link to AddNewCard
- Images still uploading → alert "Please wait"
- Failed uploads → alert "Upload Errors — retry or remove"

**States:**
- Initial pool preparation: shows "Preparing..." full-screen loader
- Video compressing: overlay with "Please wait while we process"
- Submitting: CustomLoader overlay
- Success: toast then back navigation
- Error: toast with error message

---

### Screen: Edit Vehicle

**Purpose:** Edit an existing vehicle listing.

**How user reaches it:** List tab → vehicle three-dot menu → Edit.

**Content:** Same form as Add Vehicle, pre-filled with existing data.

---

### Screen: Merch Tab

**Purpose:** Browse and buy Carasta merchandise.

**Header:** Carasta logo (LogoHeader).

**Content:**
- Scrolling marquee banner (if set)
- 2-column grid of merchandise cards
- Each card: product image, name, price

**Tap a card:** Opens the purchase URL in an external browser. If no URL is set, shows an alert.

**Disabled card style:** Slightly transparent if no URL is set.

**States:**
- Loading: spinner
- Empty: "Stay tuned for the upcoming Merch..."
- Error: alert if link cannot open

---

### Screen: Carmunity Tab

**Purpose:** Social community hub.

**How user reaches it:** 5th tab in bottom navigation.

**Structure:** A custom horizontal tab bar at the top with 5 icon tabs:

| Icon | Tab Name |
|------|---------|
| House icon | Home Feed |
| Search icon | Search |
| Plus/Edit icon | Add Post |
| Bell icon (with badge) | Notifications |
| Person icon | Profile |

**Header area:**
- Shows "Carmunity" text with red Carmunity icon when on the Home tab
- Shows only the tab icons when on other tabs

**Guest gating:** Tapping Add Post, Notifications, or Profile as a guest shows a sign-up placeholder screen with the relevant message and "Sign Up" + "Log In" buttons.

---

### Screen: Carmunity — Home Feed

**Purpose:** Display the social feed of public community posts.

**Content:** Infinite scrolling list of post cards.

**Each post card:**
- Author avatar (circular)
- Author name / username
- Post timestamp
- Post text content (with @mentions highlighted, #hashtags tappable)
- Media grid (up to 4 images/videos shown; "+N more" overlay for additional)
- Like button with count
- Comment button with count
- Repost button with count
- Share button
- Three-dot menu (Edit/Delete for own posts; Report for others)

**Tap avatar/name:** → UserProfile screen

**Tap image:** → Full-screen media viewer

**Tap comment icon:** → Opens comment bottom sheet

**Pull-to-refresh:** Reloads the feed from the beginning.

**Pagination:** Loads more posts as the user scrolls to the bottom.

**States:**
- Loading: full-screen spinner on first load
- Loading more: spinner at the bottom of the list
- Empty: "No posts yet — Public posts from the community will appear here."

---

### Screen: Carmunity — Search Tab

**Purpose:** Search for posts and people.

**Content:**
- Search input bar with search icon (placeholder: "Search posts or people...")
- Default state (no query): empty state with search icon and message

**When user types:**
- Two sub-tabs appear: **Posts** and **People**
- Posts tab: shows matching post cards
- People tab: shows user list with follow buttons

**States:**
- No query: "Try searching something — Your search results will show up here"
- Searching: spinner
- No results (Posts): "No posts found — Try searching with different keywords"
- No results (People): similar empty state

---

### Screen: Carmunity — Add Post Tab

**Purpose:** Create a new community post.

**Access:** Logged-in users only.

**Content:**
- "Create Post" title
- Multi-line text input (280 characters max, supports @mentions with autocomplete dropdown)
- Media gallery preview (if files attached)
- Bottom action bar: Camera icon, Media/Gallery icon, Create Post button

**@mention behaviour:**
- Typing @ in the text box shows a dropdown of matching users
- User can scroll the list and tap a name to insert the mention
- Mention appears highlighted in the text

**Media preview:**
- Attached files shown in a grid layout (1/2/3/4-image layouts)
- Each item has an X remove button
- Tap grid → opens full-screen preview modal with close button

**Create Post button:** Disabled if both text and media are empty. Shows spinner while submitting.

---

### Screen: Carmunity — Notifications Tab

**Purpose:** In-context notifications within Carmunity.

*(Same content and states as the standalone Notifications screen. See Feature 14.)*

---

### Screen: Carmunity — Profile Tab (Own Profile)

**Purpose:** Show the logged-in user's social profile.

**Header section:**
- Banner/cover image (tappable to change)
- Profile photo (circular, tappable to change — camera/gallery/view options)
- Name / username
- Follower count → tappable (opens Followers tab)
- Following count → tappable (opens Following tab)
- Post count

**Sub-tabs:**
- **Posts** — own posts + "Create Post" prompt at the top of the list
- **Bio** — bio text, interests, location
- **Auctions** — auctions the user has listed or bid on
- **Garage** — vehicles in their garage

**Sticky tabs:** The sub-tab bar sticks to the top when scrolled past the header.

**Pull-to-refresh:** Refreshes posts, profile data, and suggested users.

**Post list:** Infinite scroll, with loading indicator at bottom. Posts can be deleted from here.

---

### Screen: User Profile (Other Users)

**Purpose:** Show another user's public profile.

**How user reaches it:** Tapping a username anywhere, UserProfile screen.

**Content:** Same structure as own profile except:
- Follow / Unfollow button instead of Edit Profile
- No "Create Post" prompt
- Own-post actions not available in their posts

---

### Screen: Followers / Following

**Purpose:** Show a user's followers and the people they follow.

**How user reaches it:** Tapping follower/following count on a profile.

**Tabs:** Followers | Following

**Each row:** Avatar, name/username, Follow/Unfollow button.

---

### Screen: All Users Screen

**Purpose:** Browse all registered users.

**How user reaches it:** From certain navigations (Needs Confirmation on exact entry point).

**Content:** Searchable list of users with follow buttons.

---

### Screen: Post Details

**Purpose:** Show a single post in full detail with all comments.

**How user reaches it:** Tapping a notification (post-related) or a post in the feed; deep link: `/postDetails/:id/`.

**Content:**
- Full post card at the top (same as feed)
- Full comment thread below
- Comment input at the bottom

**Actions:** All post interactions (like, comment, repost, share, three-dot menu).

---

### Screen: Edit Post

**Purpose:** Edit a previously created post.

**How user reaches it:** Three-dot menu on own post → Edit.

**Opens as:** Modal (slides up from bottom), with an X button in the header.

**Content:** Same as Add Post form, pre-filled with existing content.

---

### Screen: Garage

**Purpose:** View a user's car collection.

**How user reaches it:** Carmunity Profile → Garage tab → "View all"; or from Drawer navigation.

**Header:** "Garage" title, back button.

**Tabs:**
- **My Garage** (or "[username]'s Garage") — vehicles the user has added manually
- **Auctions Won** — vehicles won at auction

**Content:** List of vehicle cards with photo, name, details.

**Tap vehicle:** Opens VehicleGallery (photo slideshow) or VehicleDetails.

---

### Screen: Vehicle Gallery (VehicleGallery)

**Purpose:** Full-screen photo viewer for a garage vehicle.

**Content:** Swipeable full-screen photos. Photo counter. Back button.

---

### Screen: Notifications

**Purpose:** Full notification history.

**Header:** "Notifications" title, back button.

**Content:**
- "Clear all" button (aligned right, disabled if no notifications)
- List of notification items (each shows icon, description, timestamp, read/unread state)

**Tap notification:** Navigates to the relevant screen (post, auction, user).

**States:**
- Loading: full-screen spinner
- Empty: "No Notifications — You don't have any notifications yet"
- Pull-to-refresh

---

### Screen: Auctions Won (List)

**Purpose:** Show all auctions the user has won.

**Header:** Title, back button.

**Content:** List of won auction cards.

**Tap card:** → WonAuctionDetails screen.

---

### Screen: Won Auction Details

**Purpose:** Full details of a single won auction, including payment and seller contact information.

**Content:**
- Vehicle details
- Seller contact information
- Payment status
- Next steps for vehicle pickup/delivery

---

### Screen: Bids Screen

**Purpose:** Show the full bid history for an auction.

**How user reaches it:** Vehicle Details → Status tab → "See All Bids".

**Content:** Chronological list of all bids with bidder username, amount, and timestamp.

**Actions:** Tap bidder → UserProfile.

---

### Screen: Auction Reminder

**Purpose:** List of upcoming auctions the user is tracking.

**Header:** Title, back button.

**Content:** List of reminder items showing vehicle name, photo, and time until auction starts.

**Actions:** Tap item → VehicleDetails.

---

### Screen: Active/Past Auctions (AuctionsTabs)

**Purpose:** Show active and past auctions.

**Tabs:** Active Auctions | Past Auctions

**Content:** Auction list items.

---

### Screen: Edit Profile

**Purpose:** Edit user account information.

**Header:** "Edit Profile" title, back button.

**Sections:**
1. **Profile image + banner** — tappable areas to change photos
2. **Notification Settings** — four toggles (email, SMS, in-app, push)
3. **Visibility** — two card options: username only vs. full name + username
4. **Profile form fields** (see Forms section)

**Save button:** "Save" — shows spinner while saving.

**States:**
- Loading: "Loading profile..." spinner
- Success: SuccessModal saying "Profile updated successfully" with Close button → returns to previous screen
- Error: toast with error message + persistent error text below the Save button

---

### Screen: Change Password

**Purpose:** Let users set a new password.

**Header:** "Change Password" title, back button.

**Fields:** Current Password, New Password, Confirm New Password (with password strength indicator).

**Actions:** Submit — shows loading, success modal on completion.

---

### Screen: Payments

**Purpose:** Manage credit/debit cards.

**Header:** Back button.

**Content:** List of saved cards.

**Actions:**
- "Add New Card" button → AddNewCard screen
- Delete card button per item

---

### Screen: Add New Card

**Purpose:** Add a payment method.

**Header:** Back button.

**Fields:** Card number, expiry date, CVV, cardholder name.

**Action:** "Save Card" button.

---

### Screen: Loan Calculator

**Purpose:** Calculate estimated monthly car payments.

**Fields:** Vehicle price, down payment, loan term (months), interest rate (%).

**Output:** Monthly payment amount, updated dynamically.

---

### Screen: Rating / Reviews

**Purpose:** View and write reviews for a user.

**Header:** Back button.

**Content:**
- Overall star rating with breakdown
- Filter bar (All, 5 stars, 4 stars, etc.)
- List of individual reviews

**Actions:**
- Write a review (stars + text field)
- Filter by rating

---

### Screen: FAQ

**Purpose:** Frequently asked questions.

**Header:** "FAQ" title, back button.

**Content:** Collapsible accordion list of questions and answers.

---

### Screen: Terms and Conditions

**Purpose:** Display the terms of service.

**Header:** Back button.

**Content:** Full legal text, scrollable.

**Note:** When opened from Drawer, also shows whether the user has accepted them (Assumption based on parameter passed).

---

### Screen: Privacy Policy

**Purpose:** Display the privacy policy.

**Header:** Back button.

**Content:** Full legal text, scrollable.

---

### Screen: About Us

**Purpose:** Information about Carasta.

**Header:** Back button.

**Content:** Company description and information.

---

### Screen: Support / Send Feedback

**Purpose:** Contact support or submit feedback.

**Header:** Back button.

**Content:** Form with subject and message fields.

**Actions:** Submit button.

---

### Screen: Profile User Page (Public Profile)

**Purpose:** Alternative public profile view for a user (legacy or separate flow from social UserProfile).

**Content:** User information, ratings, auctions.

*(Assumption: may be used for profile links from auction details or older navigation paths.)*

---

## 5. Complete User Flows

### Flow 1: App Launch

1. App opens → Splash screen shown briefly.
2. App checks if user is logged in:
   - **Logged in and onboarded** → Home tab
   - **Mid-onboarding** → Onboarding (resumes at last step)
   - **Not logged in** → GetStartedSplash
3. On GetStartedSplash, user can choose: Sign Up, Log In, or Browse as Guest.

---

### Flow 2: New User Registration (Mobile Number)

1. Welcome screen → "Signup as an individual" or "Signup as a dealership"
2. Gear1 → Gear2 → Gear3 → Gear4 → Gear5 (informational / preference steps)
3. SignUpWithMobile — enter phone number and country code → "Send OTP"
4. OTP screen — enter 6-digit code → verified
5. CreatePassword — set a password
6. Automatically enters Onboarding flow (10 steps)
7. After completing all steps → Home tab

---

### Flow 3: SSO Sign-In (Google / Apple / Facebook)

1. Welcome or Login screen → tap SSO icon
2. Browser / native auth sheet opens
3. User authenticates with provider
4. App receives result:
   - **Existing Carasta user** → redirect to Home tab
   - **New user** → SSO Role Selection Modal asks "Individual or Dealership?"
   - User selects role → Onboarding flow
5. After onboarding → Home tab

**Error states:**
- Auth cancelled → no action, modal closes
- Auth failed → red error message shown for 3.5 seconds

---

### Flow 4: Log In (Username/Password)

1. Login screen → enter username or email + password → "Login"
2. Loading spinner shown
3. **Success:** toast "Login Successful" → Home tab
4. **User not onboarded:** toast then redirect to Onboarding
5. **Failed:** toast with error message

---

### Flow 5: Forgot Password

1. Login screen → "Forgot/Reset Password?"
2. ForgotPassword screen → enter email → submit
3. Email sent confirmation shown
4. User follows link in email, sets new password externally, then logs in

---

### Flow 6: Browsing as Guest

1. GetStartedSplash → "Browse as guest"
2. Directly lands on Home tab (main app, guest mode active)
3. Guest can browse Home tab, Auction tab, Merch tab, Carmunity Home and Search
4. Attempting gated action (bid, favourite, create post, profile, notifications) → prompt to sign up / log in
5. If user logs in → returns to the screen they were on before the prompt

---

### Flow 7: Viewing and Bidding on an Auction

1. Home tab or Auction tab → tap auction card
2. VehicleDetails opens
3. Browse Showroom, Description, Owner's Notes tabs
4. Navigate to Status tab → tap "Place Bid"
5. *If guest:* prompt to sign up
6. Bid input modal opens → enter amount (must be ≥ minimum bid)
7. Confirm → bid submitted
8. Timer may extend; bid count updates in real time for all viewers

---

### Flow 8: Buy it Now

1. Auction card (Home or Auction tab) → tap "Buy it Now" button, OR
2. VehicleDetails → Status tab → tap "Buy it Now"
3. Confirmation modal: "Are you sure you want to buy this vehicle?" with Yes / No
4. Yes → purchase processed
5. Auction is marked as won; user sees won auction in Auctions Won section

---

### Flow 9: Creating a Vehicle Listing

1. List tab → "Add Vehicle"
2. Fill in the form (all required fields)
3. Upload photos (minimum required) and thumbnail
4. Optionally add video and documents
5. Set reserve price and/or Buy it Now price (optional)
6. Set desired start date
7. Tap "Submit" (or "Save as Draft")
8. If submitting: validates minimum photos, thumbnail, and payment method
9. If payment method missing → redirected to AddNewCard → return to listing
10. Upload completes → success toast → back to List tab

---

### Flow 10: Listing a Vehicle as a Seller with No Prior Vehicles (First Time)

1. Same as Flow 9, but at each key field (photos, reserve, buy now, build sheet, notes), a disclosure popup appears automatically.
2. User reads the explanation, taps "I understand".
3. After first disclosure, an info (ⓘ) icon appears next to each field permanently.

---

### Flow 11: Creating a Carmunity Post

1. Carmunity tab → Add Post inner tab (or "Create Post" prompt in Profile tab)
2. Write text
3. Optionally type @ to mention users — dropdown appears — select user
4. Optionally use # for hashtags
5. Optionally attach photos (camera or gallery) or videos
6. Preview media if needed (tap gallery → full-screen modal)
7. Tap "Create Post"
8. Post appears in the feed

---

### Flow 12: Commenting on a Post

1. Post feed or Post Details → tap comment icon
2. Comment sheet opens (bottom sheet on mobile)
3. Type a comment → tap send
4. Comment appears in thread
5. Optionally reply to existing comment → inline reply input

---

### Flow 13: Following a User

1. Find a user (via search, from a post, from notifications)
2. Open their profile
3. Tap "Follow" → button changes to "Following"
4. Their posts now appear in the Home Feed
5. Tap "Following" again → Unfollow

---

### Flow 14: Managing Profile

1. Open drawer → Edit Profile (or tap avatar in Profile tab header)
2. EditProfile screen loads with current data
3. Change any fields
4. Optionally change profile photo (tap avatar → modal: Camera, Gallery, View, Remove)
5. Tap "Save"
6. Loading indicator → SuccessModal "Profile updated successfully" → Close → return

---

### Flow 15: Logout

1. Drawer → "Logout"
2. Confirmation modal: "Are you sure you want to Logout?" → Yes / No
3. Yes → all data cleared → navigate to Login screen

---

### Flow 16: Delete Account

1. Drawer → "Delete Account"
2. Confirmation modal: "Are you sure you want to delete this account?" → Yes / No
3. Yes → account deleted → navigate to Login screen

---

### Flow 17: Received a Notification

1. User receives push notification
2. Opens app → notification badge shown on Carmunity bell icon
3. Tap bell → Notifications tab (Carmunity) or Notifications screen
4. Tap notification item → navigates to relevant screen:
   - Post-related → PostDetails
   - Bid/auction related → VehicleDetails or WonAuctionDetails
   - Follow → UserProfile

---

### Flow 18: Winning an Auction

1. Auction timer runs out, user placed highest bid above reserve
2. "Auction Won" notification sent
3. User taps notification → WonAuctionDetails
4. Sees vehicle info, payment summary, and seller contact details
5. Arranges pickup/delivery with seller

---

### Flow 19: Searching for Auctions

1. Auction tab → search bar
2. Type vehicle name, make, or model
3. Results update as user types (debounced)
4. Optionally filter (tap filter icon → FilterModal)
5. Optionally toggle Favourites to narrow to saved items
6. Tap result → VehicleDetails

---

### Flow 20: Using VIN Lookup

1. AddVehicle form → VIN Number field
2. Type 17-character VIN → tap "Search"
3. Loading spinner in Search button
4. Success: Year, Make, Model, Trim auto-fill
5. Error "Car not found" shown below VIN field
6. If user edits VIN after success, auto-filled fields are cleared

---

## 6. Forms and Input Fields

### Form: Login

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| Username or Email | Text | Yes | Cannot be empty |
| Password | Password (show/hide) | Yes | Cannot be empty |

**Primary action:** Login  
**Secondary actions:** Forgot Username?, Forgot/Reset Password?, Sign Up link

---

### Form: Add Vehicle / Edit Vehicle

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Desired Start Date | Date picker | Yes | Minimum: today |
| Images | Multi-image upload | Yes (min N for submit) | Max N images, 5MB each |
| Video | Video file upload | No | Max 60 seconds |
| Thumbnail | Single image (square crop) | Yes (for submit) | One image only |
| Documents | File upload (PDF etc.) | No | Multiple allowed |
| VIN Number | Text (uppercase, max 17) | No | "Search" auto-fills year/make/model/trim |
| Year | Numeric (4 digits) | Yes | Pattern: 4 digits |
| Make | Autocomplete text | Yes | CarAPI dropdown |
| Model | Autocomplete text | Yes | Dependent on Make |
| Trim | Autocomplete text | No | Dependent on Make/Model/Year |
| Promo Code | Text | No | Optional discount code |
| Dealer ID | Text | Dealerships only | Required for dealership users |
| Reserve (toggle) | Switch | No | Enables reserve price field |
| Reserve Price | Currency numeric | If toggle ON | Must be > 0 |
| Buy it Now? (toggle) | Switch | No | Enables buy now price field |
| Buy it Now Price | Currency numeric | If toggle ON | Must be > 0 |
| Mileage | Numeric (formatted) | Yes (submit) | Comma-formatted |
| Build Sheet | Multi-line text | No | Max 2,000 chars; AI generate button |
| Owner's Notes | Multi-line text | No | Max 2,000 chars |

---

### Form: Edit Profile

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| First Name | Text | Yes (individuals) | Required for non-dealerships |
| Last Name | Text | Yes (individuals) | Required for non-dealerships |
| Dealership Name | Text | Yes (dealerships) | Required for dealerships |
| Username | Text | Yes | Unique |
| Bio | Multi-line text | No | Max 1,000 chars |
| Email | Email | Yes | Valid email format |
| Phone | Phone (+1XXXXXXXXXX) | Yes | 10–13 digits, optional leading + |
| Street Address | Text | No | Optional |
| City | Text | No | Optional |
| State | Dropdown (US States) | Yes | Opens a selection modal |
| Zip Code | Numeric | Yes | Exactly 5 digits |
| Country | Text | No | Optional |
| Push Email | Toggle | No | Notification preference |
| Push Text/SMS | Toggle | No | Notification preference |
| In-App Notifications | Toggle | No | Notification preference |
| Push Notifications | Toggle | No | Notification preference |
| Visibility: username only / full name + username | Radio/card select | No | Updates display name |

---

### Form: Create / Edit Post

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Post text | Multi-line text | Required if no media | Max 280 chars; supports @mentions and #hashtags |
| Media (photos/videos) | File picker | Required if no text | Multiple files; grid preview |

**Actions:** Camera (take photo), Media (choose from library), Create Post (publish)

---

### Form: Onboarding — Username

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Username | Text (lowercase) | Yes | Unique, no special characters |

---

### Form: Onboarding — Personal Information

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Phone Number | Phone with country code | Yes | With country selector |
| State | Dropdown (US States) | Yes | |
| City | Text | Yes | |
| Zip Code | Numeric | Yes | |

---

### Form: Onboarding — Select Interests

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Interests | Multi-select chips | Optional | Car-related categories |

---

### Form: Onboarding — Notifications

| Field | Type | Notes |
|-------|------|-------|
| Email notifications | Toggle | |
| Text (SMS) notifications | Toggle | |
| In-app notifications | Toggle | |
| Push notifications | Toggle | |

---

### Form: Change Password

| Field | Type | Required |
|-------|------|----------|
| Current Password | Password | Yes |
| New Password | Password | Yes |
| Confirm New Password | Password | Yes |

---

### Form: Add New Card

| Field | Type | Required |
|-------|------|----------|
| Card Number | Numeric (card format) | Yes |
| Expiry Date | MM/YY | Yes |
| CVV | Numeric (3–4 digits) | Yes |
| Cardholder Name | Text | Yes |

---

### Form: Loan Calculator

| Field | Type | Notes |
|-------|------|-------|
| Vehicle Price | Currency | |
| Down Payment | Currency | |
| Loan Term | Numeric (months) | |
| Interest Rate | Percentage | |

**Output:** Monthly payment (updates dynamically)

---

### Form: Support / Send Feedback

| Field | Type | Required |
|-------|------|----------|
| Subject | Text | Yes |
| Message | Multi-line text | Yes |

---

## 7. Buttons, Actions, and Controls

### Primary Buttons

| Button | Screen | Action | Disabled State |
|--------|--------|--------|----------------|
| Signup as a dealership | Welcome | → Gear1 with dealership type | No |
| Signup as an individual | Welcome | → Gear1 with individual type | No |
| Log in to your account | Welcome | → Login | No |
| Login | Login | Submit credentials | While loading |
| Add Vehicle | List tab | → AddVehicle screen | No |
| Submit | AddVehicle | Submit listing | While uploading, while loading |
| Save as Draft | AddVehicle | Save without submitting | While loading |
| Place Bid | VehicleDetails – Status | Opens bid modal | Auction not live, not logged in |
| Buy it Now | VehicleDetails, Auction cards | Opens confirmation | Not logged in, auction ended |
| Follow / Unfollow | User profiles | Toggle follow state | While loading |
| Create Post | AddPostTab | Publishes post | Text and media both empty, while loading |
| Save | EditProfile | Saves profile changes | While loading |
| Clear all | Notifications | Deletes all notifications | When list is empty |

---

### Icon Buttons

| Icon | Location | Action |
|------|----------|--------|
| Hamburger (☰) | Home header | Opens right-side drawer |
| User avatar | Home header | → Carmunity Profile tab |
| Heart (♡ / ♥) | Auction cards, VehicleDetails | Toggle favourite/watchlist |
| Three-dot (⋯) | Vehicle list items, Post cards | Opens context menu |
| Back arrow | All stack screens | Go back |
| X (close) | EditPost modal | Close modal |
| Camera | AddVehicle photos section | Open photo picker |
| Video icon | AddVehicle video section | Open video picker |
| Info (ⓘ) | AddVehicle fields | Opens disclosure explanation popup |
| Grid view icon | Auction tab | Switch to grid view |
| List view icon | Auction tab | Switch to list view |
| Filter icon | Auction tab | Opens filter modal |
| Bell icon (with badge) | Carmunity notifications tab | Shows unread count badge |
| Camera icon | Post creation | Open camera |
| Attachment icon | Post creation | Open media library |
| Like icon | Post cards, comments | Like/unlike |
| Comment icon | Post cards | Open comment sheet |
| Repost icon | Post cards | Repost |
| Share icon | Post cards | Share externally |
| Flag icon | Other users' posts (three-dot) | Report post |
| Edit icon | Profile (drawer) | → EditProfile screen |

---

### Toggles / Switches

| Toggle | Location | Effect |
|--------|----------|--------|
| Reserve Price | AddVehicle | Shows/hides reserve price input |
| Buy it Now? | AddVehicle | Shows/hides buy now price input |
| Favourites | Auction tab | Filter to saved auctions only |
| Push Email | EditProfile / Onboarding | Toggle email notification preference |
| Push SMS | EditProfile / Onboarding | Toggle SMS notification preference |
| In-App Notifications | EditProfile / Onboarding | Toggle in-app notifications |
| Push Notifications | EditProfile / Onboarding | Toggle push notifications |
| Show username only / Show full name | EditProfile | Visibility preference |

---

### Filters and Sorting (Auction Tab)

**Filter modal options (Assumption based on code structure):**
- Default / No filter
- Buy it Now (shows only auctions with Buy it Now enabled)
- Price: Low to High
- Price: High to Low
- Ending Soon

**Favourites toggle:** Separate from filter; shows only saved auctions.

---

### Search Bars

| Search | Location | Behaviour |
|--------|----------|-----------|
| Auction search | Auction tab | Searches by vehicle name/make/model, debounced |
| Carmunity search | Search inner tab | Searches posts and people, debounced |
| @mention autocomplete | AddPostTab text input | Fetches matching users on @ trigger |

---

### Pull-to-Refresh

Available on:
- Home tab (all sections)
- Auction tab
- Merch tab
- Carmunity Home feed
- Carmunity Profile posts
- Notifications screen
- Vehicle List (My Listings)

---

### Infinite Scrolling / Pagination

Available on:
- Auction tab (auctions list)
- Carmunity Home feed (posts)
- Carmunity Search results (posts and people)
- Carmunity Profile posts
- Notifications
- Bids screen
- Followers/Following lists

---

## 8. Modals, Popups, and Messages

### Filter Modal (Auction Tab)

**Trigger:** Tap Filter icon in Auction tab.  
**Content:** List of filter options (Default, Buy it Now, Sort options).  
**Actions:** Select an option → closes and applies filter; "Clear" option resets filter.  
**Dismissible:** Yes (tap outside or close).

---

### Bid Modal

**Trigger:** "Place Bid" button in VehicleDetails – Status tab.  
**Content:** Minimum bid amount shown, numeric input field, "Submit Bid" button.  
**Validation:** Must be ≥ minimum bid amount.  
**States:** Loading while submitting; error if too low.  
**Dismissible:** Yes.

---

### Buy it Now Confirmation Modal

**Trigger:** "Buy it Now" button.  
**Title/Content:** "Are you sure you want to buy this vehicle?"  
**Buttons:** Yes (confirm), No (cancel).  
**Loading state:** Yes button shows spinner while processing.  
**Dismissible:** Yes (No button or tap outside).

---

### Logout Confirmation Modal

**Trigger:** Drawer → "Logout".  
**Content:** "Are you sure you want to Logout?"  
**Buttons:** Yes, No.  
**Loading:** Yes button shows spinner.

---

### Delete Account Confirmation Modal

**Trigger:** Drawer → "Delete Account".  
**Content:** "Are you sure you want to delete this account?"  
**Buttons:** Yes, No.  
**Loading:** Yes button shows spinner.

---

### Delete Post Confirmation

**Trigger:** Post three-dot menu → Delete.  
**Content:** Confirmation prompt.  
**Buttons:** Delete, Cancel.

---

### SSO Role Selection Modal

**Trigger:** After a new user signs in via Google, Apple, or Facebook.  
**Content:** "Are you signing up as an individual or a dealership?"  
**Buttons:** Individual, Dealership.  
**Dismissible:** No (user must choose a role).

---

### App Update Modal

**Trigger:** On app launch when a new version is available.  
**Content:** "A new version is available. Please update to continue."  
**Buttons:** Update (opens App Store/Play Store link).  
**Dismissible:** Not dismissible if mandatory update; may have "Later" if optional. (Assumption)

---

### Disclosure Modals (First-Time Seller)

**Triggers:** First-time sellers focusing on or activating Photos, Reserve Price, Buy it Now, Build Sheet, Owner's Notes fields.  
**Content:** Explanation of the field and what it means.  
**Button:** "I understand" (confirms and dismisses).  
**Dismissible:** Only via the "I understand" button on first display. Can be re-opened via ⓘ icon.

---

### Vehicle Status Modal

**Trigger:** Vehicle list item → three-dot menu → View Status.  
**Content:** Current auction status — bid count, highest bid, time remaining.  
**Dismissible:** Yes.

---

### Manage Auction Sheet

**Trigger:** Vehicle list item → three-dot menu → Manage Auction.  
**Type:** Bottom sheet (slides up from bottom).  
**Content:** Auction management options (reschedule, extend, etc.).  
**Dismissible:** Yes (swipe down or close button).

---

### Unsaved Changes Alert

**Trigger:** Navigating back from AddVehicle when form has unsaved data.  
**Content:** "You have unsaved changes."  
**Buttons:** Save as Draft, Discard, Cancel.  
**Cannot be dismissed without choosing an option.**

---

### AllBidSheet (All Bids)

**Trigger:** "See All Bids" in VehicleDetails – Status tab.  
**Type:** Bottom sheet.  
**Content:** Complete bid history list with bidder names and amounts.

---

### Comment Sheet

**Trigger:** Tapping comment icon on a post.  
**Type:** Bottom sheet (slides up from bottom).  
**Content:** Comment list + comment input.  
**Dismissible:** Swipe down.

---

### Profile Image Modal

**Trigger:** Tapping profile photo in profile views.  
**Content:** Options — Camera, Gallery, View full photo, Remove photo.  
**Dismissible:** Yes.

---

### Image Gallery Popup

**Trigger:** Tapping a photo in the Showroom or post media.  
**Type:** Full-screen overlay.  
**Content:** Zoomable, swipeable photos.  
**Dismissible:** Back button or swipe down.

---

### Video Player Modal

**Trigger:** Tapping a video thumbnail.  
**Type:** Full-screen overlay.  
**Content:** Video player with playback controls.  
**Dismissible:** Close button.

---

### State Picker Modal (US States)

**Trigger:** Tapping State field in EditProfile or Onboarding.  
**Content:** Scrollable list of all US states.  
**Actions:** Tap a state → fills the field, closes modal.  
**Dismissible:** Tap outside.

---

### Picker Modal (Generic)

**Trigger:** Any dropdown-style picker field.  
**Content:** Scrollable list of options.  
**Dismissible:** Tap outside or select an option.

---

### Add Card Info Modal

**Trigger:** Certain flows prompt adding a card inline.  
**Content:** Card information form (number, expiry, CVV).  
**Dismissible:** Cancel button.

---

### Success Modal

**Trigger:** After successfully updating profile.  
**Content:** "Profile updated successfully" with a checkmark icon.  
**Button:** Close.

---

### Toast Messages (Custom Toast)

**Trigger:** After actions like login, listing submit, profile save, post create.  
**Type:** Non-blocking notification at the top or bottom of the screen.  
**Duration:** Auto-dismisses after a few seconds. Tappable to dismiss.  
**Variants:**
- Success: green/positive (e.g. "Login Successful", "Vehicle saved as draft successfully")
- Error: red/negative (e.g. "Something went wrong", backend error message)
- Info: neutral (e.g. "Please wait! Images are uploading")

---

### Alert (System Alert)

**Used for:** Critical errors that need immediate attention (e.g. submission errors, Stripe errors, buy now failure).  
**Format:** Native OS alert dialog with "OK" or action buttons.  
**Not dismissible without acknowledging.**

---

### Empty State Components

**Type:** Inline illustration/message block (not a modal).  
**Shown for:**
- No auctions
- No vehicles
- No notifications
- No posts
- No search results
- No merch

---

## 9. User Types and Conditional Experiences

### Guest vs. Logged-In User

| Feature | Guest | Logged-In |
|---------|-------|-----------|
| Browse Home tab | ✅ | ✅ |
| Browse Auction tab | ✅ | ✅ |
| View Vehicle Details | ✅ (read-only) | ✅ |
| Place a bid | ❌ → prompt | ✅ |
| Buy it Now | ❌ → prompt | ✅ |
| Favourite an auction | ❌ → prompt | ✅ |
| Browse Merch tab | ✅ | ✅ |
| Browse Carmunity Home | ✅ (read-only) | ✅ |
| Search in Carmunity | ✅ (read-only) | ✅ |
| Create a post | ❌ → placeholder | ✅ |
| View notifications | ❌ → placeholder | ✅ |
| View own profile | ❌ → placeholder | ✅ |
| Manage listings | ❌ → placeholder | ✅ |
| Access drawer items | Limited (FAQ, T&C, Privacy, Sign Up, Login, Exit) | Full |
| Drawer profile section | Shows "Browsing as Guest" | Shows photo + name |

---

### Individual User vs. Dealership User

| Feature | Individual | Dealership |
|---------|-----------|-----------|
| Profile displays | First name + Last name | Dealership name |
| Dealer ID field in listings | ❌ | ✅ Required |
| Dealership Name field in profile | ❌ | ✅ |
| Otherwise identical | ✅ | ✅ |

---

### Auction Owner (Seller) vs. Other Users (Buyers)

| Feature | Seller | Other Users |
|---------|--------|-------------|
| "Lift Reserve" button | ✅ (visible in Status tab) | ❌ |
| "Change Reserve" button | ✅ | ❌ |
| Manage Auction Sheet (from List tab) | ✅ | ❌ |
| Edit / Delete vehicle | ✅ (from List tab) | ❌ |
| Place a bid on own auction | ❌ | ✅ |
| Post three-dot menu | Edit, Delete | Report |

---

### Post Owner vs. Other Users

| Feature | Own Post | Other's Post |
|---------|----------|-------------|
| Three-dot menu | Edit, Delete | Report |
| Edit post action | ✅ | ❌ |
| Delete post action | ✅ | ❌ |

---

### First-Time Seller vs. Returning Seller

| Feature | First-Time (no prior vehicles) | Returning (has vehicles) |
|---------|-------------------------------|--------------------------|
| Disclosure popups on fields | ✅ Auto-triggered | ❌ Not auto-triggered |
| Info (ⓘ) icon on fields | ✅ After viewing disclosure | ✅ Always visible |

---

### New User vs. Returning User

| Feature | New User | Returning |
|---------|----------|-----------|
| Onboarding flow | ✅ Shown | ❌ Skipped |
| SSO role selection | ✅ On first SSO | ❌ Not shown again |

---

### Complete Profile vs. Incomplete Profile

*(Assumption)* If a user has not completed onboarding, they are directed to complete it before accessing the main app.

---

## 10. Application States

### Loading States

| Screen / Component | Loading Behaviour |
|-------------------|-------------------|
| App launch / Splash | Logo + spinner |
| Home sections | Individual section spinners |
| Auction tab (initial load) | Full-screen spinner |
| Vehicle Details | Full-screen spinner |
| My Listings (initial load) | Full-screen spinner |
| AddVehicle (preparing pools) | "Preparing..." full-screen spinner |
| AddVehicle video compressing | Semi-transparent overlay "Please wait while we process" |
| AddVehicle uploading images | Per-image progress in UploadQueue component |
| AddVehicle submitting | CustomLoader overlay |
| EditProfile loading | "Loading profile..." spinner |
| EditProfile saving | Spinner on Save button |
| Login | Spinner on Login button, fields disabled |
| SSO buttons | Spinner inside the tapped icon |
| Notification tap action | Full-screen spinner (getting auction/post data) |
| Buy it Now | Spinner in confirmation modal Yes button |
| Logout | Spinner in confirmation modal Yes button |
| Delete Account | Spinner in confirmation modal Yes button |
| Merch | Full-screen spinner (CustomLoader) |
| Notifications (initial load) | Full-screen spinner |

---

### Empty States

| Screen | Empty State Message |
|--------|-------------------|
| Auction tab | "No Auctions — There are no auctions available at the moment" |
| My Listings | "No Vehicles Found — You have not added any vehicle yet" |
| Notifications | "No Notifications — You don't have any notifications yet" |
| Carmunity Home feed | "No posts yet — Public posts from the community will appear here." |
| Carmunity Search (no query) | "Try searching something — Your search results will show up here" |
| Carmunity Search – Posts (no results) | "No posts found — Try searching with different keywords" |
| Merch | "Stay tuned for the upcoming Merch..." |
| Garage | (empty vehicle grid) |

---

### Error States

| Scenario | Behaviour |
|----------|-----------|
| Login failed | Toast with backend error message |
| SSO failed | Red error text for 3.5 seconds |
| Submit listing failed | Toast with error message |
| Profile update failed | Toast + persistent error text below Save button |
| Buy it Now failed | System Alert |
| VIN not found | "Car not found" below VIN field |
| Merch link unavailable | Alert "Link unavailable — This item does not have a purchase link yet." |
| Merch link cannot open | Alert "Error — Could not open this link." |
| General network error | Toast "Something went wrong" |
| Auction has ended | Alert "Auction Ended" |

---

### Success States

| Scenario | Behaviour |
|----------|-----------|
| Login | Toast "Login Successful" → navigates to Home |
| SSO login | Toast "Signed in with [Provider]!" → navigates to Home |
| Vehicle submitted | Toast "Vehicle submitted for auction successfully" → back to List tab |
| Vehicle saved as draft | Toast "Vehicle saved as draft successfully" → back |
| Profile updated | SuccessModal + toast → returns to previous screen |
| Post created | Text and media cleared, ready for next post |
| Comment posted | Comment appears in thread |

---

### Disabled States

| Element | Disabled When |
|---------|---------------|
| Login button | While API call is loading |
| Submit button (AddVehicle) | While uploading, while loading |
| Save as Draft button | While loading |
| VIN Search button | While searching |
| Build Sheet Generate button | While generating |
| Create Post button | No text and no media, while loading |
| "Clear all" notifications | No notifications in list |
| Buy it Now button | Not logged in; auction ended |
| SSO icon buttons | While another SSO is loading |
| Form fields during login | While API call is in progress |

---

### Guest / Permission Denied States

| Screen / Action | Guest Sees |
|-----------------|-----------|
| Carmunity Add Post tab | GuestTabPlaceholder: "Sign up to share posts, photos, and connect with the Carasta community." + Sign Up / Log In buttons |
| Carmunity Notifications tab | GuestTabPlaceholder: "Sign up to receive notifications..." + Sign Up / Log In buttons |
| Carmunity Profile tab | GuestTabPlaceholder: "Sign up to create your profile..." + Sign Up / Log In buttons |
| List tab | GuestTabPlaceholder: "Sign up to list your vehicles, manage auctions, and start selling on Carasta." + Sign Up / Log In buttons |
| Gated action (bid, favourite, etc.) | Prompt: navigates to Login or Welcome |

---

## 11. Mobile-to-Web Adaptation Guide

### Functionality That Must Stay the Same

The following core features and user flows must be fully available on the web:

- Browse and search live auctions
- View full vehicle details (photos, video, description, build sheet, owner's notes)
- Real-time bid placement and bid history
- Buy it Now purchase flow
- Save/favourite auctions (watchlist)
- Create and manage vehicle listings (upload photos, video, documents)
- Carmunity social feed (view, create, like, comment, repost posts)
- @mention support in post creation
- User profiles with Posts, Bio, Auctions, Garage tabs
- Follow/unfollow users
- Search posts and people
- In-app notifications
- Won auctions view and details
- Payments (credit card management)
- Edit profile
- Loan calculator
- Merch shop
- Onboarding for new users
- Guest browsing mode
- FAQ, Terms, Privacy Policy, About Us pages

---

### Mobile Patterns That Should Be Adapted

| Mobile Pattern | Why It Exists | Web Alternative |
|----------------|--------------|-----------------|
| Bottom navigation tabs (5 tabs) | Primary navigation on small screen | Top navigation bar or sidebar |
| Right-side slide-out drawer | Secondary/profile navigation | Top-right dropdown menu or sidebar |
| Bottom sheets (comments, manage auction, all bids) | Space-efficient overlay for secondary content | Dialog/modal panel or side panel |
| Full-screen modal for EditPost | Focus-mode editing | Inline modal or dedicated page |
| Pull-to-refresh (swipe down) | Mobile scroll interaction | "Refresh" button or auto-refresh |
| Infinite scroll with FlatList | Touch-native scrolling | Infinite scroll or pagination controls |
| Floating bottom tab bar | Navigation overlay above content | Fixed top/side navigation |
| Native camera access | Direct camera for photo/video | File upload with drag-and-drop; camera on supported browsers |
| Native image picker | System photo picker | File upload dialog with multi-select |
| Native document picker | System file picker | File upload dialog |
| Mobile-first full-screen forms | Screen takes full phone height | Structured form panels on web |
| Long-press context menus | Touch gesture | Right-click context menu or three-dot dropdown |
| Swipe gestures on images | Touch navigation | Arrow buttons or keyboard navigation |
| Touch-and-drag image reordering (UploadQueue) | Mobile drag-to-reorder | Drag-and-drop with mouse |
| Push notifications (native) | Device-level alerts | Browser notifications (Web Push API) |
| Status bar styling | Native OS bar | Browser tab / title bar |
| Safe-area insets (notch padding) | Hardware-specific spacing | Not needed |
| Native Apple Pay / Google Pay | Device wallet | Stripe.js or web payment form |

---

### Recommended Web Alternatives

**Navigation:**
- Replace the bottom 5-tab bar with a **persistent top navigation bar** containing: Home, Auction, List, Merch, Carmunity.
- Replace the right-side drawer with a **top-right user dropdown menu** containing: profile photo, name, and all drawer menu items.
- Carmunity's 5 inner tabs (Home, Search, Add Post, Notifications, Profile) become **sub-navigation tabs** within the Carmunity section, styled as a horizontal tab bar at the top of the section.

**Auction Browsing:**
- The Home tab's horizontal scroll sections (Auction Spotlight, Upcoming, etc.) can become **horizontal scroll carousels** or expand into multi-column grids on desktop.
- Auction grid/list toggle stays the same logic; default to multi-column grid on desktop (3–4 columns).
- Search and filter controls become a persistent **left sidebar filter panel** on desktop, or a filter bar above results on tablet/mobile web.

**Vehicle Details:**
- The horizontal tab bar (Showroom, Description, Owner's Notes, Status, Comments) becomes a **horizontal tab navigation** within the page.
- The Showroom photo gallery becomes a full-width hero slider with thumbnail strip.
- On desktop, Status tab content can be shown in a **sticky right column** alongside the main content rather than in a separate tab.
- Comments become a full-width thread at the bottom of the page (similar to any web comments section).
- Bidding controls (bid input, Buy it Now button, countdown) are displayed prominently in the right column or a sticky auction bar.

**Adding a Vehicle:**
- The multi-step mobile form becomes a **multi-section single-page form** or **stepped wizard** on web.
- Photo upload becomes a **drag-and-drop zone** with multi-file support and inline progress bars.
- Image reordering becomes **drag-and-drop grid reordering**.
- VIN lookup stays as a text input with a "Search" button.
- Disclosure popups become **tooltip/info popovers** accessible via ⓘ icons.

**Social Feed (Carmunity):**
- Posts in the feed use a **fixed-width center column** (similar to Twitter/Facebook feed) with a right sidebar for "Suggested Users" on desktop.
- The Add Post area appears at the top of the feed as an **inline post composer**.
- Comment threads expand inline below a post or in a right-side panel.
- @mention autocomplete becomes a **dropdown list** anchored to the text cursor position.
- Media attachment uses standard file input with preview grid.

**Forms:**
- All full-screen forms become **contained panels with proper labels**, error states, and save/cancel buttons.
- Date pickers use browser-native date inputs or a web date picker component.
- US State dropdown uses a `<select>` element or a searchable dropdown.

**Modals and Popups:**
- Bottom sheets become **centered or bottom-anchored dialogs** on web.
- Confirmation dialogs use standard web modals.
- Success/error toasts are positioned at the top or bottom of the screen and auto-dismiss.

**User Profiles:**
- Profile header with cover photo and avatar stays the same layout.
- The sticky sub-tabs (Posts, Bio, Auctions, Garage) remain a sticky tab bar.
- On desktop, a two-column layout is possible (profile info left, content right).

---

### Responsive Behaviour

| Section | Desktop (≥ 1024px) | Tablet (600–1023px) | Mobile Web (< 600px) |
|---------|--------------------|--------------------|---------------------|
| Navigation | Top nav bar + user dropdown | Top nav bar (condensed) | Hamburger menu |
| Home sections | 4-column auction grid | 2–3 column grid | 1–2 column grid |
| Auction tab | 3–4 column grid or list | 2 column grid | 1–2 column grid |
| Vehicle Details | Two-column (media left, bid info right) | Stacked single column with tabs | Stacked, tabs scroll |
| Add Vehicle form | Two-column form with photo upload on left | Single column | Single column |
| Carmunity feed | Fixed center column + right sidebar | Full width feed | Full width feed |
| Profile page | Two-column (avatar/info left, content right) | Stacked | Stacked |
| Merch grid | 4 columns | 3 columns | 2 columns |
| Modals | Centered with max-width | Centered | Full-screen or bottom sheet |
| Notifications | Dropdown or dedicated page | Dedicated page | Dedicated page |

---

## 12. Designer Coverage Checklist

### Screens

- [x] Splash screen
- [x] Get Started Splash
- [x] Welcome screen
- [x] Login screen
- [x] Forgot Password screen
- [x] Forgot Username screen
- [x] Two-Factor Authentication screen
- [x] Create Password screen
- [x] Sign Up flow (Gear 1–5, SignUpWithMobile, OTP)
- [x] Onboarding (all 10 steps)
- [x] Home tab
- [x] Auction tab (auction list)
- [x] Vehicle Details (all 5 tabs: Showroom, Description, Owner's Notes, Status, Comments)
- [x] List tab (My Listings / VehicleList)
- [x] Add Vehicle screen
- [x] Edit Vehicle screen
- [x] Merch tab
- [x] Carmunity tab (outer)
- [x] Carmunity – Home feed tab
- [x] Carmunity – Search tab
- [x] Carmunity – Add Post tab
- [x] Carmunity – Notifications tab
- [x] Carmunity – Profile tab
- [x] User Profile (other users)
- [x] Followers / Following lists
- [x] All Users Screen
- [x] Post Details screen
- [x] Edit Post screen (modal)
- [x] Garage screen (My Garage + Won Auctions tabs)
- [x] Vehicle Gallery
- [x] Notifications screen (standalone)
- [x] Auctions Won list
- [x] Won Auction Details
- [x] Bids screen
- [x] Auction Reminder screen
- [x] Active/Past Auctions tabs
- [x] Edit Profile screen
- [x] Change Password screen
- [x] Payments screen
- [x] Add New Card screen
- [x] Loan Calculator screen
- [x] Rating / Reviews screen
- [x] FAQ screen
- [x] Terms and Conditions screen
- [x] Privacy Policy screen
- [x] About Us screen
- [x] Support / Send Feedback screen
- [x] Right-side drawer (logged-in)
- [x] Right-side drawer (guest)
- [x] ListDetails screen
- [x] CaramalView screen
- [x] Explore screen
- [x] DeliveriesList screen
- [x] GetAuction screen (deep link)
- [x] AuctionDetails (from Carmunity)

### Navigation

- [x] Bottom tab navigation (5 tabs)
- [x] Right-side drawer (hamburger menu)
- [x] Carmunity inner tab navigation (5 inner tabs)
- [x] Stack navigation (all push screens)
- [x] Deep links (PostDetails, AuctionDetails, stripe-connect)
- [x] Back navigation behaviour
- [x] Guest guard and redirect-back behaviour

### Features

- [x] Real-time auctions (bidding, timers, live updates)
- [x] Buy it Now
- [x] Watchlist / Favourites
- [x] Vehicle listing creation (full form)
- [x] Vehicle listing management
- [x] VIN lookup
- [x] AI Build Sheet generation
- [x] Background image uploads with progress
- [x] Image reordering
- [x] Video upload and preview
- [x] Document upload
- [x] Reserve price (toggle, seller lift, change)
- [x] Social posts (create, edit, delete, report)
- [x] @mentions in posts
- [x] #hashtags
- [x] Media attachments (photos, video)
- [x] Post interactions (like, comment, repost, share)
- [x] Comments with replies
- [x] Follow / unfollow
- [x] Notifications (all types)
- [x] Notification badge
- [x] Onboarding (10 steps)
- [x] Guest mode
- [x] SSO (Google, Apple, Facebook)
- [x] Profile management
- [x] Notification preferences
- [x] Profile visibility settings
- [x] Garage and Won Auctions
- [x] Payments (credit cards)
- [x] Loan calculator
- [x] Reviews and ratings
- [x] Merch store
- [x] Disclosure popups (first-time seller)
- [x] App update check
- [x] Auction reminders
- [x] Deliveries section

### User Flows

- [x] App launch routing
- [x] New user registration (mobile)
- [x] SSO sign-in (new + existing)
- [x] Username/password login
- [x] Forgot password
- [x] Forgot username
- [x] Guest browsing
- [x] Onboarding
- [x] Viewing and bidding on an auction
- [x] Buy it Now
- [x] Creating a vehicle listing
- [x] First-time seller disclosures
- [x] Creating a post with @mentions
- [x] Commenting on a post
- [x] Following a user
- [x] Managing profile
- [x] Logout
- [x] Delete account
- [x] Receiving and acting on notifications
- [x] Winning an auction
- [x] Searching for auctions
- [x] VIN lookup

### Forms and Fields

- [x] Login form
- [x] Add/Edit Vehicle form (all fields)
- [x] Edit Profile form (all fields)
- [x] Create/Edit Post form
- [x] Onboarding forms (all steps)
- [x] Change Password form
- [x] Add New Card form
- [x] Loan Calculator form
- [x] Support/Feedback form

### Buttons and Actions

- [x] All primary action buttons
- [x] All icon buttons
- [x] All toggles and switches
- [x] Filters and sort controls
- [x] Search bars
- [x] Pull-to-refresh
- [x] Infinite scroll / pagination
- [x] Context menus (three-dot)

### Modals and Messages

- [x] Filter modal
- [x] Bid input modal
- [x] Buy it Now confirmation
- [x] Logout confirmation
- [x] Delete Account confirmation
- [x] Delete Post confirmation
- [x] SSO Role Selection Modal
- [x] App Update Modal
- [x] Disclosure popups
- [x] Vehicle Status Modal
- [x] Manage Auction Sheet
- [x] Unsaved Changes Alert
- [x] All Bids Sheet
- [x] Comment Sheet
- [x] Profile Image Modal
- [x] Full-screen image viewer
- [x] Video player
- [x] US State picker
- [x] Success Modal
- [x] Toast messages (success + error + info)
- [x] System alerts
- [x] Empty state components

### States

- [x] All loading states
- [x] All empty states
- [x] All error states
- [x] All success states
- [x] All disabled states
- [x] Guest/permission-denied states
- [x] Real-time update states (bids, timers)

### User Types

- [x] Guest vs. logged-in differences
- [x] Individual vs. dealership differences
- [x] Seller vs. buyer differences
- [x] Post owner vs. viewer differences
- [x] First-time seller vs. returning seller differences
- [x] New user vs. returning user differences

### Mobile-to-Web

- [x] All mobile navigation patterns identified
- [x] All mobile-specific interactions identified
- [x] Web alternatives suggested for all patterns
- [x] Responsive behaviour described for desktop, tablet, and mobile web

---

*Document last updated: July 2026 — Carasta v1 (iOS/Android) — Prepared for Web Design Handoff*
