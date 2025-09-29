#!./env/bin python3 
'''This script runs csv_to_pdf.py and email_pdf.py before saving the total 
number of orders.
It is intended to be the script run by the server's Node.js or cron.

THIS SCRIPT NEEDS TO BE RUN FROM ITS CONTAINING DIRECTORY! 
(Otherwise the relative paths break.) 

Written March 2025.''' 

# Get various constants and settings for the scripts 
import settings 

import datetime 
import logging 
import logging 

import sort_csv 
import sort_csv 
import csv_to_pdf 
import email_pdf 

if __name__ == "__main__":  # i.e if not imported as a module  
    if settings.LOG_FILE: 
        logging.basicConfig(filename=settings.LOG_FILE, level=settings.LOG_LEVEL) 
        print(f"Running at {str(datetime.datetime.now())}.") 
        print("See log for more details.")
    else: 
        logging.basicConfig(level=settings.LOG_LEVEL) 

    logging.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    
    logging.info(f"Running at {str(datetime.datetime.now())}.") 
    logging.debug(f"CSV_PATH: {settings.CSV_PATH}") 
    logging.debug(f"SORT_CSV: {settings.SORT_CSV}") 
    logging.debug(f"RECIPIENTS: {settings.RECIPIENTS}")
    logging.debug(f"CLEAR_CSV: {settings.CLEAR_CSV}")

    errors = False 

    if settings.SORT_CSV: 
        try: 
            sort_csv.main(settings.CSV_PATH, settings.SORT_BY, delimiter=settings.CSV_DELIMITER) 
        except Exception as e: 
            logging.error("Exception occured sorting csv.")
            logging.error(e)
            errors = True 
            #traceback.print_exc(file=settings.LOG_FILE)   
        else: 
           logging.debug("Sorted CSV file.") 

    # Counts the number of orders in csv file. 
    with open(settings.CSV_PATH) as f:
    # Counts the number of orders in csv file. 
    with open(settings.CSV_PATH) as f:
        order_count = sum(1 for line in f) - 1 
    
    logging.debug(f"There were {order_count} order(s) in the CSV file.") 

    if order_count == 0: 
        try: 
            email_pdf.main("", settings.EMAIL_VARS, settings.RECIPIENTS)  # a blank file name indicates that there were no orders 
        except Exception as e:  
            logging.error("Exception occured emailing no orders message.")
            logging.error(e)
            errors = True 
            #traceback.print_exc(file=settings.LOG_FILE)   
        else: 
            logging.debug("Emailed no orders message.")
    
    else: 
        try: 
            csv_to_pdf.main(
                settings.CSV_PATH, 
                settings.PDF_VARS, 
                skip=settings.SKIP, 
                bold=settings.BOLD, 
                delimiter=settings.CSV_DELIMITER, 
                ) 
        except Exception as e: 
            logging.error("Exception occured making pdf.")
            logging.error(e)
            errors = True 
            #traceback.print_exc(file=settings.LOG_FILE)  
        else: 
            logging.debug("Made PDF.")

        try: 
            email_pdf.main("orders.pdf", 
                           settings.EMAIL_VARS, 
                           settings.RECIPIENTS, 
                           csv_file=settings.CSV_PATH,
                           )  
        except Exception as e:  
            logging.error("Exception occured emailing pdf.")
            logging.error(e)
            errors = True 
            #traceback.print_exc(file=settings.LOG_FILE)   
        else: 
            logging.debug("Emailed PDF.")

        # Saves the number of orders to a CSV file.    
        with open("history.csv", "a") as f: 
            f.write(f"{datetime.date.today()}, {order_count}\n") 

        if settings.CLEAR_CSV: 
            #Clears all but first line (header) of csv file 
            with open(settings.CSV_PATH, 'r+') as f: 
                header = f.readline() 
                f.truncate(0) 
            with open(settings.CSV_PATH, 'w') as f:
                f.write(header.strip())  # does not include newline 
            logging.debug(f"Cleared {settings.CSV_PATH}.")
        if settings.CLEAR_CSV: 
            #Clears all but first line (header) of csv file 
            with open(settings.CSV_PATH, 'r+') as f: 
                header = f.readline() 
                f.truncate(0) 
            with open(settings.CSV_PATH, 'w') as f:
                f.write(header.strip())  # does not include newline 
            logging.debug(f"Cleared {settings.CSV_PATH}.")

    if errors: 
        logging.info(f"Tasks finished with errors at {str(datetime.datetime.now())}. \n") 
        logging.info(f"Tasks finished with errors at {str(datetime.datetime.now())}. \n") 
    else: 
        logging.info(f"Tasks completed at {str(datetime.datetime.now())}. \n") 
        logging.info(f"Tasks completed at {str(datetime.datetime.now())}. \n") 
