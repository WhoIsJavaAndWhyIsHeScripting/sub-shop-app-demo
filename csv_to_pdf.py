'''
A simple Python script to convert orders for the UAHS Subshop App 
from a CSV to a printable PDF. 

(Uses reportlab to create the pdf; target template is Avery Presta 94207)

Written November 2024. 
'''

import csv 
import datetime 
import math 

from reportlab.pdfgen import canvas 
from reportlab.lib.pagesizes import letter 
from reportlab.lib.pagesizes import inch 


#DO-TO: 
#fix overlapping text - either use an offset or a paragraph 
#print test page 
#add more rows to the CSV file 


def main(csv_file): 
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


    with open(csv_file) as f: 
        reader = csv.DictReader(f) 
        headers = reader.fieldnames
        i = 0 
        for row in reader: 
            text_object = pdf.beginText(
                #The measurements below are for Avery Label Paper Presta 94207 (10 labels per page )
                (5/32 + 0.50 + (133/32)*(i%2))*inch, 
                -(0.5 + 0.25 + 2*(math.floor((i/2)%5))  )*inch, 
                #(margin + padding + appropriate displacement for the ith box)*inch
                )
            text_object.setFont("Times-Roman", 10)

            for h in headers: 
                text = f"{h}: {row[h]}" 
                print(text)
                text_object.textLine(text)
                    
            if (i != 0) and (i%10 == 0): 
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
    main ("orders.csv")