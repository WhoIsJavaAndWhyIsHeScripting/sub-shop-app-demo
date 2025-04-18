'''Sends an email with orders.pdf as an attachement.
Uses EMAIL REMOVED account as the sender. 

Commented out code is for using a Google oauth file or 
for ssl; it is best left as is.  

Currently set up to use a STMP server at UAHS. This 
requires no login as long as one is on the school Wi-Fi.
(if outside of school, a socket.gaierror occurs or, after 
a time, an OSError saying the network is unreachable).

Written January 2025.'''  

import datetime 

#For smtp 
import smtplib 
#import ssl #No ssl for uaschools SMTP server. 

#For email and attachments 
from email import encoders 
from email.mime.base import MIMEBase 
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText  
 
#import yagmail #Third party module for oauth - no longer needed 

def main(pdf_file, recipients, oauth_file=''): 
    #Configuration for the SMTP server. 
    port = 25  
    server_address = "smtp.uaschools.org" 
    sender_email = "EMAIL REMOVED"

    date = datetime.date.today().strftime("%B %d, %Y")
    subject = f"Bear Bites Orders for {date}"
    body = f"Hello! Attached are today's orders." 

    #Create object representing message content 
    message = MIMEMultipart() 
    message["From"] = sender_email 
    message["To"] = ", ".join(recipients)  
    message["Subject"] = subject 
    message.attach(MIMEText(body, "plain")) 

    #Open and attached the PDF file 
    with open(pdf_file, 'rb') as attachment: 
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read()) 
    encoders.encode_base64(part) 
    part.add_header(
        "content-disposition", 
        "attachment",
        filename=pdf_file, 
    )
    message.attach(part) 

    print("here we go")

    #context = ssl.create_default_context() #for encryption 
    with smtplib.SMTP(server_address, port) as server: 
        print("getting there")
        #server.login(sender_email, password=input("sender password?")) #not secure, but also unused 
        try: 
            #There is no need to login if the connection is successfully made. 
            server.sendmail(sender_email, recipients, message.as_string()) 
        except Exception as e:
            print("There was an error sending the email.")
            raise e 
        else: 
            print(f"Mail sent with orders.pdf at {str(datetime.datetime.now())}.")


    #Only needed if using Google oauth
    # contents = [
    #     "Here is today's orders!", 
    #     pdf_file, 
    # ]

    # yagmail.STMP("EMAIL REMOVED", oauth2_file= oauth_file)
    # yagmail.send(
    #     to=recipient, 
    #     subject=f"Orders for {str(datetime.datetime.now())}",
    #     contents=contents,
    #     )

    
if __name__ == "__main__": #i.e. if not imported as a module
    main(
        "orders.pdf", 
        [input("send to?")], 
        )