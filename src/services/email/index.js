import { Resend } from "resend";

const API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY;

const EmailService = new Resend(API_KEY);

export default EmailService;