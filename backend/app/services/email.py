import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.services.ai_engine import ai_engine

class EmailService:
    def __init__(self):
        # In production, load from env
        self.smtp_server = "smtp.gmail.com" 
        self.smtp_port = 587
        self.username = "your_email@gmail.com"
        self.password = "your_app_password"

    def generate_template(self, type: str, context: dict) -> str:
        """
        Generates an email draft using the AI engine (or fallback templates).
        """
        target = context.get("target_name", "Hiring Manager")
        company = context.get("company", "the company")
        role = context.get("role", "the position")
        sender = context.get("sender_name", "Applicant")

        if type == "referral":
            prompt = f"Draft a concise LinkedIn connection request for a referral to {company} for {role}."
            # In real flow, call ai_engine.improve_bullet_point or similar generation method
            # For now, logical template:
            return f"Subject: Applying to {role} at {company} - Quick Question\n\nHi {target},\n\nI'm {sender}, a developer passionate about {company}'s work. I noticed an open {role} role and would love to ask a quick question about the team culture. Would you be open to connecting?\n\nBest,\n{sender}"
        
        elif type == "followup":
            return f"Subject: Follow up on my application for {role}\n\nHi {target},\n\nI applied for the {role} position last week and wanted to reiterate my strong interest in joining {company}. Please let me know if there is any other information I can provide.\n\nBest,\n{sender}"

        return ""

    def send_email(self, to_email: str, subject: str, body: str) -> bool:
        """
        Sends an email via SMTP. 
        Returns True if success (or simulated success).
        """
        print(f"--- SIMULATING EMAIL SENDING ---\nTo: {to_email}\nSubject: {subject}\nBody: {body}\n--------------------------------")
        return True
        # SMTP Implementation (Commented out for safety/no-creds)
        # try:
        #     msg = MIMEMultipart()
        #     msg['From'] = self.username
        #     msg['To'] = to_email
        #     msg['Subject'] = subject
        #     msg.attach(MIMEText(body, 'plain'))
        #     with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
        #         server.starttls()
        #         server.login(self.username, self.password)
        #         server.send_message(msg)
        #     return True
        # except Exception as e:
        #     print(f"Email failed: {e}")
        #     return False

email_service = EmailService()
