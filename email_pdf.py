'''Sends an email with orders.pdf as an attachement.
Uses EMAIL REMOVED account. 
Commented out code is for using a Google oauth file. 
Currently intended to use a STMP server at UAHS. ''' 

#This program is unfinished! There are also some security concerns 
#that might need addressed (currently uses input() to get password). 

import datetime 

#For smtp 
import smtplib 
import ssl 

#For email and attachments 
from email import encoders 
from email.mime.base import MIMEBase 
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText  

#import yagmail 

def main(recipient, pdf_file, oauth_file=''): 
    port = 25 #I think this is right, but I am not certain. 
    server_address = "smtp.uaschools.org" 
    sender_email = "EMAIL REMOVED"

    date = datetime.date.today().strftime("%B %d, %Y")
    subject = f"Bear Bites Orders for {date}"
    body = f"Hello! Attached are today's orders." 

    #Create object representing message content 
    message = MIMEMultipart() 
    message["From"] = sender_email 
    message["To"] = recipient 
    message["Subject"] = subject 
    message.attach(MIMEText(body, "plain")) 

    #Open and attached the PDF file 
    with open(pdf_file, 'rb') as attachment: 
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read()) 
    encoders.encode_base64(part) 
    part.add_header(
        "content-disposition", 
        f"attachment; {pdf_file}", 
    )
    message.attach(part) 

    
    context = ssl.create_default_context() #for encryption 
    with smtplib.SMTP_SSL(server_address, port, context=context) as server: 
        server.login(sender_email, password=input("password?:")) #this is a problem if this is to run automatically! 
        server.sendmail(sender_email, recipient, message.as_string())

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
        input("send to?"), 
        "orders.pdf", 
        #input("oauth file?"),
        )