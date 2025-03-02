'''
A simple Python script to convert orders for the UAHS Subshop App 
from a CSV to a printable PDF. 

(Uses reportlab to create the pdf; target template is Avery Presta 9
4215 w/ 6 labels per page)

Written November 2024. 
'''

import csv 
import json 
import datetime 
import math 

from reportlab.pdfgen import canvas 
from reportlab.lib.pagesizes import letter 
from reportlab.lib.pagesizes import inch  

def get_settings(json_file): 
    '''Opens and returns a json data as a dict.'''
    with open(json_file) as f: 
        return json.load(f) 

def main(csv_file, settings_file, debug=False): 
    """
    See module docstring for more details. 

    csv_file - filename of the CSV file from which the PDF shall be made 
    Returns None 
    """
    pdf = canvas.Canvas("orders.pdf", pagesize=letter)
    width, height = letter 
    #adjusts the location of the origin for drawing on the pdf 
    pdf.translate(0, height) 
    #This puts the origin in the top left corner, though the 
    # disavantage is that negative y values are neeeded. 

    settings = get_settings(settings_file)

    with open(csv_file) as f: 
        reader = csv.DictReader(f) 
        headers = reader.fieldnames
        i = 0 
        for row in reader: 
            text_object = pdf.beginText(
                #The measurements below are for Avery Label Paper Presta 94207 (10 labels per page) instead. 
                #(5/32 + 0.50 + (133/32)*(i%2))*inch, 
                #-(0.5 + 0.25 + 2*(math.floor((i/2)%5)))*inch, 

                #(margin + padding + appropriate displacement for the ith box)*inch

                (
                    settings["xmargin"] + settings["xpadding"] + settings["sticker-width"]*(i%2)
                    ) * inch, 

                -(
                    settings["ymargin"] + settings["ypadding"] + 
                    settings["sticker-height"]*math.floor(((i/2) % (settings["labels"]/2)))
                    ) * inch,

                )
            text_object.setFont(settings["font"], settings["font-size"])

            for h in headers: 
                text = f"{h}: {row[h]}" 
                if debug: print(text)
                text_object.textLine(text)
                    
            if (i != 0) and (i % settings["labels"] == 0): 
                #i.e., go to next page if this is the last box on a page 
                pdf.showPage() 
                pdf.translate(0, height) 
            
            pdf.drawText(text_object)
            i += 1 


    #if i%10 != 0:
    if True: 
        #does not actually display the page - rather moves to the next page 
        pdf.showPage()  
    pdf.save() 



if __name__ == "__main__": 
    print(f"Running csv_to_pdf.py at {str(datetime.datetime.now())}.")
    main("orders.csv", "settings.json", debug=True)