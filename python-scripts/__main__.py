#!./env/bin python3 
'''This script runs csv_to_pdf.py and email_pdf.py before saving the total number of orders.
It is intended to be the actual script run by the server's Node.js or cron.

THIS SCRIPT NEEDS TO BE RUN FROM ITS CONTAINING DIRECTORY.

Written March 2025.''' 

import datetime 

import csv_to_pdf 
import email_pdf 

CSV_PATH = "../layout/sub-orders.csv" 
RECIPIENTS = [
    "EMAIL REMOVED", 
    "EMAIL REMOVED",
    "EMAIL REMOVED", 
    "EMAIL REMOVED",
]
CLEAR_CSV = True 

if __name__ == "__main__":  # i.e if not imported as a module 
    print(f"Running at {str(datetime.datetime.now())}.")
    print(f"CSV_PATH: {CSV_PATH}") 
    print(f"RECIPIENTS: {RECIPIENTS}")
    print(f"CLEAR_CSV: {CLEAR_CSV}")

    errors = False 
    try: 
        csv_to_pdf.main(CSV_PATH, "settings.json") 
    except Exception as e : 
        print("Exception occured making pdf.")
        errors = True 
        print(e)
    try: 
        email_pdf.main("orders.pdf", RECIPIENTS)  
    except Exception as e: 
        print("Exception occured emailing pdf.")
        errors = True 
        print(e) 

    #Counts the number of orders in csv file and places in history.csv. 
    with open(CSV_PATH) as f:
        order_count = sum(1 for line in f) - 1 
    
    with open("history.csv", "a") as f: 
        f.write(f"{datetime.date.today()}, {order_count}\n") 


    if CLEAR_CSV: 
        #Clears all but first line (header) of csv file 
        with open(CSV_PATH, 'r+') as f: 
            header = f.readline() 
            f.truncate(0) 
        with open(CSV_PATH, 'w') as f:
            f.write(header) 
        print(f"Cleared {CSV_PATH}.")

    if errors: 
        print(f"Tasks finished with errors. \n") 
    else: 
        print(f"Tasks completed. \n") 
