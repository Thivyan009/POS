# Restaurant POS Frontend System

A production-grade, tablet-friendly point-of-sale system built with Next.js and React. Designed for speed, clarity, and reliability under real restaurant pressure.

## Features

### For Billers (Cashiers)
- **Instant billing interface**: No page reloads or confirmation popups
- **Menu categories**: Horizontal tabs for quick category switching
- **One-tap item addition**: Large, finger-friendly buttons
- **Live bill summary**: Real-time quantity controls with +/- buttons
- **Tax calculation**: Automatic tax applied to applicable items
- **Discount management**: Apply discounts inline
- **WhatsApp integration**: Optional bill delivery via WhatsApp
- **Print support**: Seamless print dialog for receipts
- **State persistence**: Bill survives accidental page refresh
- **Keyboard shortcuts**: Press `?` for help, `Esc` to cancel

### For Admins
- **Revenue dashboard**: Daily, weekly, and monthly analytics
- **Sales charts**: Visual hourly sales breakdown
- **Top items**: Best-selling products at a glance
- **Menu management**: Full CRUD for categories and items
- **User management**: Enable/disable biller accounts
- **Bill history**: Recent transactions overview

## Project Structure

```
app/
├── page.tsx                    # Root redirect with auth check
├── login/                      # Authentication
│   └── page.tsx
├── biller/                     # Cashier interface
│   └── page.tsx
└── admin/                      # Admin dashboard
    ├── page.tsx                # Redirect to dashboard
    └── dashboard/
        └── page.tsx

components/
├── ui/                         # shadcn/ui components
├── auth-guard.tsx              # Protected route wrapper
├── biller/
│   ├── biller-layout.tsx       # Main biller interface
│   ├── menu-section.tsx        # Category tabs + item grid
│   ├── bill-summary.tsx        # Bill items & totals
│   └── action-bar.tsx          # Print/Send/Cancel controls
└── admin/
    ├── admin-dashboard.tsx     # Main admin component
    ├── admin-header.tsx        # Header with logout
    ├── admin-nav.tsx           # Sidebar navigation
    ├── revenue-cards.tsx       # Revenue metrics
    ├── sales-chart.tsx         # Hourly sales chart
    ├── top-items.tsx           # Top selling items
    ├── recent-bills.tsx        # Recent transactions
    ├── menu-management.tsx     # Menu CRUD
    ├── menu-category-form.tsx  # Category editor
    ├── menu-item-form.tsx      # Item editor
    ├── category-list.tsx       # Category table
    ├── item-list.tsx           # Item table
    ├── user-management.tsx     # User management
    └── user-list.tsx           # User table

hooks/
├── use-auth.ts                 # Auth context & utilities
├── use-biller-state.ts         # Bill state management
├── use-keyboard-shortcuts.ts   # Global keyboard handlers
├── use-error-handler.ts        # Centralized error handling
├── use-toast.ts                # Toast notifications (shadcn)
└── use-mobile.tsx              # Responsive helpers (shadcn)

services/
└── api-service.ts              # All backend API calls (abstracted)

utils/
└── lib/utils.ts                # Utility functions (shadcn)
```

## Key Implementation Details

### Authentication Flow
1. User logs in with username/password
2. Backend validates credentials and returns token
3. Role (admin/biller) is resolved from backend
4. User is redirected based on role
5. AuthGuard components protect routes

### Biller Bill State
```typescript
// Automatically saved to localStorage
{
  items: [
    { id, name, price, quantity, tax }
  ],
  subtotal: number,
  tax: number,
  discount: number,
  total: number
}
```

### Error Handling
- **Network errors**: Non-blocking toast, user can retry
- **Printer errors**: Show retry option
- **WhatsApp errors**: Silent fail, bill still saved
- **Validation errors**: Inline field validation

### Keyboard Shortcuts
- `?` - Show keyboard help
- `Esc` - Cancel current bill (if items present)
- `Enter` - Focus print button
- Numeric keys: Quantity adjustment (when focused on item)

## Responsive Design

### Biller Interface (Tablet-First)
- **Desktop (1920px+)**: Full-width, optimal spacing
- **Tablet Landscape (1024-1920px)**: 70/30 split (menu/bill)
- **Tablet Portrait (768-1024px)**: Responsive grid
- **Mobile**: Menu tabs stack, bill below

### Admin Interface
- **Desktop**: 3-column layout
- **Tablet**: 2-column, compact
- **Mobile**: Single column (not recommended for admin)

## API Integration Points

All backend calls are abstracted in `services/api-service.ts`:

```typescript
// Menu APIs
getMenuCategories()
getMenuItems(categoryId?)

// Bill APIs
createBill(billData)
getBills(page, limit)

// Analytics APIs
getRevenue()
getSalesByHour()
getTopItems()

// User APIs
getBillers()
updateBiller(id, data)
```

Replace mock implementations with actual API endpoints.

## State Management

### Local (Client)
- Authentication state: localStorage
- Current bill: localStorage + React state
- UI state: React hooks

### Server (Backend)
- User accounts & authentication
- Menu data
- Bill history
- Analytics

## Performance Optimizations

1. **No page reloads**: Single-page app for billing
2. **Instant feedback**: Toast notifications, no modals
3. **Local bill persistence**: Survives refresh
4. **Lazy loading**: Categories/items on demand
5. **Optimistic updates**: UI updates before API response
6. **Minimal re-renders**: Proper hook dependencies

## Security Considerations

### Implemented
- ✓ Role-based route protection
- ✓ Token-based authentication
- ✓ Logout functionality
- ✓ Protected admin routes

### To Implement
- [ ] HTTPS only
- [ ] CSRF protection on API calls
- [ ] Input sanitization
- [ ] Rate limiting on API endpoints
- [ ] Secure session management (HTTP-only cookies)
- [ ] Password hashing (backend)
- [ ] Audit logging

## Testing Checklist

### Biller Interface
- [ ] Add items to bill
- [ ] Adjust quantities
- [ ] Apply discount
- [ ] Print receipt
- [ ] Cancel bill (clears items)
- [ ] Refresh page (bill persists)
- [ ] Network error (retry still works)

### Admin Dashboard
- [ ] View revenue cards
- [ ] See sales chart
- [ ] Check top items
- [ ] Add category
- [ ] Edit category
- [ ] Delete category
- [ ] Add menu item
- [ ] Edit menu item
- [ ] Toggle item availability
- [ ] Enable/disable user

### Authentication
- [ ] Login as biller
- [ ] Login as admin
- [ ] Logout redirects to login
- [ ] Protected routes prevent access
- [ ] Invalid credentials show error

## Future Enhancements

1. **Print integration**: Real printer driver support
2. **WhatsApp API**: Actual message delivery
3. **Inventory tracking**: Stock management
4. **Payment processing**: Stripe/card integration
5. **Multiple tables**: Restaurant table management
6. **Order tracking**: Kitchen display system
7. **Staff management**: Shifts and permissions
8. **Analytics**: Advanced reporting and insights
9. **Multi-language**: i18n support
10. **Mobile app**: React Native version

## Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://api.restaurant.com
NEXT_PUBLIC_WHATSAPP_API_KEY=xxx
```

### Build & Deploy
```bash
npm run build
npm start
```

Deploy to Vercel:
```bash
vercel deploy
```

## Troubleshooting

### Bill not persisting?
- Check localStorage is enabled
- Clear cache and reload

### Menu not loading?
- Check API_BASE_URL environment variable
- Verify backend API is running
- Check browser console for errors

### Print not working?
- Ensure browser has print permission
- Check printer is connected
- Try different browser

## License

MIT - Built for production restaurant use
