from typing import Dict, Any, Optional
from enum import Enum

class ConversationState(Enum):
    IDLE = "idle"
    AWAITING_LOST_INFO = "awaiting_lost_info"
    AWAITING_COMMUNITY_INFO = "awaiting_community_info"
    AWAITING_FOUND_INFO = "awaiting_found_info"
    AWAITING_SEARCH_INFO = "awaiting_search_info"
    AWAITING_REGISTRATION_TYPE = "awaiting_registration_type"

class ConversationManager:
    def __init__(self):
        self.user_states: Dict[str, Dict[str, Any]] = {}
    
    def get_state(self, user_id: str) -> ConversationState:
        if user_id not in self.user_states:
            self.user_states[user_id] = {
                "state": ConversationState.IDLE,
                "data": {}
            }
        return self.user_states[user_id]["state"]
    
    def set_state(self, user_id: str, state: ConversationState, data: Dict = None):
        if user_id not in self.user_states:
            self.user_states[user_id] = {"state": state, "data": data or {}}
        else:
            self.user_states[user_id]["state"] = state
            if data:
                self.user_states[user_id]["data"].update(data)
    
    def get_data(self, user_id: str) -> Dict:
        return self.user_states.get(user_id, {}).get("data", {})
    
    def clear_state(self, user_id: str):
        if user_id in self.user_states:
            self.user_states[user_id]["state"] = ConversationState.IDLE
            self.user_states[user_id]["data"] = {}
    
    def update_data(self, user_id: str, data: Dict):
        if user_id not in self.user_states:
            self.user_states[user_id] = {"state": ConversationState.IDLE, "data": data}
        else:
            self.user_states[user_id]["data"].update(data)

conversation_manager = ConversationManager()