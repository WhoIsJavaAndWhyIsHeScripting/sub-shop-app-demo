'''This files includes various constants and settings for the other python scripts.''' 

from logging import DEBUG, INFO, WARNING, ERROR, CRITICAL 

# General Specifications 
CSV_PATH = "../layout/sub-orders.csv" 
#CSV_PATH = "./orders.csv" 
SORT_CSV = True 

# What to do with different headers in the CSV 
SORT_BY = ["PERIOD", "LAST"] 
BOLD = SORT_BY  # Bold increase font of these values 
SKIP = ["TIME"] # Skip omits these values on the labels 

RECIPIENTS = [
    # Computer Science people 
    "EMAIL REMOVED",  
    "EMAIL REMOVED",
    "EMAIL REMOVED", 
    "EMAIL REMOVED", 
    
    # Sub Shop people 
    "EMAIL REMOVED", 
    "EMAIL REMOVED", 
    "EMAIL REMOVED",
]

CLEAR_CSV = True 
#CLEAR_CSV = False 

CSV_DELIMITER = ";" 

# Logging 
LOG_FILE = "log.txt"  # use an empty string for the console  
LOG_LEVEL = DEBUG 

# For csv_to_pdf.py 
PDF_VARS = {
    # These settings are for Avery Presta 94215 label paper. 
    # Dimensions have been adjusted for space between stickers. 
    "font" : "Times-Roman",  # Supports only fonts available in the reportlab library 
    "font-size": 14, 
    "font-size-bold": 20,  # For bolded values, not headers 
    "labels" : 6,
    "sticker-height" : 3.3333,
    "sticker-width" : 4.1888,
    "xmargin" : 0.1563,
    "ymargin" : 0.7500,
    "xpadding" : 0.5000,
    "ypadding" : 0.2500,
}


# For email_pdf.py 
EMAIL_VARS = {
    "port" : 25, 
    #"server_address" : "smtp.uaschools.org", 
    "server_address" : "localhost",   # the server now has a SMTP server on the local machine
    "sender_email" : "subshopapp@subshop-dev.uaschools.io", 
}      
