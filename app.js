const TICKET_PRICE = 14.50;
const FEE_PER_ORDER = 3.25;
const SNACKS = [
  { id: 'popcorn', name: 'Classic Butter Popcorn (Reg)', price: 7.50, outOfStockDefault: false },
  { id: 'pretzel', name: 'Warm Pretzel Bites + Cheese', price: 8.25, outOfStockDefault: true }
];
const DRINK_PRICE = 4.25;
const TAKEN_SEATS = ['E5', 'E6', 'F7'];
const ALL_SEATS = ['E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'];

const initialState = () => ({
  state: 'S1',
  filter: 'all',
  showtime: 'Sat 2:15 PM • CINÉXL Ultimate Lounger®',
  seats: ['F7', 'F8'],
  ticketQty: 2,
  checkoutMode: 'Guest Checkout',
  drinksQty: 2,
  snackId: 'popcorn',
  snackOutOfStock: false,
  pickupTime: 'Upon Arrival',
  promoInput: '',
  promoApplied: false,
  discount: 0,
  recoveryReason: '',
  buyerName: 'Alex Rivera',
  cardLast4: '4242',
  orderId: 'HK-2026-8841'
});

let app = initialState();

function resetPrototype() {
  app = initialState();
  render();
}

function go(nextState) {
  app.state = nextState;
  render();
}

function getTotals() {
  const ticketsCost = app.ticketQty * TICKET_PRICE;
  const drinksCost = app.drinksQty * DRINK_PRICE;
  const snackObj = SNACKS.find(s => s.id === app.snackId);
  const snackCost = (!app.snackOutOfStock && snackObj) ? snackObj.price : 0;
  const subtotal = ticketsCost + drinksCost + snackCost + FEE_PER_ORDER;
  const total = Math.max(0, subtotal - app.discount);
  return { ticketsCost, drinksCost, snackCost, snackObj, total };
}

function renderSummary() {
  const t = getTotals();
  const within = t.total <= 55.00;
  document.getElementById('summary-view').innerHTML = `
    <h3>Order & Budget Tracker</h3>
    <p class="muted">Persistent summary across states</p>
    <div class="summary-row"><span>Showtime:</span><strong>${app.showtime}</strong></div>
    <div class="summary-row">
      <span>Seats (${app.seats.length}):</span>
      <strong>${app.seats.length ? app.seats.join(', ') : 'None'}</strong>
    </div>
    <div class="summary-row"><span>Tickets (${app.ticketQty}x):</span><span>$${t.ticketsCost.toFixed(2)}</span></div>
    <div class="summary-row"><span>Drinks (${app.drinksQty}x):</span><span>$${t.drinksCost.toFixed(2)}</span></div>
    <div class="summary-row">
      <span>Snack:</span>
      <span>${app.snackOutOfStock ? 'Unavailable' : `${t.snackObj.name} ($${t.snackCost.toFixed(2)})`}</span>
    </div>
    <div class="summary-row"><span>Pickup:</span><span>${app.pickupTime}</span></div>
    <div class="summary-row"><span>Online Fee:</span><span>$${FEE_PER_ORDER.toFixed(2)}</span></div>
    ${app.discount > 0 ? `<div class="summary-row"><span>Promo Discount:</span><span>-$${app.discount.toFixed(2)}</span></div>` : ''}
    <div class="summary-row total-row"><span>Estimated Total:</span><span>$${t.total.toFixed(2)}</span></div>
    <div class="${within ? 'budget-ok' : 'budget-over'}">
      ${within
        ? `Within $55.00 budget ($${(55 - t.total).toFixed(2)} remaining).`
        : `Over $55.00 budget by $${(t.total - 55).toFixed(2)}.`}
    </div>
  `;
}

function toggleSeat(seat) {
  if (TAKEN_SEATS.includes(seat)) return;
  if (app.seats.includes(seat)) {
    app.seats = app.seats.filter(s => s !== seat);
  } else {
    if (app.seats.length >= 2) app.seats.shift();
    app.seats.push(seat);
  }
  render();
}

function applyPromoOrCheckout(fromPromoBtn) {
  const code = app.promoInput.trim().toUpperCase();
  if (fromPromoBtn && code && code !== 'HARKINS10') {
    app.recoveryReason = `Promo code "${app.promoInput.trim()}" is invalid or expired. Your seats (${app.seats.join(', ') || 'none'}) and order details are preserved.`;
    go('S6');
    return;
  }
  if (app.snackOutOfStock) {
    app.recoveryReason = `Your selected snack item is currently out of stock at this theater. Your reserved seats (${app.seats.join(', ')}) and checkout info are preserved.`;
    go('S6');
    return;
  }
  if (fromPromoBtn && code === 'HARKINS10') {
    app.promoApplied = true;
    app.discount = 5.00;
    render();
    return;
  }
  if (!fromPromoBtn) {
    go('S7');
  }
}

function resolveRecovery(actionType) {
  if (actionType === 'clearPromo') {
    app.promoInput = '';
    app.promoApplied = false;
    app.discount = 0;
  } else if (actionType === 'swapSnack') {
    app.snackOutOfStock = false;
    app.snackId = 'popcorn';
  }
  app.recoveryReason = '';
  go('S5');
}

function render() {
  document.getElementById('header-state').textContent = `State: ${app.state}`;
  const main = document.getElementById('main-view');

  if (app.state === 'S1') {
    const showtimes = [
      { label: 'Sat 11:30 AM • Standard Seating', type: 'standard', window: 'morning' },
      { label: 'Sat 2:15 PM • CINÉXL Ultimate Lounger®', type: 'cinexl', window: 'afternoon' },
      { label: 'Sat 3:30 PM • CINÉXL Ultimate Lounger®', type: 'cinexl', window: 'afternoon' },
      { label: 'Sat 7:45 PM • CINÉXL Ultimate Lounger®', type: 'cinexl', window: 'evening' }
    ].filter(st => {
      if (app.filter === 'cinexl') return st.type === 'cinexl';
      if (app.filter === 'afternoon') return st.window === 'afternoon';
      return true;
    });

    main.innerHTML = `
      <div class="state-tag">S1 • Showtime & Format Selection</div>
      <h2>Choose a Saturday Showtime</h2>
      <p class="muted">Filter by auditorium format or time window to locate your screening.</p>
      <div class="filter-row">
        <button class="${app.filter === 'all' ? 'secondary' : ''}" onclick="app.filter='all'; render();">All Showtimes</button>
        <button class="${app.filter === 'cinexl' ? 'secondary' : ''}" onclick="app.filter='cinexl'; render();">CINÉXL Recliner</button>
        <button class="${app.filter === 'afternoon' ? 'secondary' : ''}" onclick="app.filter='afternoon'; render();">Afternoon (1–4 PM)</button>
      </div>
      ${showtimes.map(st => `
        <div class="showtime-card ${app.showtime === st.label ? 'selected-box' : ''}">
          <div>
            <strong>${st.label}</strong><br />
            <span class="muted">Chandler Fashion 20 • Reserved Recliner</span>
          </div>
          <button class="primary" onclick="app.showtime='${st.label}'; go('S2');">Select & Pick Seats</button>
        </div>
      `).join('')}
    `;
  } else if (app.state === 'S2') {
    main.innerHTML = `
      <div class="state-tag">S2 • Interactive Seat Map</div>
      <h2>Select 2 Adjacent Center Seats</h2>
      <p class="muted">Active screening: <strong>${app.showtime}</strong>. Pick up to 2 seats (default: E7, E8).</p>
      <div class="screen-bar">AUDITORIUM SCREEN — CINÉXL RECLINER ROW</div>
      <div class="seat-grid">
        ${ALL_SEATS.map(s => {
          const taken = TAKEN_SEATS.includes(s);
          const picked = app.seats.includes(s);
          return `<button type="button" class="seat ${taken ? 'taken' : ''} ${picked ? 'picked' : ''}" ${taken ? 'disabled' : ''} onclick="toggleSeat('${s}')">${s}${taken ? ' (X)' : ''}</button>`;
        }).join('')}
      </div>
      <p class="muted">Selected seats: <strong>${app.seats.length ? app.seats.join(', ') : 'None selected'}</strong></p>
      <div class="nav-footer">
        <button onclick="go('S1')">Back to Showtimes (S1)</button>
        <button class="primary" ${app.seats.length < 2 ? 'disabled' : ''} onclick="go('S3')">Continue to Tickets (S3)</button>
      </div>
    `;
  } else if (app.state === 'S3') {
    main.innerHTML = `
      <div class="state-tag">S3 • Ticket Tier & Checkout Mode</div>
      <h2>Confirm Tickets & Checkout Option</h2>
      <label for="tqty">Number of Matinee Tickets ($14.50 each)</label>
      <select id="tqty" onchange="app.ticketQty = Number(this.value); render();">
        <option value="1" ${app.ticketQty === 1 ? 'selected' : ''}>1 Ticket ($14.50)</option>
        <option value="2" ${app.ticketQty === 2 ? 'selected' : ''}>2 Tickets ($29.00)</option>
      </select>
      <label for="cmode">Checkout Mode</label>
      <select id="cmode" onchange="app.checkoutMode = this.value; render();">
        <option value="Guest Checkout" ${app.checkoutMode === 'Guest Checkout' ? 'selected' : ''}>Guest Checkout (Fastest)</option>
        <option value="Harkins Awards Member" ${app.checkoutMode === 'Harkins Awards Member' ? 'selected' : ''}>Harkins Awards Member (Simulated)</option>
      </select>
      <div class="nav-footer">
        <button onclick="go('S2')">Back to Seats (S2)</button>
        <button class="primary" onclick="go('S4')">Continue to Concessions (S4)</button>
      </div>
    `;
  } else if (app.state === 'S4') {
    main.innerHTML = `
      <div class="state-tag">S4 • Mobile Concessions Menu</div>
      <h2>Add Drinks, Snack & Pickup Timing</h2>
      <label for="dqty">Fountain Drinks ($4.25 each)</label>
      <select id="dqty" onchange="app.drinksQty = Number(this.value); render();">
        <option value="0" ${app.drinksQty === 0 ? 'selected' : ''}>0 Drinks ($0.00)</option>
        <option value="1" ${app.drinksQty === 1 ? 'selected' : ''}>1 Drink ($4.25)</option>
        <option value="2" ${app.drinksQty === 2 ? 'selected' : ''}>2 Drinks ($8.50)</option>
      </select>
      <label>Snack Selection</label>
      ${SNACKS.map(sn => `
        <div class="item-card ${app.snackId === sn.id ? 'selected-box' : ''}">
          <div>
            <strong>${sn.name}</strong> — $${sn.price.toFixed(2)}<br />
            <span class="muted">${sn.outOfStockDefault ? 'Can simulate stock-out in recovery test' : 'In stock at concession counter'}</span>
          </div>
          <button type="button" onclick="app.snackId='${sn.id}'; app.snackOutOfStock=false; render();">
            ${app.snackId === sn.id && !app.snackOutOfStock ? 'Selected' : 'Choose Snack'}
          </button>
        </div>
      `).join('')}
      <label style="display:flex; align-items:center; gap:8px; font-weight:500;">
        <input type="checkbox" style="width:auto;" ${app.snackOutOfStock ? 'checked' : ''} onchange="app.snackOutOfStock = this.checked; render();" />
        Simulate selected snack going out of stock before payment (triggers S6 Recovery)
      </label>
      <label for="ptime">Mobile Pickup Timing</label>
      <select id="ptime" onchange="app.pickupTime = this.value; render();">
        <option value="Upon Arrival" ${app.pickupTime === 'Upon Arrival' ? 'selected' : ''}>Upon Arrival (Prepared when you check in at theater)</option>
        <option value="15 Mins Before Showtime" ${app.pickupTime === '15 Mins Before Showtime' ? 'selected' : ''}>15 Mins Before Showtime (2:00 PM)</option>
      </select>
      <div class="nav-footer">
        <button onclick="go('S3')">Back to Tickets (S3)</button>
        <button class="primary" onclick="go('S5')">Review Order & Checkout (S5)</button>
      </div>
    `;
  } else if (app.state === 'S5') {
    const t = getTotals();
    main.innerHTML = `
      <div class="state-tag">S5 • Order Summary & Checkout Form</div>
      <h2>Verify Details & Complete Simulated Payment</h2>
      <div class="item-card">
        <div>
          <strong>Seats: ${app.seats.join(', ')}</strong> • ${app.showtime}<br />
          <span class="muted">Concessions: ${app.drinksQty} Drinks + ${app.snackOutOfStock ? 'Out-of-Stock Snack' : t.snackObj.name} (${app.pickupTime})</span>
        </div>
        <div>
          <button type="button" class="inline-edit" onclick="go('S2')">Edit Seats</button>
          <button type="button" class="inline-edit" onclick="go('S4')">Edit Snacks</button>
        </div>
      </div>

      <label for="promo">Promo / Voucher Code (Try any code other than <code>HARKINS10</code> to test S6 recovery)</label>
      <div style="display:flex; gap:8px;">
        <input id="promo" value="${app.promoInput}" placeholder="Enter promo code (e.g., SAVE20 or HARKINS10)" oninput="app.promoInput = this.value;" />
        <button type="button" onclick="applyPromoOrCheckout(true)">Apply</button>
      </div>
      ${app.promoApplied ? `<div class="alert-ok">Applied <strong>HARKINS10</strong> (-$5.00).</div>` : ''}

      <label for="bname">Fictional Customer Name</label>
      <input id="bname" value="${app.buyerName}" oninput="app.buyerName = this.value;" />

      <label for="card4">Simulated Card Ending (Last 4 Digits)</label>
      <input id="card4" maxlength="4" value="${app.cardLast4}" oninput="app.cardLast4 = this.value;" />

      <div class="nav-footer">
        <button onclick="go('S4')">Back to Concessions (S4)</button>
        <button class="primary" ${t.total > 55 ? 'disabled' : ''} onclick="applyPromoOrCheckout(false)">
          Confirm & Pay ($${t.total.toFixed(2)})
        </button>
      </div>
    `;
  } else if (app.state === 'S6') {
    main.innerHTML = `
      <div class="state-tag">S6 • Recovery State</div>
      <h2>Action Needed Before Completing Order</h2>
      <div class="alert-err"><strong>Recovery Triggered:</strong> ${app.recoveryReason}</div>
      <div class="alert-warn">
        <strong>Preserved Information:</strong> Your showtime (<strong>${app.showtime}</strong>), seats (<strong>${app.seats.join(', ')}</strong>), ticket count, drinks, pickup window, and fictional buyer details are still intact.
      </div>
      <div class="filter-row">
        ${app.snackOutOfStock
          ? `<button class="primary" onclick="resolveRecovery('swapSnack')">Swap to Classic Butter Popcorn & Return to S5</button>`
          : `<button class="primary" onclick="resolveRecovery('clearPromo')">Remove Invalid Promo Code & Return to S5</button>`
        }
        <button onclick="go('S5')">Return to Checkout (S5)</button>
      </div>
    `;
  } else if (app.state === 'S7') {
    const t = getTotals();
    main.innerHTML = `
      <div class="state-tag">S7 • Booking Confirmation & Mobile Pass</div>
      <h2>Order Confirmed — Enjoy Your Movie!</h2>
      <div class="alert-ok">
        <strong>Confirmation #:</strong> ${app.orderId} &nbsp;|&nbsp; <strong>Status:</strong> Simulated Order Complete
      </div>
      <p><strong>Guest:</strong> ${app.buyerName} (Card ending in ${app.cardLast4 || '4242'})</p>
      <p><strong>Screening:</strong> ${app.showtime}</p>
      <p><strong>Reserved Seats:</strong> ${app.seats.join(', ')}</p>
      <p><strong>Mobile Concessions:</strong> ${app.drinksQty} Drinks + ${t.snackObj.name} — Pickup: <strong>${app.pickupTime}</strong></p>
      <p><strong>Final Total Paid:</strong> $${t.total.toFixed(2)} (Simulated)</p>
      <div class="nav-footer">
        <button class="primary" onclick="resetPrototype()">Start New Order / Reset (S1)</button>
      </div>
    `;
  }

  renderSummary();
}

render();
