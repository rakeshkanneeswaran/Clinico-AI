from core.document_generator.DAP_generator import generate_DAP
from core.document_generator.PIE_generatory import generate_PIE
from core.document_generator.SOAP_generator import generate_SOAP


def generate_document(transcript, document_type):
    document_type = document_type.lower()
    if document_type == "soap":
        document = generate_SOAP(transcript)
    elif document_type == "dap":
        document = generate_DAP(transcript)
    elif document_type == "pie":
        document = generate_PIE(transcript)
    else:
        raise ValueError(f"Unsupported document_type: {document_type}")

    return document
