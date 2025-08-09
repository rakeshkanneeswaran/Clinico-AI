from core.model.model import llm  # your ChatGroq instance


def answer_query(query: str, contexts: list[str]):
    combined_context = "\n\n".join(
        f"- {c.strip()}" for c in contexts if c and c.strip()
    )
    query = query.strip()

    prompt = f"""
You are an assistant. Use the following information snippets and the question below to generate a helpful answer.

Information:
{combined_context}

Question:
{query}

Provide a clear and concise answer based on the information above.
"""

    try:
        response = llm.invoke(prompt)
        print(f"[INFO] Generated answer: {response}")
        return response.content
    except Exception as e:
        print(f"[ERROR] Failed to generate answer: {e}")
        return "Failed to generate answer."
