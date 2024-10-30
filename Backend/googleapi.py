import google.generativeai as genai
import typing_extensions as typing

class Recipe(typing.TypedDict):
    recipe_name: str
    # ingredients: list[str]

genai.configure(api_key="AIzaSyBz3Gn7-4bJQcystxOHsxtubbX6A0YEMs8")
model = genai.GenerativeModel("gemini-1.5-pro-latest")
result = model.generate_content(
    "List a few popular cookie recipes.",
    generation_config=genai.GenerationConfig(
        response_mime_type="application/json", response_schema=list[Recipe]
    ),
)
print(result)