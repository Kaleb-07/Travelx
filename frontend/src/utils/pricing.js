/**
 * Calculate pricing breakdown for a booking.
 * Mirrors the logic in MainPage/JavaScript.js `updateTotalPrice`.
 *
 * @param {number} basePrice - Base price of the trip
 * @param {string} roomType  - One of: "Standard", "Deluxe", "Suite", "Villa"
 * @param {number} guests    - Number of guests
 * @returns {{ basePrice: number, roomAdjustment: number, taxAmount: number, totalAmount: number }}
 */
export function calculatePricing(basePrice, roomType, guests) {
  let roomMultiplier = 1;
  if (roomType === 'Deluxe') roomMultiplier = 1.2;
  if (roomType === 'Suite') roomMultiplier = 1.5;
  if (roomType === 'Villa') roomMultiplier = 2;

  const subtotal = basePrice * guests * roomMultiplier;
  const roomAdjustment = Math.floor(subtotal - basePrice * guests);
  const taxAmount = Math.floor(subtotal * 0.1);
  const totalAmount = subtotal + taxAmount;

  return { basePrice, roomAdjustment, taxAmount, totalAmount };
}
