from pydantic import BaseModel, Field
from typing import Dict
from enum import Enum

class UserPreferences(BaseModel):
    types: Dict[str, int] = Field(default_factory=dict)
    price_levels: Dict[str, int] = Field(default_factory=dict)

class PreferenceAction(str, Enum):
    like = "like"
    dislike = "dislike"