import { Xendit } from 'xendit-node';

const x = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || 'xnd_development_...',
});

export const { Invoice } = x;
