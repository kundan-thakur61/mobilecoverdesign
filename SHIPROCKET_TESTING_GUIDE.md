# 🧪 Shiprocket Integration - Testing Guide

## Quick Test Checklist

### ✅ Pre-Testing Setup

1. **Backend Running:**
   ```bash
   cd backend
   npm start
   ```
   Should see: "Server running on port 4000"

2. **Frontend Running:**
   ```bash
   cd frontend
   npm run dev
   ```
   Should see: "Local: http://localhost:5173"

3. **Environment Variables Set:**
   ```env
   # Backend .env
   SHIPROCKET_EMAIL=your-email@example.com
   SHIPROCKET_PASSWORD=your-password
   
   # Frontend .env
   VITE_BACKEND_URL=http://localhost:4000
   ```

---

## 🎯 Test 1: Pincode Checker on Product Page

### Steps:
1. Navigate to any product page: `http://localhost:5173/products/[product-id]`
2. Scroll down to "CHECK DELIVERY" section
3. Enter pincode: `462001` (or any Indian pincode)
4. Click "Check" button

### Expected Results:
- ✅ Loading indicator appears
- ✅ "Delivery available to [pincode]" message shows
- ✅ List of available couriers displays:
  - Courier name (e.g., Delhivery, Blue Dart, DTDC)
  - Shipping rate (e.g., ₹45)
  - Estimated delivery time (e.g., 2-3 days)
- ✅ If pincode not serviceable: Error message shows

### Screenshot Location:
```
┌─────────────────────────────────┐
│ CHECK DELIVERY                  │
│                                 │
│ Enter Pincode: [462001] [Check]│
│                                 │
│ ✓ Delivery available to 462001 │
│                                 │
│ Available Couriers:             │
│ • Delhivery - ₹45 (2-3 days)   │
│ • Blue Dart - ₹75 (1-2 days)   │
└─────────────────────────────────┘
```

### Troubleshooting:
- ❌ No couriers shown → Check Shiprocket API credentials
- ❌ Error message → Check backend logs for API errors
- ❌ Component not visible → Verify ProductDetails.jsx has PincodeChecker

---

## 🎯 Test 2: User Order Tracking

### Steps:
1. Login as a user with existing orders
2. Navigate to: `http://localhost:5173/orders`
3. Find an order with "Shipped" badge (has AWB code)
4. Click "Track" button
5. View tracking timeline

### Expected Results:
- ✅ Orders page loads with list of user orders
- ✅ Orders with shipments show "Shipped" badge
- ✅ "Track" button visible for shipped orders
- ✅ Clicking "Track" expands tracking section
- ✅ Tracking shows:
  - AWB code (e.g., "12345678")
  - Courier name (e.g., "Delhivery")
  - Current status (e.g., "In Transit")
  - Timeline of events:
    - ● Order Placed - timestamp
    - ● Picked Up - timestamp
    - ● In Transit - timestamp
    - ○ Out for Delivery - pending
- ✅ "View on Shiprocket" link works

### Screenshot Location:
```
Order #ABC123
2 items • Dec 18, 2025
Status: Paid [Shipped]
₹799
[View] [Track] [Cancel]

━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tracking Information
AWB: 12345678
Courier: Delhivery

Timeline:
● Order Placed - Dec 18, 10:00 AM
● Picked Up - Dec 18, 2:00 PM
● In Transit - Dec 19, 8:00 AM
○ Out for Delivery - Pending
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Troubleshooting:
- ❌ No "Track" button → Order doesn't have AWB code (create shipment first)
- ❌ Tracking not loading → Check backend /api/shiprocket/track/:orderId
- ❌ Empty timeline → No tracking data from Shiprocket yet

---

## 🎯 Test 3: Admin Shipments Page

### Steps:
1. Login as admin
2. Click "Shipments" in admin navigation (left sidebar)
3. Should navigate to: `http://localhost:5173/admin/shipments`
4. View all orders with filters

### Expected Results:
- ✅ Shipments page loads
- ✅ Navigation shows "Shipments" menu item with truck icon
- ✅ Filter dropdowns work:
  - Status filter (All/Pending/Confirmed/Processing/Shipped/Delivered)
  - Search by order ID
- ✅ Order cards display:
  - Order ID
  - Customer details
  - Shipping address
  - Payment status
  - Shiprocket status
- ✅ Expandable order cards show:
  - Full order details
  - ShipmentTracking component
  - AdminShiprocketManagement controls

### Screenshot Location:
```
Admin Dashboard > Shipments

Filter: [All Orders ▼]  Search: [______]

┌─────────────────────────────────────┐
│ Order #123456                       │
│ Customer: John Doe                  │
│ Status: Paid                        │
│ Shiprocket: ✓ Shipment Created     │
│                                     │
│ [Expand Details ▼]                 │
└─────────────────────────────────────┘
```

### Troubleshooting:
- ❌ "Shipments" not in menu → Check AdminSidebar.jsx has FiTruck import
- ❌ 404 error → Verify App.jsx has AdminShipments route
- ❌ Page blank → Check AdminShipments.jsx component

---

## 🎯 Test 4: Admin Create Shipment

### Steps:
1. On Admin Shipments page, expand an order (paid status)
2. Click "Create Shipment" button
3. Wait for shipment creation
4. Verify AWB code is assigned

### Expected Results:
- ✅ "Creating shipment..." loading state
- ✅ Success toast: "Shipment created successfully"
- ✅ AWB code displays (e.g., "AWB: 12345678")
- ✅ Courier auto-assigned and shown (e.g., "Delhivery")
- ✅ Order updated in database with shiprocket data
- ✅ Buttons now show:
  - "Request Pickup"
  - "Generate Label"
  - "Cancel Shipment"

### Workflow Guide Display:
```
Shiprocket Shipment Management

Current Status: ✓ Shipment Created
AWB: 12345678
Courier: Delhivery (Auto-assigned)

Workflow Steps:
✓ 1. Create Shipment (Done)
  2. Assign Courier (Auto-assigned)
  3. Request Pickup
  4. Generate Label

[Request Pickup] [Generate Label]
[Cancel Shipment]
```

### Troubleshooting:
- ❌ Error: "Failed to create shipment" → Check backend Shiprocket API connection
- ❌ No AWB code → Shipment created but courier not assigned
- ❌ Button disabled → Check order payment status

---

## 🎯 Test 5: Admin Courier Assignment

### Steps:
1. After creating shipment, click "Assign Courier" button
2. View courier selection modal
3. Select a courier manually or use auto-assign
4. Confirm assignment

### Expected Results:
- ✅ Modal opens with courier list
- ✅ Shows available couriers with:
  - Courier name
  - Shipping rate
  - Estimated delivery time
  - "Select" button
- ✅ "Auto-assign Cheapest" button available
- ✅ Clicking auto-assign selects cheapest courier
- ✅ Success toast: "Courier assigned successfully"
- ✅ AWB code generated and displayed

### Courier Selection Modal:
```
┌─────────────────────────────────────┐
│ Select Courier for Shipment        │
│                                     │
│ [Auto-assign Cheapest Courier]     │
│                                     │
│ Available Couriers:                 │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Delhivery                   │   │
│ │ Rate: ₹45 | 2-3 days       │   │
│ │             [Select Courier] │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Blue Dart                   │   │
│ │ Rate: ₹75 | 1-2 days       │   │
│ │             [Select Courier] │   │
│ └─────────────────────────────┘   │
│                                     │
│           [Cancel]                  │
└─────────────────────────────────────┘
```

### Troubleshooting:
- ❌ No couriers listed → Shipping address may be invalid
- ❌ Modal doesn't open → Check browser console for errors
- ❌ Auto-assign fails → Check Shiprocket API response

---

## 🎯 Test 6: Admin Request Pickup

### Steps:
1. After courier assignment, click "Request Pickup"
2. Confirm pickup request
3. Verify pickup scheduled

### Expected Results:
- ✅ "Requesting pickup..." loading state
- ✅ Success toast: "Pickup requested successfully"
- ✅ Status updates to "Pickup Scheduled"
- ✅ Courier receives pickup notification

### Troubleshooting:
- ❌ Pickup request fails → Check if shipment has valid AWB
- ❌ Error message → Verify shipping address is complete

---

## 🎯 Test 7: Admin Generate Label

### Steps:
1. Click "Generate Label" button
2. Wait for PDF generation
3. Download and verify label

### Expected Results:
- ✅ "Generating label..." loading state
- ✅ PDF opens in new tab or downloads
- ✅ Label contains:
  - Order details
  - Shipping address
  - Barcode
  - AWB number
- ✅ Success toast: "Label generated"

### Troubleshooting:
- ❌ PDF doesn't open → Check popup blocker
- ❌ Empty PDF → Label generation failed on Shiprocket
- ❌ Error → Check shipment status

---

## 🎯 Test 8: Admin Custom Orders Shipping

### Steps:
1. Navigate to: `http://localhost:5173/admin/custom-orders`
2. Find a custom order with "Paid" status
3. Click "Manage Shipping" button
4. Expand shipping management section
5. Create and manage shipment

### Expected Results:
- ✅ "Manage Shipping" button visible for paid orders
- ✅ Clicking button expands shipping section
- ✅ Shows full AdminShiprocketManagement component
- ✅ All shipment controls available:
  - Create Shipment
  - Assign Courier
  - Request Pickup
  - Generate Label
  - Cancel Shipment
- ✅ Works same as regular orders

### Screenshot Location:
```
Custom Order #XYZ789
By: John Doe (john@example.com)
Status: Approved

[Update Status] [Manage Shipping] [Delete]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Shiprocket Shipment Management

Current Status: No shipment created

Workflow Guide:
1. Create Shipment
2. Assign Courier (Auto/Manual)
3. Request Pickup
4. Generate Label

[Create Shipment] [Assign Courier]
[Request Pickup] [Generate Label]
[Cancel Shipment]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Troubleshooting:
- ❌ Button not showing → Check if order has payment.status === 'paid'
- ❌ Section not expanding → Check expandedOrderId state
- ❌ Component not rendering → Verify AdminShiprocketManagement import

---

## 🎯 Test 9: Cancel Shipment

### Steps:
1. On any order with active shipment
2. Click "Cancel Shipment" button
3. Confirm cancellation
4. Verify shipment cancelled

### Expected Results:
- ✅ Confirmation dialog appears
- ✅ Clicking confirm sends cancellation
- ✅ Success toast: "Shipment cancelled"
- ✅ Order shiprocket data updated
- ✅ Status shows "Cancelled"
- ✅ Can create new shipment if needed

### Troubleshooting:
- ❌ Cancellation fails → Shipment may already be picked up
- ❌ Error message → Check Shiprocket cancellation policy

---

## 🎯 Test 10: End-to-End Flow

### Complete User Journey:

1. **User checks delivery availability:**
   - Goes to product page
   - Enters pincode 462001
   - Sees delivery available
   - Adds to cart and checks out

2. **Admin processes order:**
   - Order created with payment
   - Admin goes to Shipments page
   - Finds the order
   - Creates shipment
   - Assigns courier (auto)
   - Requests pickup
   - Generates label

3. **User tracks shipment:**
   - Goes to Orders page
   - Sees "Shipped" badge
   - Clicks "Track"
   - Views real-time tracking timeline

4. **Delivery completed:**
   - Webhook updates order status
   - Timeline shows "Delivered"
   - Order marked complete

### Expected Timeline:
```
Day 1 (Order placed):
  10:00 AM - User checks pincode ✓
  10:05 AM - User places order ✓
  10:10 AM - Admin creates shipment ✓
  10:11 AM - Courier assigned ✓
  02:00 PM - Pickup scheduled ✓
  04:00 PM - Package picked up ✓

Day 2 (In transit):
  08:00 AM - In transit ✓
  02:00 PM - Reached sorting center ✓

Day 3 (Delivery):
  09:00 AM - Out for delivery ✓
  11:30 AM - Delivered ✓
```

---

## 📊 Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Smooth UI transitions
- ✅ Toast notifications working
- ✅ Data persistence (refresh works)
- ✅ Mobile responsive design
- ✅ Loading states visible
- ✅ Error handling graceful

---

## 🐛 Common Issues & Solutions

### Issue: "Shiprocket API authentication failed"
**Solution:** 
- Check SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in backend .env
- Verify credentials are correct
- Check Shiprocket account is active

### Issue: "Order not found"
**Solution:**
- Verify order ID is correct
- Check order exists in database
- Ensure user has permission to view order

### Issue: "No couriers available"
**Solution:**
- Check shipping address is complete
- Verify pincode is serviceable
- Check product weight and dimensions

### Issue: Component not rendering
**Solution:**
- Check imports are correct
- Verify component file exists
- Check browser console for errors
- Clear cache and restart dev server

### Issue: Routes not working
**Solution:**
- Verify App.jsx has all routes defined
- Check route paths match navigation links
- Ensure protected routes have auth guards

---

## 📝 Test Results Template

```
Test Date: ______________
Tester: ______________

Test 1: Pincode Checker         [ ] PASS  [ ] FAIL
Test 2: User Order Tracking     [ ] PASS  [ ] FAIL
Test 3: Admin Shipments Page    [ ] PASS  [ ] FAIL
Test 4: Admin Create Shipment   [ ] PASS  [ ] FAIL
Test 5: Admin Courier Assignment[ ] PASS  [ ] FAIL
Test 6: Admin Request Pickup    [ ] PASS  [ ] FAIL
Test 7: Admin Generate Label    [ ] PASS  [ ] FAIL
Test 8: Custom Orders Shipping  [ ] PASS  [ ] FAIL
Test 9: Cancel Shipment         [ ] PASS  [ ] FAIL
Test 10: End-to-End Flow        [ ] PASS  [ ] FAIL

Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________

Notes:
_____________________________________
_____________________________________
```

---

## 🎉 Ready to Test!

Start with Test 1 (Pincode Checker) and work through all tests sequentially. Each test builds on the previous one, so ensure each passes before moving to the next.

**Good luck with testing!** 🚀
