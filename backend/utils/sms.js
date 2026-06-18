import twilio from 'twilio';

/**
 * Sends an SMS message using Twilio.
 * If credentials are not configured, it will fall back to logging in the console.
 * 
 * @param {string} to - Recipient phone number (e.g. +918238537478)
 * @param {string} body - SMS content body
 */
export const sendSMS = async (to, body) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromPhone) {
    console.log('\n⚠️  [SMS SERVICE] Twilio credentials are not fully configured in backend .env.');
    console.log(`[SIMULATED SMS to ${to}]: ${body}\n`);
    return { success: false, simulated: true };
  }

  try {
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
      body,
      from: fromPhone,
      to
    });
    console.log(`✉️  [SMS SERVICE] SMS sent successfully via Twilio. Message SID: ${message.sid}`);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('❌ [SMS SERVICE] Twilio send failed:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};
