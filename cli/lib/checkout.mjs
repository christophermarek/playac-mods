/* checkout.mjs - the game's source checkout this package sits in: none here.
 *
 * In the game's own source repo this file points the CLI at the checkout's
 * copies of the mod rules, the API outputs and the AI pack. This public copy
 * has none, so the CLI reads its vendor/ folder, as the installed package
 * does, and the tests that need the source checkout are skipped. */
export const CHECKOUT = null;
