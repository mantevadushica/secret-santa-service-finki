import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

console.log('SERVICE:', SERVICE_ID)
console.log('TEMPLATE:', TEMPLATE_ID)
console.log('PUBLIC:', PUBLIC_KEY)

export const sendEventInvitation = async ({
  toEmail,
  organizerName,
  organizerEmail,
  eventName,
  joinCode
}) => {

  const templateParams = {
    to_email: toEmail,
    organizer_name: organizerName,
    organizer_email: organizerEmail,
    event_name: eventName,
    join_code: joinCode
  }

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    templateParams,
    {
      publicKey: PUBLIC_KEY
    }
  )
}