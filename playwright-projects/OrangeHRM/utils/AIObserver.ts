// utils/AIObserver.ts
import Anthropic from '@anthropic-ai/sdk';

export class AIObserver {
  private client: Anthropic | null = null;
  private enabled = false;
  private model: string;

  constructor() {
    if (process.env.ANTHROPIC_API_KEY && process.env.AI_HEALING_ENABLED !== 'false') {
      this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      this.enabled = true;
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
        max_tokens: 200,
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
              text: `You are a test automation expert. Analyze this screenshot and find the CSS selector for a ${type} element that matches this description: "${description}".

Requirements:
- Return ONLY the CSS selector, nothing else
- Prefer data-testid, id, or unique class selectors
- Make the selector as specific and reliable as possible
- If you cannot find it, return "NOT_FOUND"

CSS Selector:`
            }
          ]
        }]
      });

      const selector = (response.content[0] as { type: string; text: string }).text?.trim();

      // Validate the selector
      if (selector &&
          selector !== 'NOT_FOUND' &&
          selector.length < 150 &&
          !selector.includes('\n') &&
          !selector.toLowerCase().includes('sorry') &&
          !selector.toLowerCase().includes('cannot')) {
        return selector;
      }
      return null;
    } catch (error) {
      console.error('[AIObserver] Vision analysis failed:', error);
      return null;
    }
  }

  /**
   * Find element by DOM/HTML analysis
   */
  async findByDOM(html: string, description: string, type: string): Promise<string | null> {
    if (!this.client) return null;

    try {
      // Truncate HTML to avoid token limits
      const truncatedHtml = html.substring(0, 15000);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `You are a test automation expert. Analyze this HTML and find the CSS selector for a ${type} element that matches this description: "${description}".

HTML:
${truncatedHtml}

Requirements:
- Return ONLY the CSS selector, nothing else
- Prefer data-testid, id, or unique class selectors
- Make the selector as specific and reliable as possible
- If you cannot find it, return "NOT_FOUND"

CSS Selector:`
        }]
      });

      const selector = (response.content[0] as { type: string; text: string }).text?.trim();

      // Validate the selector
      if (selector &&
          selector !== 'NOT_FOUND' &&
          selector.length < 150 &&
          !selector.includes('\n') &&
          !selector.toLowerCase().includes('sorry') &&
          !selector.toLowerCase().includes('cannot')) {
        return selector;
      }
      return null;
    } catch (error) {
      console.error('[AIObserver] DOM analysis failed:', error);
      return null;
    }
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
