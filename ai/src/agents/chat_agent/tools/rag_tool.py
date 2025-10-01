from langchain_core.tools import tool
import requests
import os
import json


@tool
def get_relevant_contexts(query: str, session_id: str = None) -> list[str]:
    """Fetch relevant contexts against a query."""
    url = f"{os.environ['RAG_API_URL']}/api/similarity-search/"
    headers = {"Content-Type": "application/json"}
    payload = {"query": query, "sessionId": session_id}
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    response.raise_for_status()
    data = response.json()
    # print("Tool Response Data:", data)  # Debugging line
    contexts = data.get("data", [])
    return contexts
