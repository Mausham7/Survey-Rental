import cron from 'node-cron';
import fetch from 'node-fetch';

console.log('Cron job started. It will send remainder every day at 1 PM.');

cron.schedule('0 13 * * *', async () => {
  try {
    const response = await fetch('http://localhost:4000/api/v1/send-remainder');
    const data = await response.text(); // or response.json() if your API returns JSON
    console.log(`[${new Date().toLocaleString()}] Remainder sent:`, data);
  } catch (error) {
    console.error(`[${new Date().toLocaleString()}] Error:`, error.message);
  }
});