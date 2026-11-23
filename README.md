# CSE 463 Milestone 1 — Harkins Theatres Online Ticket & Concessions Prototype

**Live Interactive Prototype:** `https://sereneakhtar.github.io/CSE463_Milestone1_Capstone/`

## Project Overview
An interactive 7-state web prototype redesigning the online ticket and mobile concessions workflow for **Harkins Theatres**. Built in HTML, CSS, and JavaScript to address usability friction in showtime filtering, persistent seat visibility, upfront fee/budget transparency, and non-destructive error recovery.

## User Scenario & Constraints
- **Goal:** Book two adjacent center seats (`F7`, `F8`) for a Saturday afternoon (`1:00 PM – 4:00 PM`) **CINÉXL** recliner screening and pre-order two drinks and one snack for mobile pickup.
- **Budget Cap:** `$55.00` total (including tickets, concessions, and the `$3.25` online convenience fee).
- **Recovery Condition:** Entering an invalid promo code (anything other than `HARKINS10`) or triggering an out-of-stock snack on **S5** routes to **S6 (Recovery State)** while preserving all valid selections (`F7`, `F8`, tickets, drinks, and buyer info).

## Prototype States (`S1`–`S7`)

| State | Screen Name | Core Functionality |
| :--- | :--- | :--- |
| **S1** | Showtime & Format Selection | Filter showtimes (`All Showtimes`, `CINÉXL Recliner`, `Afternoon 1–4 PM`) and select a screening. |
| **S2** | Interactive Seat Map | Inspect recliner rows and select two adjacent seats (`F7`, `F8`) with live budget tracking. |
| **S3** | Ticket Tier & Checkout Mode | Select two matinee tickets and choose Guest Checkout or Harkins Awards mode. |
| **S4** | Mobile Concessions Menu | Add fountain drinks, choose one snack item, and select mobile pickup timing. |
| **S5** | Order Summary & Checkout Form | Review full itemized breakdown, edit seats/snacks, test promo codes, and enter buyer info. |
| **S6** | Recovery State | Inspect promo/stock errors with preserved selections and apply a one-click fix back to **S5**. |
| **S7** | Booking Confirmation & Mobile Pass | View confirmation ID, seats (`F7`, `F8`), concession pickup details, and final simulated total. |

## How to Run & Reset
1. Open the live GitHub Pages link in any modern web browser (no login required).
2. Click **Reset Prototype** in the top-right header (or **Start New Order / Reset (S1)** on **S7**) at any time to restore the default **S1** state.

## Simulated Scope & Limitations
- Seat availability, pricing, `$3.25` online fee, `$55.00` budget check, promo validation (`HARKINS10` applies `$5.00` off; any other entry triggers **S6**), stock-out simulation, and payment confirmation run locally in JavaScript using fictional buyer data.
- No real payment processing or live theater backend APIs are connected.
