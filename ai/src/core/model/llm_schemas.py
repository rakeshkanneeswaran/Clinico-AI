from pydantic import BaseModel, Field
from typing import List, Type


class DocumentField(BaseModel):
    label: str
    description: str


class DocumentData(BaseModel):
    transcript: str
    document_type: str  # e.g., "SOAP", "DAP", "PIE"
    fields: List[DocumentField]  # Add this line


def create_dynamic_model(
    fields: List[DocumentField], model_name: str = "DynamicModel"
) -> Type[BaseModel]:
    """
    Creates a dynamic Pydantic model class based on a list of field definitions.

    Args:
        fields: List of DocumentField instances defining the model fields
        model_name: Optional name for the generated model class

    Returns:
        A dynamically generated Pydantic model class
    """
    # Prepare the fields dictionary for the new model
    class_fields = {
        "__annotations__": {},
        "__doc__": f"Dynamic model with fields: {', '.join(f.label for f in fields)}",
    }

    # Add each field to the model
    for field in fields:
        class_fields["__annotations__"][field.label] = str
        class_fields[field.label] = Field(..., description=field.description)

    # Create the dynamic model class
    DynamicModel = type(model_name, (BaseModel,), class_fields)
    return DynamicModel
