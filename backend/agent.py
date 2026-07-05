"""AI Agent using LangGraph and Gemini"""

from typing import TypedDict, Annotated
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from prompts import (
    CHAT_SYSTEM_PROMPT,
    PATTERN_DETECTION_PROMPT,
    DOCTOR_REPORT_PROMPT,
    QUICK_INSIGHT_PROMPT
)


class HealthState(TypedDict):
    """State for health assistant agent"""
    messages: list
    health_data: str


def get_llm(api_key: str, temperature: float = 0.3) -> ChatGoogleGenerativeAI:
    """Initialize Gemini LLM"""
    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key,
            temperature=temperature
        )
        return llm
    except Exception as e:
        raise ValueError(f"Failed to initialize LLM: {e}")


def create_chat_agent(api_key: str):
    """Create a stateful chat agent with memory"""

    llm = get_llm(api_key, temperature=0.3)
    memory = MemorySaver()

    def health_assistant(state: HealthState):
        """Process messages with health context"""
        health_data = state.get("health_data", "Tidak ada data kesehatan tersedia.")
        messages = state.get("messages", [])

        # Inject system prompt with health data
        system_prompt = CHAT_SYSTEM_PROMPT.format(health_data=health_data)

        # Build message list
        full_messages = [SystemMessage(content=system_prompt)] + messages

        # Invoke LLM
        response = llm.invoke(full_messages)

        # Return updated state
        return {
            "messages": messages + [response],
            "health_data": health_data
        }

    # Build graph
    workflow = StateGraph(HealthState)
    workflow.add_node("health_assistant", health_assistant)
    workflow.set_entry_point("health_assistant")
    workflow.add_edge("health_assistant", END)

    # Compile with memory
    app = workflow.compile(checkpointer=memory)

    return app


def run_chat(agent, message: str, thread_id: str, health_data: str) -> str:
    """Run chat with memory and health context"""
    try:
        # Invoke agent with thread_id for persistence
        result = agent.invoke(
            {
                "messages": [HumanMessage(content=message)],
                "health_data": health_data
            },
            config={"configurable": {"thread_id": thread_id}}
        )

        # Extract last message content
        last_message = result["messages"][-1]

        if hasattr(last_message, 'content'):
            return last_message.content
        else:
            return str(last_message)

    except Exception as e:
        return f"Maaf, terjadi error: {str(e)}"


def run_analysis(api_key: str, health_data: str) -> str:
    """Run pattern detection analysis (one-shot)"""
    try:
        llm = get_llm(api_key, temperature=0.2)

        prompt = PATTERN_DETECTION_PROMPT.format(health_data=health_data)
        messages = [HumanMessage(content=prompt)]

        response = llm.invoke(messages)

        if hasattr(response, 'content'):
            return response.content
        else:
            return str(response)

    except Exception as e:
        return f"Error running analysis: {str(e)}"


def run_report(api_key: str, health_data: str, period_start: str, period_end: str) -> str:
    """Generate doctor report (one-shot)"""
    try:
        from datetime import datetime
        llm = get_llm(api_key, temperature=0.1)

        today = datetime.now().strftime("%Y-%m-%d")

        prompt = DOCTOR_REPORT_PROMPT.format(
            health_data=health_data,
            period_start=period_start,
            period_end=period_end,
            today=today
        )
        messages = [HumanMessage(content=prompt)]

        response = llm.invoke(messages)

        if hasattr(response, 'content'):
            return response.content
        else:
            return str(response)

    except Exception as e:
        return f"Error generating report: {str(e)}"


def run_quick_insight(api_key: str, health_data: str) -> str:
    """Generate quick insight for dashboard (one-shot)"""
    try:
        llm = get_llm(api_key, temperature=0.3)

        prompt = QUICK_INSIGHT_PROMPT.format(health_data=health_data)
        messages = [HumanMessage(content=prompt)]

        response = llm.invoke(messages)

        if hasattr(response, 'content'):
            return response.content
        else:
            return str(response)

    except Exception as e:
        return "📝 Catat kesehatanmu setiap hari untuk insight yang lebih personal!"
