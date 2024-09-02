#!/bin/bash

# Check if a filename was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

input_file="$1"

# Check if the file exists
if [ ! -f "$input_file" ]; then
    echo "Error: File '$input_file' not found."
    exit 1
fi

# Function to create a file with content
create_file() {
    local filepath="$1"
    local content="$2"
    mkdir -p "$(dirname "$filepath")"
    echo "$content" > "$filepath"
    echo "Created file: $filepath"
}

# Process the input file
current_file=""
content=""

while IFS= read -r line || [ -n "$line" ]; do
    if [[ $line == "//"* ]]; then
        # New file starts
        if [ -n "$current_file" ]; then
            create_file "$current_file" "$content"
            content=""
        fi
        current_file=$(echo "$line" | sed 's/\/\/ *//')
    else
        # Append to content
        content+="$line"$'\n'
    fi
done < "$input_file"

# Create the last file
if [ -n "$current_file" ]; then
    create_file "$current_file" "$content"
fi

echo "File organization complete!"