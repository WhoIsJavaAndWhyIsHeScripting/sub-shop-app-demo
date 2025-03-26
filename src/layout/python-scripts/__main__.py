#!./env/bin python3 
'''This script runs csv_to_pdf.py and email_pdf.py before saving the total number of orders.
It is intended to be the actual script run by the server's Node.js or cron.

Make sure that it is run in a working directory where the script can find the csv and pdf files.

Written March 2025. 
''' 

import datetime 

import csv_to_pdf 
import email_pdf 

CSV_PATH = "orders.csv" 
RECIPIENT = input("send to?: ") #placeholder 

if __name__ == "__main__": #i.e. if not imported as a module 
    print(f"Running at {str(datetime.datetime.now())}.")
    errors = False 
    try: 
        csv_to_pdf.main(CSV_PATH, "settings.json") 
    except Exception as e : 
        print("Exception occured making pdf.")
        errors = True 
        print(e)
    try: 
        email_pdf.main("orders.pdf", RECIPIENT)  
    except Exception as e: 
        print("Exception occured emailing pdf.")
        errors = True 
        print(e) 

    #Counts the number of orders in csv file. 
    with open(CSV_PATH) as f:
        order_count = sum(1 for line in f) - 1 
    
    with open("history.csv", "a") as f: 
        f.write(f"{datetime.date.today()}, {order_count}\n") 

    #Clears all but first line of csv file 
    # with open(CSV_PATH, 'r+') as f: 
    #     header = f.readline() 
    #     f.truncate(0) 
    #     f.write(header) 

    if errors: 
        print(f"Tasks completed with errors. \n") 
    else: 
        print(f"Tasks completed. \n") 
