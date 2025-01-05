'''Sends an email with orders.pdf as an attachement.''' 

import datetime 
import yagmail 

def main(recipient, pdf_file, oauth_file): 
    contents = [
        "Here is today's orders!", 
        pdf_file, 
    ]

    yagmail.STMP("EMAIL REMOVED", oauth2_file= oauth_file)
    yagmail.send(
        to="recipient", 
        subject=f"Orders for {str(datetime.datetime.now())}",
        contents=contents,
        )
    
if __name__ == "__main__": #i.e. if not imported 
    main(input("send to?"), "orders.pdf", input("oauth file?"))