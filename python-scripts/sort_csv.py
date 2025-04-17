'''Sorts a CSV file's rows in place by the contents of specified fields.

Written April 2025. '''

import csv 
import operator 

def main(file_to_sort: str, fields: list, reverse=False):
    if not fields: 
        return #do nothing if no fields are specified   
        
    with open(file_to_sort, "r") as f: 
        reader = csv.reader(f) 
        rows = [row for row in reader] 
    header = rows[0]
    rows = rows[1:]

    field_ids = tuple(header.index(field) for field in fields if field in header) 
    rows.sort(key=operator.itemgetter(*field_ids), reverse=reverse) 

    with open(file_to_sort, "w") as f: 
        writer = csv.writer(f)
        writer.writerows([header]+rows) 


if __name__ == "__main__": 
    main("orders.csv", ["PERIOD", "LAST"]) 