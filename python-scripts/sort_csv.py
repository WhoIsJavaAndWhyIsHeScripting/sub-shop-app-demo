"""Sorts a CSV file's rows in place by the contents of specified fields.
The order of the fields indicates their priority.

Written April 2025. """

import csv 
import operator 

def main(file_to_sort: str, fields: list, delimiter=',', reverse=False):
    """Sorts a csv file's rows and writes the result back into the original file.

        file_to_sort - filename of the csv file
        fields - csv header fields to sort by
        delimiter - seperator for the original csv file's cells
        reverse - whether to sort in reverse order
    """
    if not fields: 
        return #do nothing if no fields are specified   
        
    with open(file_to_sort, "r") as f: 
        reader = csv.reader(f, delimiter=delimiter) 
        rows = [row for row in reader] 
    header = rows[0]
    rows = rows[1:]

    field_ids = tuple(header.index(field) for field in fields if field in header) 
    #print(field_ids)
    if len(field_ids) == 0: 
        return  # exit function if no fields are in the actual CSV 

    rows.sort(key=operator.itemgetter(*field_ids), reverse=reverse) 

    with open(file_to_sort, "w") as f: 
        writer = csv.writer(f, delimiter=delimiter)
        writer.writerows([header]+rows) 


if __name__ == "__main__": 
    main("orders.csv", ["PERIOD", "LAST"]) 