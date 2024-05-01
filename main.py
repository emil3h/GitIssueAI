from flask import Flask, render_template, request, jsonify
import os
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

app = Flask(__name__)

# Define a generic prompt for comparison
generic_prompt = '''
Analyze the contents of the two files and make note of the differences. 
Create a detailed list of the differences when comparing {content1} to {content2}. Display these changes in a numbered formatt with two newlines after each number. 
Using these differences, please generate a GitHub CLI command for creating an issue which lists all the changes. 
I am going to provide a template for your output. 
Use the following GitHub CLI command template to create the issue to track these changes, 
CAPITALIZED WORDS are my placeholders for content. 
This is the template: gh issue create --title "ISSUE TITLE" --body "DETAILED LIST OF DIFFERENCES." --label "documentation" 
Please separate each line in the detailed list of differences with <br><br> command for better readability.
\n\nFile 1 Content:\n{content1}\n\nFile 2 Content:\n{content2}
'''

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/compare', methods=['POST'])
def compare_files():
    if 'file1' not in request.files or 'file2' not in request.files:
        return jsonify({'error': 'Two files required.'}), 400
    
    file1 = request.files['file1']
    file2 = request.files['file2']

    content1 = file1.read().decode("utf-8")
    content2 = file2.read().decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": generic_prompt.format(content1=content1, content2=content2)}],
        temperature=0,
        max_tokens=1000
    )

    # Get the differences between the files
    differences = response.choices[0].message.content

    return jsonify({'differences': differences}), 200

if __name__ == '__main__':
    app.run(debug=True)

