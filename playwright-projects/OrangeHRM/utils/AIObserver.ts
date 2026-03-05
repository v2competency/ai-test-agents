// utils/AIObserver.ts
import Anthropic from '@anthropic-ai/sdk';

export class AIObserver {
  private client: Anthropic | null = null;
  private enabled = false;
  private model: string;

  constructor() {
    const hasKey = !!process.env.ANTHROPIC_API_KEY;
    const aiEnabled = process.env.AI_HEALING_ENABLED === 'true';

    if (hasKey && aiEnabled) {
      this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      this.enabled = true;
      console.log(`[AIObserver] Initialized with model: ${process.env.AI_MODEL || 'claude-sonnet-4-20250514'}`);
    } else {
      console.log(`[AIObserver] Disabled (API key: ${hasKey}, AI_HEALING_ENABLED: ${process.env.AI_HEALING_ENABLED})`);
    }
    this.model = process.env.AI_MODEL || 'claude-sonnet-4-20250514';
  }

  /**
   * Check if AI healing is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Find element by visual analysis of screenshot
   */
  async findByVision(screenshot: Buffer, description: string, type: string): Promise<string | null> {
    if (!this.client) return null;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: screenshot.toString('base64')
              }
            },
            {
              type: 'text',
              text: `You are a Playwright test automation expert. Look at this screenshot and identify the ${type} element matching: "${description}".

Based on what you see, suggest a CSS selector that would work in Playwright's page.locator(). Consider:
- Text content visible on the element (use :has-text() or text= selectors)
- Position relative to labels (use :has() combinators)
- Common UI framework patterns (e.g., .oxd-select-wrapper for OrangeHRM dropdowns)

Return ONLY the CSS selector on a single line, nothing else.
If you truly cannot identify the element, return exactly: NOT_FOUND`
            }
          ]
        }]
      });

      const rawResponse = (response.content[0] as { type: string; text: string }).text?.trim();
      console.log(`[AIObserver] Vision raw response: "${rawResponse}"`);

      return this.validateSelector(rawResponse);
    } catch (error) {
      console.error('[AIObserver] Vision analysis failed:', (error as Error).message);
      return null;
    }
  }

  /**
   * Find element by DOM/HTML analysis
   */
  async findByDOM(html: string, description: string, type: string): Promise<string | null> {
    if (!this.client) return null;

    try {
      // Truncate HTML smartly - keep more content to find the element
      const truncatedHtml = html.substring(0, 30000);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `You are a Playwright test automation expert. Analyze this HTML and find a CSS selector for a ${type} element matching: "${description}".

HTML:
${truncatedHtml}

Rules:
- Return ONLY a single CSS selector on one line that works with Playwright's page.locator()
- Prefer: data-testid, id, role attributes, or unique class combinations
- You can use Playwright-specific pseudo-selectors like :has-text(), :has(), :nth-of-type()
- For OrangeHRM apps, common patterns: .oxd-select-wrapper, .oxd-input, .oxd-button
- If you truly cannot find it, return exactly: NOT_FOUND`
        }]
      });

      const rawResponse = (response.content[0] as { type: string; text: string }).text?.trim();
      console.log(`[AIObserver] DOM raw response: "${rawResponse}"`);

      return this.validateSelector(rawResponse);
    } catch (error) {
      console.error('[AIObserver] DOM analysis failed:', (error as Error).message);
      return null;
    }
  }

  /**
   * Validate and clean a selector returned by AI
   */
  private validateSelector(raw: string | undefined): string | null {
    if (!raw) return null;

    // Clean up: remove backticks, quotes, markdown formatting
    let selector = raw
      .replace(/^```[a-z]*\n?/g, '')
      .replace(/\n?```$/g, '')
      .replace(/^["'`]+|["'`]+$/g, '')
      .trim();

    // Take only the first line if multiple lines
    if (selector.includes('\n')) {
      selector = selector.split('\n')[0].trim();
    }

    if (!selector ||
        selector === 'NOT_FOUND' ||
        selector.length > 200 ||
        selector.toLowerCase().includes('sorry') ||
        selector.toLowerCase().includes('cannot') ||
        selector.toLowerCase().includes('i ')) {
      return null;
    }

    return selector;
  }

  /**
   * Suggest multiple possible selectors for an element
   */
  async suggestSelectors(description: string, html: string): Promise<string[]> {
    if (!this.client) return [];

    try {
      const truncatedHtml = html.substring(0, 12000);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Analyze this HTML and suggest 5 different CSS selectors for an element matching: "${description}".

HTML:
${truncatedHtml}

Return ONLY a JSON array of selectors, e.g.: ["selector1", "selector2", "selector3"]`
        }]
      });

      const text = (response.content[0] as { type: string; text: string }).text?.trim();

      try {
        const selectors = JSON.parse(text);
        if (Array.isArray(selectors)) {
          return selectors.filter(s => typeof s === 'string' && s.length < 150);
        }
      } catch {
        // JSON parsing failed
      }
      return [];
    } catch (error) {
      console.error('[AIObserver] Selector suggestion failed:', error);
      return [];
    }
  }
}
