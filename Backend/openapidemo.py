import openai

# Initialize API key (if not set in environment)
openai.api_key = "your-api-key"

def generate_response(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=150  # Set token limit for the response
    )
    return response.choices[0].message["content"]

# Test the function
prompt = "Can you explain how GPT-4 works?"
response = generate_response(prompt)
print(response)