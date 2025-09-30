"""Sends an email with orders.pdf as an attachment.

Commented out code is for using a Google oauth file or
for ssl; it is best left as is.

Currently set up to use a district STMP server. This
requires no login as long as one is on the school Wi-Fi.
(if outside of school, a socket.gaierror occurs or, after
a time, an OSError saying the network is unreachable or,
sometimes, a ConnectionRefusedError).

Note: An empty string for the PDF filename is considered a lack
of any sub orders.

Written January 2025."""

import datetime 
from pathlib import Path 

#For smtp 
import smtplib 
#import ssl # No ssl for uaschools SMTP server.

#For email and attachments 
from email import encoders 
from email.mime.base import MIMEBase 
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText  

def main(pdf_file, settings, recipients, csv_file='', debug=False):
    """See module docstring."""
    #Configuration for the SMTP server. - now uses settings.py 
    #port = 25  
    #server_address = "smtp.uaschools.org" 
    #sender_email = "EMAIL REMOVED" 

    # Should probably move into settings.py 
    date = datetime.date.today().strftime("%B %d, %Y")
    subject = f"Bear Bites Orders for {date}" 

    if not pdf_file:  # id est no orders for today 
        body = "Hello! There were no orders for today." 

    else: 
        body = f"Hello! Attached are today's orders." 

    # Create object representing message content 
    message = MIMEMultipart() 
    message["From"] = settings["sender_email"] 
    message["To"] = ", ".join(recipients)  
    message["Subject"] = subject 
    message.attach(MIMEText(body, "plain")) 

    if pdf_file:  # i.e. there are orders today 
        #Open and attached the PDF file 
        with open(pdf_file, 'rb') as attachment: 
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read()) 
        encoders.encode_base64(part) 
        part.add_header(
            "content-disposition", 
            "attachment", 
            filename=Path(pdf_file).name, 
        )
        message.attach(part) 

    if pdf_file and csv_file: 
        # Open and attach the csv file if there is a pdf file as well 
        with open(csv_file, 'r') as attachment: 
            part = MIMEBase("text", "csv")
            part.set_payload(attachment.read()) 
        encoders.encode_base64(part) 
        part.add_header(
            "content-disposition", 
            "attachment", 
            filename=Path(csv_file).name, 
        )
        message.attach(part) 


    if debug: 
        print(message.as_string()) 

    # Because there is a UA schools SMTP server on the server, no password or login is needed.
    with smtplib.SMTP(settings["server_address"], settings["port"]) as server: 
        try:  
            server.sendmail(settings["sender_email"], recipients, message.as_string()) 
        except Exception as e:
            if debug: 
                print("There was an error sending the email.")
            raise e 
        else: 
            if debug: 
                print(f"Mail sent with orders.pdf at {str(datetime.datetime.now())}.")

    
if __name__ == "__main__": #i.e. if not imported as a module 
    from settings import EMAIL_VARS 

    main(
        "orders.pdf", 
        EMAIL_VARS, 
        [input("send to?")], 
        csv_file="orders.csv", 
        debug=True, 
        )