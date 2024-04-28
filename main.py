import os
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv

# load the .env file
_ = load_dotenv(find_dotenv())
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "who is the best nba team?",
        }
    ],
    model="gpt-3.5-turbo",
)

print(chat_completion.choices[0].message.content)