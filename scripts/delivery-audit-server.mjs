// Local production server; shared implementation also powers browser CI.
import { startDeliveryServer } from './lib/delivery-server.mjs'
const site = await startDeliveryServer({ root: process.argv[2] || 'dist', port: Number(process.argv[3] || 5194) })
console.log(`Delivery audit: ${site.url}`)
