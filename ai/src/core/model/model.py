# from langchain_community.llms import Groq

# llm = Ollama(model="mistral")


from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

if "GROQ_API_KEY" not in os.environ:
    os.environ["GROQ_API_KEY"] = groq_api_key

llm = ChatGroq(
    model="deepseek-r1-distill-llama-70b",
    temperature=0,
    max_tokens=None,
    reasoning_format="parsed",
    timeout=None,
    max_retries=2,
)


def generate_llm(document_type):
    return ChatGroq(
        model="deepseek-r1-distill-llama-70b",
        temperature=0,
        max_tokens=None,
        reasoning_format="parsed",
        timeout=None,
        max_retries=2,
    ).with_structured_output(document_type)
