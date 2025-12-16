from pydantic import BaseModel, Field
from typing import Dict

class UserPreferences(BaseModel):
    types: Dict[str, int] = Field(default_factory=dict)
    price_levels: Dict[str, int] = Field(default_factory=dict)