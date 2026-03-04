from pydantic import BaseModel
from typing import List, Optional, Literal
from enum import Enum

class IntentType(str, Enum):
    REPORT_LOST = "report_lost"
    SEARCH_LOST = "search_lost"
    REGISTER_COMMUNITY = "register_community"
    MARK_FOUND = "mark_found"
    EMERGENCY = "emergency"
    GENERAL_QUESTION = "general_question"
    ASK_TYPE = "ask_type"

class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    history: Optional[List[Message]] = []

class ChatResponse(BaseModel):
    message: str
    intent: Optional[IntentType] = None
    action_performed: Optional[bool] = False
    session_id: Optional[str] = None
    navigate_to: Optional[str] = None