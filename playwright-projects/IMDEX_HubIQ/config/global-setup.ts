// config/global-setup.ts
import * as dotenv from 'dotenv';

async function globalSetup() {
  dotenv.config();

  const aiEnabled = process.env.AI_HEALING_ENABLED === 'true';
  const model = process.env.AI_MODEL || 'claude-sonnet-4-20250514';
  console.log(`\n[SelfHealing] AI Mode: ${aiEnabled}${aiEnabled ? ` | Model: ${model}` : ''}\n`);
}

export default globalSetup;
