"""This file includes various constants and settings for the other python scripts."""

from logging import DEBUG, INFO, WARNING, ERROR, CRITICAL  # noqa: F401
import socket


# General Specifications
CSV_PATH = "../data/sub-orders.csv"
PDF_PATH = "../data/orders.pdf"
HISTORY_FILE = "../data/history.csv"
# CSV_PATH = "./orders.csv"
SORT_CSV = True

# What to do with different headers in the CSV
# (<header title>, <function to process value before sorting>)
SORT_BY = [
    ("PERIOD", lambda x: x),
    #        extracts last names
    ("NAME", lambda x: x.split()[-1]),
]
BOLD = [
    field[0] for field in SORT_BY
]  # Bold and increase the font of these values
SKIP = ["TIME"]  # Omits these values on the labels

RECIPIENTS = [
    # Computer Science people
    "EMAIL REMOVED",
    "EMAIL REMOVED",
    "EMAIL REMOVED",
    "EMAIL REMOVED",
]
# Add sub shop people if this is the production server.
if socket.getfqdn() == "subshop.uaschools.io":
    RECIPIENTS.extend(
        [
            "EMAIL REMOVED",
            "EMAIL REMOVED",
            "EMAIL REMOVED",
        ]
    )

CLEAR_CSV = True

CSV_DELIMITER = ";"


# Logging
LOG_FILE = "../data/python-log.txt"  # use an empty string for the console
LOG_LEVEL = DEBUG


# For csv_to_pdf.py
PDF_VARS = {
    # All measurements are in inches. The values of sticker-height and
    # sticker-width include space between adjacent stickers.
    "font": "Times-Roman",  # Supports only fonts available in the reportlab library
    "font-size": 14,
    "font-size-bold": 20,  # For bolded values, not headers
    "labels": 6,
    # These measurements are for Avery Presta 94215 label paper.
    # "sticker-height" : 3.3333,
    # "sticker-width" : 4.1888,
    # "xmargin" : 0.1563,
    # "ymargin" : 0.7500,
    # "xpadding" : 0.2500,
    # "ypadding" : 0.2500,
    # These measurements are for Avery 5264 label paper
    "sticker-height": 3.3333,
    "sticker-width": 4.0000,
    "x-sticker-spacing": 0.1875,
    "y-sticker-spacing": 0.0000,
    "x-margin": 0.1563,
    "y-margin": 0.5000,
    "x-padding": 0.1250,
    "y-padding": 0.1250,
}


# For email_pdf.py
EMAIL_VARS = {
    "port": 25,
    "server_address": "localhost",  # the server has an SMTP server on the local machine
    "sender_email": f"subshopapp@{socket.getfqdn()}",
}
