import Anthropic from '@anthropic-ai/sdk';

/**
 * AI Observer for Self-Healing Element Detection
 * Uses Claude Vision API for intelligent element identification
 *
 * Replaces: Healenium's similarity-based healing
 * Enhancement: Uses AI vision and DOM analysis for more accurate healing
 */
export class AIObserver {
  private client: Anthropic | null = null;
  private enabled = false;
  private model = 'claude-sonnet-4-20250514';

  constructor(enableAI = true) {
    if (enableAI && process.env.ANTHROPIC_API_KEY) {
      try {
        this.client = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        });
        this.enabled = true;
        console.log('[AIObserver] Initialized with Claude Vision API');
      } catch (error) {
        console.log('[AIObserver] Failed to initialize:', error);
        this.enabled = false;
      }
    } else {
      console.log('[AIObserver] Running without AI (API key not configured)');
      console.log('[AIObserver] Set ANTHROPIC_API_KEY in .env for AI-powered healing');
    }
  }

  /**
   * Check if AI healing is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Find element by visual analysis (screenshot)
   * TIER 3 of healing strategy
   */
  async findByVision(
    screenshot: Buffer,
    description: string,
    elementType: string
  ): Promise<string | null> {
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
              text: `Find the ${elementType} element: "${description}"

Analyze the screenshot and provide a single CSS selector to locate this element.
Prioritize selectors in this order:
1. data-testid or data-test attributes
2. id attribute
3. aria-label or role attributes
4. unique class combinations
5. text content selectors (:has-text())

Return ONLY the CSS selector, nothing else. No explanation.
Example response: [data-testid="search-button"]`
            }
          ]
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const selector = content.text.trim();
        return this.isValidSelector(selector) ? selector : null;
      }
      return null;
    } catch (error) {
      console.error('[AIObserver] Vision API error:', error);
      return null;
    }
  }

  /**
   * Find element by DOM analysis
   * TIER 4 of healing strategy
   */
  async findByDOM(
    html: string,
    description: string,
    elementType: string
  ): Promise<string | null> {
    if (!this.client) return null;

    try {
      // Truncate HTML to avoid token limits
      const truncatedHtml = html.substring(0, 15000);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Analyze this HTML and find a CSS selector for:
Element type: ${elementType}
Description: "${description}"

HTML (truncated):
\`\`\`html
${truncatedHtml}
\`\`\`

Return ONLY a single CSS selector. Prefer:
1. data-testid or data-test
2. id attribute
3. unique class combinations
4. aria-label
5. text-based selectors

No explanation, just the selector.`
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const selector = content.text.trim();
        return this.isValidSelector(selector) ? selector : null;
      }
      return null;
    } catch (error) {
      console.error('[AIObserver] DOM API error:', error);
      return null;
    }
  }

  /**
   * Validate that returned text is a valid CSS selector
   */
  private isValidSelector(selector: string): boolean {
    if (!selector) return false;

    // Basic validation - selector should not contain explanatory text
    const invalid = [
      selector.length > 200,
      selector.includes('\n'),
      selector.toLowerCase().includes('the element'),
      selector.toLowerCase().includes('selector'),
      selector.toLowerCase().includes('sorry'),
      selector.toLowerCase().includes('cannot'),
      selector.toLowerCase().includes('unable')
    ];

    return !invalid.some(Boolean);
  }
}
