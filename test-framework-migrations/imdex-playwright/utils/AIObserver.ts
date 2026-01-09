import Anthropic from '@anthropic-ai/sdk';

/**
 * AI Observer for Self-Healing
 * Migrated from: HealeniumListener.java AI/ML healing capabilities
 * Original framework: Healenium (EPAM) with server-based healing
 *
 * This implementation uses Anthropic Claude for intelligent element location
 * when all predefined selectors fail.
 */
export class AIObserver {
  private client: Anthropic | null = null;
  private enabled: boolean;
  private model: string = 'claude-sonnet-4-20250514';

  constructor() {
    this.enabled = process.env.ENABLE_AI_OBSERVER === 'true' &&
                   !!process.env.ANTHROPIC_API_KEY;

    if (this.enabled) {
      try {
        this.client = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        });
        console.log('[AIObserver] Initialized with Anthropic Claude');
      } catch (error) {
        console.log('[AIObserver] Failed to initialize:', error);
        this.enabled = false;
      }
    }
  }

  /**
   * Check if AI observer is enabled
   */
  isEnabled(): boolean {
    return this.enabled && this.client !== null;
  }

  /**
   * Find element using AI vision capabilities
   * Analyzes screenshot and page content to suggest a selector
   *
   * @param screenshot - Page screenshot as Buffer
   * @param elementDescription - Human-readable description of the element
   * @param pageContent - HTML content of the page
   * @returns Suggested CSS selector or null
   */
  async findElement(
    screenshot: Buffer,
    elementDescription: string,
    pageContent: string
  ): Promise<string | null> {
    if (!this.client) {
      return null;
    }

    try {
      // Truncate page content to avoid token limits
      const truncatedContent = pageContent.slice(0, 50000);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 500,
        messages: [
          {
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
                text: `You are a test automation expert. I need to find a CSS selector for an element on this webpage.

Element Description: ${elementDescription}

Here is a portion of the page HTML:
\`\`\`html
${truncatedContent}
\`\`\`

Based on the screenshot and HTML, provide the MOST RELIABLE CSS selector for this element.

Requirements:
1. Prefer selectors using: data-test, data-testid, id, or unique class names
2. Avoid overly specific selectors that might break easily
3. The selector should be unique on the page
4. Return ONLY the CSS selector, nothing else

If you cannot find a suitable selector, respond with: ELEMENT_NOT_FOUND`
              }
            ]
          }
        ]
      });

      // Extract selector from response
      const content = response.content[0];
      if (content.type === 'text') {
        const selector = content.text.trim();

        if (selector === 'ELEMENT_NOT_FOUND' || !selector) {
          console.log('[AIObserver] Could not find element');
          return null;
        }

        // Validate selector format
        if (this.isValidSelector(selector)) {
          console.log(`[AIObserver] Suggested selector: ${selector}`);
          return selector;
        }
      }

      return null;
    } catch (error) {
      console.log('[AIObserver] Error finding element:', error);
      return null;
    }
  }

  /**
   * Validate CSS selector format
   */
  private isValidSelector(selector: string): boolean {
    // Basic validation - selector should not be too long or contain obvious errors
    if (selector.length > 200) return false;
    if (selector.includes('```')) return false;
    if (selector.includes('html')) return false;

    // Check for common selector patterns
    const validPatterns = [
      /^[#.[]/, // Starts with #, ., or [
      /^\w+[#.[]/, // Tag followed by id/class/attribute
      /^\w+$/, // Just a tag name
      /^:has-text/ // Playwright text selector
    ];

    return validPatterns.some(pattern => pattern.test(selector));
  }

  /**
   * Analyze page for potential element locations
   * Used for debugging and improving selectors
   */
  async analyzePageStructure(
    screenshot: Buffer,
    pageContent: string
  ): Promise<{ suggestions: string[]; issues: string[] }> {
    if (!this.client) {
      return { suggestions: [], issues: [] };
    }

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1000,
        messages: [
          {
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
                text: `Analyze this webpage for test automation. Identify:

1. Key interactive elements (buttons, links, inputs, dropdowns)
2. Potential issues with locator stability (dynamic IDs, generic classes)
3. Recommended data-test attributes to add

Provide response as JSON:
{
  "suggestions": ["list of recommended selector improvements"],
  "issues": ["list of potential locator stability issues"]
}`
              }
            ]
          }
        ]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        try {
          return JSON.parse(content.text);
        } catch {
          return { suggestions: [], issues: [] };
        }
      }

      return { suggestions: [], issues: [] };
    } catch (error) {
      console.log('[AIObserver] Analysis error:', error);
      return { suggestions: [], issues: [] };
    }
  }

  /**
   * Generate healing recommendations based on failure patterns
   */
  generateRecommendations(
    failedSelectors: { selector: string; description: string }[]
  ): string[] {
    const recommendations: string[] = [];

    for (const failed of failedSelectors) {
      // Analyze selector type and suggest improvements
      if (failed.selector.startsWith('//')) {
        recommendations.push(
          `Convert XPath to CSS for "${failed.description}": XPath selectors are slower and more brittle`
        );
      }

      if (failed.selector.includes('[class*=')) {
        recommendations.push(
          `Add data-test attribute for "${failed.description}": Partial class matching is unreliable`
        );
      }

      if (/\[id=["'][a-z]+_\d+["']\]/.test(failed.selector)) {
        recommendations.push(
          `Dynamic ID detected for "${failed.description}": Use a stable attribute instead`
        );
      }
    }

    return recommendations;
  }
}
