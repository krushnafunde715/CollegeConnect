import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from flask import current_app

# Development outbox store for captured emails when SMTP is not configured
DEV_OUTBOX = []

class EmailDeliveryService:
    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str, text_content: str = "", metadata: dict = None) -> dict:
        """
        Deliver an institutional notification / token email.
        Adheres to requirements:
        - Accurately reports whether real SMTP delivery succeeded
        - Captures in development store when SMTP is not configured
        """
        mail_server = current_app.config.get('MAIL_SERVER')
        mail_port = current_app.config.get('MAIL_PORT', 587)
        mail_user = current_app.config.get('MAIL_USERNAME')
        mail_password = current_app.config.get('MAIL_PASSWORD')
        mail_sender = current_app.config.get('MAIL_DEFAULT_SENDER', 'no-reply@college.edu')
        mail_use_tls = current_app.config.get('MAIL_USE_TLS', True)
        dev_capture = current_app.config.get('DEV_EMAIL_CAPTURE_ENABLED', True)

        # If SMTP is configured with server & user
        if mail_server and mail_user and mail_password:
            try:
                msg = MIMEMultipart('alternative')
                msg['Subject'] = subject
                msg['From'] = mail_sender
                msg['To'] = to_email

                part1 = MIMEText(text_content or html_content, 'plain')
                part2 = MIMEText(html_content, 'html')
                msg.attach(part1)
                msg.attach(part2)

                server = smtplib.SMTP(mail_server, mail_port)
                if mail_use_tls:
                    server.starttls()
                server.login(mail_user, mail_password)
                server.sendmail(mail_sender, [to_email], msg.as_string())
                server.quit()

                return {
                    'success': True,
                    'delivered': True,
                    'mode': 'smtp',
                    'message': 'Email delivered successfully via SMTP server.'
                }
            except Exception as e:
                current_app.logger.error(f"SMTP delivery failed: {e}")
                return {
                    'success': False,
                    'delivered': False,
                    'mode': 'smtp_failed',
                    'message': f'Failed to send email via SMTP: {str(e)}'
                }

        # Local development fallback
        if dev_capture:
            record = {
                'id': len(DEV_OUTBOX) + 1,
                'to': to_email,
                'subject': subject,
                'html_content': html_content,
                'text_content': text_content,
                'metadata': metadata or {},
                'created_at': datetime.utcnow().isoformat(),
                'status': 'DEV_CAPTURED'
            }
            DEV_OUTBOX.append(record)
            if len(DEV_OUTBOX) > 100:
                DEV_OUTBOX.pop(0)

            return {
                'success': True,
                'delivered': False, # Honest reporting: not delivered over internet SMTP
                'mode': 'dev_captured',
                'message': 'Real SMTP email delivery is not configured. Email captured in local Development Outbox.'
            }

        return {
            'success': False,
            'delivered': False,
            'mode': 'unconfigured',
            'message': 'Email delivery is not configured and dev capture is disabled.'
        }

    @staticmethod
    def get_dev_outbox():
        """Retrieve development captured outbox for testing UI and verification workflows."""
        return list(reversed(DEV_OUTBOX))

    @staticmethod
    def clear_dev_outbox():
        DEV_OUTBOX.clear()
