"""Sorts a CSV file's rows in place by the contents of specified fields.
The order of the fields indicates their priority. The values of a field can also 
be passed through a function before sorting.

Written April 2025. """

import csv 

def _keys(field_ids, funcs): 
    """Returns a key function for the .sort() method.

    Args:
        field_ids (list): a list of integers of the indices to sort by 
        funcs (list): a list of functions to process field values (use 
            lambda x:x to do nothing to a field's value) 

    Returns:
        function: a function to pass as a key for sorting 
    """
    if len(funcs) != len(field_ids): 
        raise ValueError("different number of field ids and functions")
    
    def getter(line): 
        items = [] 
        for index, func in zip(field_ids, funcs): 
            items.append(func(line[index])) 
        return tuple(items) 
    
    return getter 


def main(file_to_sort: str, fields: list, delimiter=',', reverse=False):
    """Sorts a csv file's rows and writes the result back into the original file.
    
        file_to_sort - filename of the csv file 
        fields - csv header fields to sort by as well as the functions to 
            process each value  
        delimiter - seperator for the original csv file's cells 
        reverse - whether to sort in reverse order 
    """
    if not fields: 
        return # do nothing if no fields are specified   
        
    with open(file_to_sort, "r") as f: 
        reader = csv.reader(f, delimiter=delimiter) 
        rows = [row for row in reader] 
    header = rows[0]
    #print(header) 
    rows = rows[1:]

    field_ids = tuple(header.index(field[0]) for field in fields if field[0] in header) 
    #print(field_ids)
    if len(field_ids) == 0: 
        return  # exit function if no fields are in the actual CSV 

    rows.sort(
        key=_keys(field_ids, [field[1] for field in fields]), 
        reverse=reverse,
        ) 

    with open(file_to_sort, "w") as f: 
        writer = csv.writer(f, delimiter=delimiter)
        writer.writerows([header]+rows) 


if __name__ == "__main__": 
    main(
        "../layout/sub-orders.csv", 
        [("PERIOD", lambda x: x), ("NAME", lambda x: x.split()[-1])], 
        delimiter=";") 