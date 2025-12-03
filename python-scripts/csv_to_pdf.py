"""
A simple Python script to convert orders for the UAHS Subshop App
from a CSV to a printable PDF.

(Uses reportlab to create the pdf; target template is Avery Presta 9
4215 w/ 6 labels per page)

A settings file is used to read the CSV and make the PDF. 

Written November 2024, extensively modified May 2025. 
"""

import csv
import datetime
import math

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, Frame


def main(csv_file, settings, skip=None, bold=None, delimiter=',', debug=False):
    """Makes a pdf file from a csv file of sub orders. 
    See module docstring for more details. 

    Args:
        csv_file : filename of the CSV file from which the PDF shall be made
        settings : a dictionary of various dimensions for making the PDF (for format, see settings.py) 
        skip : headers (and their values) to omit from the PDF 
        bold : headers (and values) to place first and in bold on the PDF
        delimiter: separating character for cells in the csv file
    """
    if skip is None:
        skip = []
    if bold is None:
        bold = []

    pdf = canvas.Canvas("orders.pdf", pagesize=letter)
    width, height = letter

    # adjusts the location of the origin for drawing on the pdf
    pdf.translate(0, height)
    # This puts the origin in the top left corner, though the
    # disadvantage is that negative y values are needed.

    # Define the text style
    styles = getSampleStyleSheet()
    text_style = ParagraphStyle(
        "text_style",
        parent=styles["Normal"],
        fontSize=settings["font-size"],
        fontName=settings["font"],
        leading=settings["font-size"]+2,  # line spacing
    )
    font_size_bold = settings["font-size-bold"]

    with open(csv_file) as f:
        reader = csv.DictReader(f, delimiter=delimiter)
        headers = reader.fieldnames
        i = 0
        for row in reader:
            if debug:
                print(i)

            # Frames contain other objects like Paragraphs.
            frame_object = Frame(

                # (margin + appropriate displacement for the ith box)*inch

                # x location
                (
                    settings["x-margin"] +
                    (settings["x-sticker-spacing"] +
                     settings["sticker-width"])*(i % 2)
                ) * inch,

                # y location
                -(
                    settings["y-margin"] +
                    (settings["y-sticker-spacing"]+settings["sticker-height"])
                    * math.floor(((i/2) % (settings["labels"]/2)))
                    # This extra settings["sticker-height"] is since Frame measures from the bottom left.
                    + settings["sticker-height"]) * inch,

                # width and height of Frame
                settings["sticker-width"] * inch,
                settings["sticker-height"] * inch,

                leftPadding=settings["x-padding"] * inch,
                topPadding=settings["y-padding"] * inch,

                # only draw Frame boundary if debug==True
                showBoundary=int(debug),
            )

            text = []
            for h in bold:  # add values such as name and period first
                if h not in skip and h in headers:
                    text.append(
                        f"<font size={font_size_bold}><b>{h}: {row[h]}</b></font>")
                if debug:
                    print(text)

            for h in headers:  # type: ignore
                if h not in skip and h not in bold:
                    text.append(f"<b>{h}</b>: {row[h]}")
                if debug:
                    print(text)

            if (i != 0) and (i % settings["labels"] == 0):
                # i.e., go to next page if this is the last box on a page
                pdf.showPage()
                pdf.translate(0, height)

            frame_object.addFromList(
                [Paragraph('<br/>'.join(text), text_style)],
                pdf,
            )

            i += 1

        # does not display the page--rather, it moves to the next page
        pdf.showPage()

    pdf.save()


if __name__ == "__main__":
    from settings import PDF_VARS, SKIP, BOLD
    print(f"Running csv_to_pdf.py at {str(datetime.datetime.now())}.")
    main("../layout/sub-orders.csv", PDF_VARS,
         skip=SKIP, bold=BOLD, delimiter=";", debug=True)
