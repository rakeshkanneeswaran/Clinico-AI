from core.document_generator.DeepAnalysis_generator import generate_deep_analysis
from core.document_generator.DAP_generator import generate_DAP
from core.document_generator.PIE_generatory import generate_PIE
from core.document_generator.SOAP_generator import generate_SOAP
from core.document_generator.summary_generator import generate_summary
from core.document_generator.referral_generator import generate_referral


def generate_document(transcript, document_type):
    document_type = document_type.lower()
    if document_type == "soap":
        document = generate_SOAP(transcript)
    elif document_type == "dap":
        document = generate_DAP(transcript)
    elif document_type == "pie":
        document = generate_PIE(transcript)
    elif document_type == "summary":
        document = generate_summary(transcript)
    elif document_type == "referral":
        document = generate_referral(transcript)
    elif document_type == "deep_analysis":
        document = generate_deep_analysis(transcript)
    else:
        raise ValueError(f"Unsupported document_type: {document_type}")

    return document
