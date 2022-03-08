"""
I'm constantly taking large sections of HTML tags, and trying to incorporate 
them as plaintext into other HTML documents. The problem is that you have to 
do a lot of formatting, otherwise they'll all be interpretted as 'code'.

I'm making this to read through HTML & .py files and convert things that would 
otherwise be read as html tags, such as:
    < > change to &lt; or &gt;
    INDENT change to &emsp;
    NEW_LINE change to <br>
    EMPTY_LINE change to <br>

    From Django:
    {{ }} change to {{ }<!-- -->}
    {% %} change to {% %<!-- -->}

OUTPUT: a .txt file with updated strings
"""

class Converter():
    """A Converter object can take either HTML or python files, and format them 
    so that they can be written into an html doc as plaintext"""

    def __init__(self, path, file_type):
        self.path = path
        self.file_type = file_type

    def py_to_text(self, some_list) -> list:
        new_list = []

        # replace stuff
        for item in some_list:
            item = item.replace('    ', '&emsp;')
            new_list.append(item)
        
        # add stuff
        newer_list = []
        for item in new_list[:-1]:
            newer_list.append(item + '<br>')
        newer_list.append(new_list[-1])

        return newer_list

    def html_to_text(self, some_list) -> list:
        new_list = []

        # replace stuff
        for item in some_list:
            item = item.replace('<', '&lt;').replace('>', '&gt;').replace('%}', '%<!-- -->}').replace('}}','}<!-- -->}').replace('    ', '&emsp;')
            new_list.append(item)
        
        # add stuff
        newer_list = []
        for item in new_list[:-1]:
            newer_list.append(item + '<br>')
        newer_list.append(new_list[-1])

        return newer_list


# READ THE FILE;  SAVE LINES IN A LIST
def read(path) -> list:
    with open(path, 'r') as f:
        list_of_lines = f.readlines()
        list_stripped = []
        for i in range(len(list_of_lines)):
            if i < (len(list_of_lines)-1):
                list_of_lines[i] = list_of_lines[i][:-1]
            list_stripped.append(list_of_lines[i])
        return list_stripped


# WRITE THE RESULTS TO A TEXT FILE THAT CAN BE COPY/PASTED INTO YOUR HTML DOC
def writer(converted_list):
    with open('converted.txt', 'w') as f:
        for item in converted_list:
            f.write(item + '\n')



# MAIN CODE 
print('CONVERT HTML TO PLAINTEXT')
print('*************************')
print('Type file path including file.')
print('Example:\n"Documents/html_files/index.html"')
html_file_path = input('\nEnter the path of the file to convert\n:')
ftype = html_file_path.split('.')[-1]

converter = Converter(html_file_path, ftype)

# Read the file and return a list
html = read(html_file_path)

# Convert the list and return the new list
# converted_list = convert(html)
if converter.file_type == 'py':
    converted_list = converter.py_to_text(html)
if converter.file_type == 'html':
    converted_list = converter.html_to_text(html)

# Print check
for item in converted_list:
    print(item)

# Write the converted list to a file
writer(converted_list)

print('***\nHTML converted to plaintext and written to file\n***')




