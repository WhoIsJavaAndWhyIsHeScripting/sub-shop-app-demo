'''This files includes various constants and settings for the other python scripts.''' 

# General Specifications 
CSV_PATH = "../layout/sub-orders.csv" 
#CSV_PATH = "./orders.csv" 
SORT_CSV = True 
SORT_BY = ["PERIOD", "LAST"]
RECIPIENTS = [
    "EMAIL REMOVED",  # placeholders 
    "EMAIL REMOVED",
    "EMAIL REMOVED", 
    "EMAIL REMOVED", 
    "EMAIL REMOVED", 
    "EMAIL REMOVED", 
]
#CLEAR_CSV = True 
CLEAR_CSV = False 

CSV_DELIMITER = ";" 


# For csv_to_pdf.py 
PDF_VARS = {
    # These settings are for Avery Presta 94215 label paper. Dimensions have been adjusted for space between stickers. 
    "font" : "Times-Roman",
    "font-size": 14,
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
    "server_address" : "localhost",   # the server now has a SMTP server 
    "sender_email" : "subshopapp@subshop-dev.uaschools.io", 
}      
