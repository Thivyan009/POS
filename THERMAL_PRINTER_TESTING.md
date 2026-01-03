# Thermal Printer Testing Guide

## Testing Without Physical Printer

You can test the receipt format in several ways:

### Method 1: Preview Button (Recommended)
1. Add items to your bill
2. Click the **"PREVIEW"** button in the action bar
3. A dialog will open showing exactly how the receipt will look
4. You can:
   - View the receipt on screen
   - Click "Save as PDF" to export it
   - Click "Print Receipt" to open the print dialog

### Method 2: Browser Print Preview
1. Add items to your bill
2. Click the **"PRINT"** button
3. When the print dialog opens:
   - Select **"Save as PDF"** as the destination
   - Click **"More settings"** or **"Print using system dialog"**
   - Set paper size to **80mm** or **Custom: 80mm x auto**
   - Preview the receipt before saving

### Method 3: Print to PDF
1. Use the Preview button
2. Click "Save as PDF"
3. In the print dialog:
   - Destination: **Save as PDF**
   - Paper size: **80mm** (or custom 80mm width)
   - Margins: **None** or **Minimum**
   - Scale: **100%**
   - Save the PDF to view the receipt

## Receipt Format Details

- **Width**: 80mm (3.15 inches)
- **Font**: Courier New (monospace for alignment)
- **Logo**: Restaurant logo at the top
- **Footer**: "Thank you, come again!"

## When You Have Your Printer

1. Connect your **XP-E200L** printer via USB or Bluetooth
2. Make sure it's set as the default printer (optional)
3. Add items and click **"PRINT"**
4. In the print dialog:
   - Select **"XP-E200L"** as the printer
   - Paper size should auto-detect as 80mm
   - Click **"Print"**

## Troubleshooting

### Receipt looks too wide/narrow
- Check that paper size is set to **80mm** in print settings
- The CSS uses `80mm` width, which should match thermal paper

### Logo not showing
- Ensure `/public/restaurant-logo.png` exists
- Check browser console for image loading errors

### Text alignment issues
- The receipt uses monospace font (Courier New) for proper alignment
- If alignment is off, check browser zoom level (should be 100%)

## Testing Checklist

- [ ] Preview button shows receipt correctly
- [ ] Logo displays at the top
- [ ] All items are listed with quantities and prices
- [ ] Totals (subtotal, tax, discount, total) are correct
- [ ] Footer shows "Thank you, come again!"
- [ ] Receipt width matches 80mm thermal paper
- [ ] Print preview shows correct formatting
- [ ] PDF export works correctly

