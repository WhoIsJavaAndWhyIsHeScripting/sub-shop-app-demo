#!./env/bin python3 
'''This script runs csv_to_pdf.py and email_pdf.py before saving the total number of orders.
It is intended to be the actual script run by the server's Node.js or cron.

THIS SCRIPT NEEDS TO BE RUN FROM ITS CONTAINING DIRECTORY.

Written March 2025.''' 

# Get various constants and settings 
import settings 

import datetime 
import traceback 

import sort_csv 
import csv_to_pdf 
import email_pdf 

if __name__ == "__main__":  # i.e if not imported as a module 
    print(f"Running at {str(datetime.datetime.now())}.") 
    print(f"CSV_PATH: {settings.CSV_PATH}") 
    print(f"SORT_CSV: {settings.SORT_CSV}") 
    print(f"RECIPIENTS: {settings.RECIPIENTS}")
    print(f"CLEAR_CSV: {settings.CLEAR_CSV}")

    errors = False 

    if settings.SORT_CSV: 
        try: 
            sort_csv.main(settings.CSV_PATH, settings.SORT_BY) 
        except Exception as e: 
            print() 
            print("Exception occured sorting csv.")
            errors = True 
            traceback.print_exc()   
            print() 
        else: 
            print("Sorted CSV file.") 

    try: 
        csv_to_pdf.main(settings.CSV_PATH, settings.PDF_VARS, delimiter=settings.CSV_DELIMITER) 
    except Exception as e: 
        print() 
        print("Exception occured making pdf.")
        errors = True 
        traceback.print_exc() 
        print() 
    else: 
        print("Made PDF.")

    try: 
        email_pdf.main("orders.pdf", settings.RECIPIENTS)  
    except Exception as e: 
        print() 
        print("Exception occured emailing pdf.")
        errors = True 
        traceback.print_exc()  
        print() 
    else: 
        print("Emailed PDF.")


    #Counts the number of orders in csv file and places in history.csv. 
    with open(settings.CSV_PATH) as f:
        order_count = sum(1 for line in f) - 1 
    
    with open("history.csv", "a") as f: 
        f.write(f"{datetime.date.today()}, {order_count}\n") 

    print(f"There were {order_count} order(s) in the CSV file.") 

    if settings.CLEAR_CSV: 
        #Clears all but first line (header) of csv file 
        with open(settings.CSV_PATH, 'r+') as f: 
            header = f.readline() 
            f.truncate(0) 
        with open(settings.CSV_PATH, 'w') as f:
            f.write(header) 
        print(f"Cleared {settings.CSV_PATH}.")

    print()

    if errors: 
        print(f"Tasks finished with errors at {str(datetime.datetime.now())}. \n") 
    else: 
        print(f"Tasks completed at {str(datetime.datetime.now())}. \n") 
