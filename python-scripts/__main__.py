#!./env/bin python3 
'''This script runs csv_to_pdf.py and email_pdf.py before saving the total number of orders.
It is intended to be the actual script run by the server's Node.js or cron.

THIS SCRIPT NEEDS TO BE RUN FROM ITS CONTAINING DIRECTORY.

Written March 2025.''' 

import datetime 
import traceback 

import sort_csv 
import csv_to_pdf 
import email_pdf 

CSV_PATH = "../layout/sub-orders.csv" 
#CSV_PATH = "./orders.csv" 
SORT_CSV = True 
RECIPIENTS = [
    "EMAIL REMOVED",  # placeholders 
    "EMAIL REMOVED",
    "EMAIL REMOVED", 
    "EMAIL REMOVED",
    "EMAIL REMOVED", 
    "EMAIL REMOVED", 
]
CLEAR_CSV = True 
SETTINGS_PATH = "./settings.json"

if __name__ == "__main__":  # i.e if not imported as a module 
    print(f"Running at {str(datetime.datetime.now())}.") 
    print(f"CSV_PATH: {CSV_PATH}") 
    print(f"SORT_CSV: {SORT_CSV}") 
    print(f"RECIPIENTS: {RECIPIENTS}")
    print(f"CLEAR_CSV: {CLEAR_CSV}")
    print(f"SETTINGS_PATH: {SETTINGS_PATH}")
    print()

    errors = False 

    if SORT_CSV: 
        try: 
            sort_csv.main(CSV_PATH, ["PERIOD", "LAST"]) 
        except Exception as e: 
            print("Exception occured sorting csv.")
            errors = True 
            traceback.print_exc()   
            print() 

    try: 
        csv_to_pdf.main(CSV_PATH, SETTINGS_PATH) 
    except Exception as e : 
        print("Exception occured making pdf.")
        errors = True 
        traceback.print_exc() 
        print()

    try: 
        email_pdf.main("orders.pdf", RECIPIENTS)  
    except Exception as e: 
        print("Exception occured emailing pdf.")
        errors = True 
        print("Uh-oh")
        traceback.print_exc()  
        print()


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

    print()

    if errors: 
        print(f"Tasks finished with errors at {str(datetime.datetime.now())}. \n") 
    else: 
        print(f"Tasks completed at {str(datetime.datetime.now())}. \n") 
