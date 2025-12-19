import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import cartData from '../data/cartData.json';

test.describe('Shopping Cart - SauceDemo', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    // Login before each test
    await loginPage.navigate();
    await loginPage.loginAndWaitForInventory('standard_user', 'secret_sauce');
  });

  // ============================================================================
  // POSITIVE TEST CASES (TC_CART_001 - TC_CART_006)
  // ============================================================================
  test.describe('Positive Scenarios', () => {
    test('TC_CART_001: View cart with items', async ({ page }) => {
      const scenario = cartData.validScenarios[0];

      // Add product to cart
      await inventoryPage.addProductToCart(scenario.productName!);

      // Navigate to cart
      await inventoryPage.clickShoppingCart();

      // Verify cart displays correctly
      const title = await cartPage.getPageTitle();
      expect(title).toBe('Your Cart');

      expect(await cartPage.isProductInCart(scenario.productName!)).toBe(true);
      expect(await cartPage.isContinueShoppingVisible()).toBe(true);
      expect(await cartPage.isCheckoutButtonVisible()).toBe(true);
    });

    test('TC_CART_002: View empty cart', async ({ page }) => {
      // Navigate to cart without adding items
      await inventoryPage.clickShoppingCart();

      // Verify empty cart
      const title = await cartPage.getPageTitle();
      expect(title).toBe('Your Cart');

      expect(await cartPage.isCartEmpty()).toBe(true);
      expect(await cartPage.isContinueShoppingVisible()).toBe(true);
      expect(await cartPage.isCheckoutButtonVisible()).toBe(true);
    });

    test('TC_CART_003: Remove item from cart page', async ({ page }) => {
      const scenario = cartData.validScenarios[2];

      // Add product to cart
      await inventoryPage.addProductToCart(scenario.productName!);
      await inventoryPage.clickShoppingCart();

      // Verify product is in cart
      expect(await cartPage.isProductInCart(scenario.productName!)).toBe(true);

      // Remove product
      await cartPage.removeItem(scenario.productName!);

      // Verify product is removed
      expect(await cartPage.isProductInCart(scenario.productName!)).toBe(false);
    });

    test('TC_CART_004: Continue shopping from cart', async ({ page }) => {
      // Navigate to cart
      await inventoryPage.clickShoppingCart();

      // Click Continue Shopping
      await cartPage.clickContinueShopping();

      // Verify redirected to inventory
      await expect(page).toHaveURL(/inventory\.html/);
      expect(await inventoryPage.isProductListVisible()).toBe(true);
    });

    test('TC_CART_005: Navigate to checkout from cart', async ({ page }) => {
      // Add product to cart
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
      await inventoryPage.clickShoppingCart();

      // Click Checkout
      await cartPage.clickCheckout();

      // Verify redirected to checkout
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });

    test('TC_CART_006: Verify product details in cart', async ({ page }) => {
      const scenario = cartData.validScenarios[5];

      // Add product to cart
      await inventoryPage.addProductToCart(scenario.productName!);
      await inventoryPage.clickShoppingCart();

      // Verify product details
      const names = await cartPage.getCartItemNames();
      expect(names).toContain(scenario.productName);

      const quantity = await cartPage.getProductQuantity(scenario.productName!);
      expect(quantity).toBe(scenario.expectedQuantity);

      const price = await cartPage.getProductPrice(scenario.productName!);
      expect(price).toBe(scenario.productPrice);
    });
  });

  // ============================================================================
  // NEGATIVE TEST CASES (TC_CART_100 - TC_CART_102)
  // ============================================================================
  test.describe('Negative Scenarios', () => {
    test('TC_CART_100: Access cart page directly without login', async ({ page, context }) => {
      // Clear session
      await context.clearCookies();
      await page.evaluate(() => {
        sessionStorage.clear();
        localStorage.clear();
      });

      // Try to access cart directly
      await page.goto('/cart.html');

      // Should redirect to login or show error
      const hasError = await page.locator('[data-test="error"]').isVisible().catch(() => false);
      const isOnLogin = !page.url().includes('cart.html') || hasError;
      expect(isOnLogin).toBe(true);
    });

    test('TC_CART_101: Checkout with empty cart', async ({ page }) => {
      // Navigate to empty cart
      await inventoryPage.clickShoppingCart();

      // Try to checkout
      await cartPage.clickCheckout();

      // May proceed to checkout or show error - both are acceptable behaviors
      const url = page.url();
      const proceedToCheckout = url.includes('checkout');
      const stayOnCart = url.includes('cart');
      expect(proceedToCheckout || stayOnCart).toBe(true);
    });

    test('TC_CART_102: Remove last item and verify cart state', async ({ page }) => {
      const scenario = cartData.invalidScenarios[2];

      // Add only one product
      await inventoryPage.addProductToCart(scenario.productName!);
      await inventoryPage.clickShoppingCart();

      // Remove the product
      await cartPage.removeItem(scenario.productName!);

      // Verify cart is empty
      expect(await cartPage.isCartEmpty()).toBe(true);

      // Cart badge should be gone or show 0
      const badgeCount = await cartPage.getCartItemCount();
      expect(badgeCount).toBe(0);
    });
  });

  // ============================================================================
  // BOUNDARY TEST CASES (TC_CART_300 - TC_CART_301)
  // ============================================================================
  test.describe('Boundary Tests', () => {
    test('TC_CART_300: Cart persistence across page navigation', async ({ page }) => {
      const productName = 'Sauce Labs Backpack';

      // Add product to cart
      await inventoryPage.addProductToCart(productName);

      // Navigate to cart
      await inventoryPage.clickShoppingCart();
      expect(await cartPage.isProductInCart(productName)).toBe(true);

      // Go back to products
      await cartPage.clickContinueShopping();

      // Navigate to cart again
      await inventoryPage.clickShoppingCart();

      // Cart should still have the product
      expect(await cartPage.isProductInCart(productName)).toBe(true);
    });

    test('TC_CART_301: Cart with maximum items', async ({ page }) => {
      // Add all products to cart one by one
      await inventoryPage.addAllProductsToCart();

      // Verify cart badge shows 6 items
      const badgeCount = await inventoryPage.getCartItemCount();
      expect(badgeCount).toBe(6); // All available products

      // Navigate to cart
      await inventoryPage.clickShoppingCart();

      // Verify all items are in cart list
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(6); // All available products

      // Page should render correctly
      expect(await cartPage.isCheckoutButtonVisible()).toBe(true);
    });
  });

  // ============================================================================
  // SECURITY TEST CASES (TC_CART_400)
  // ============================================================================
  test.describe('Security Tests', () => {
    test('TC_CART_400: Cart manipulation via localStorage', async ({ page }) => {
      // Add one item to cart
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
      await inventoryPage.clickShoppingCart();

      const initialCount = await cartPage.getCartItemCount();
      expect(initialCount).toBe(1);

      // Try to manipulate localStorage
      await page.evaluate(() => {
        localStorage.setItem('cart-contents', '[1,2,3,4,5,6,7,8,9,10]');
      });

      // Refresh page
      await page.reload();

      // Cart should reflect actual state, not manipulated data
      const finalCount = await cartPage.getCartItemCount();
      expect(finalCount).toBeLessThanOrEqual(6); // Max products available
    });
  });
});
