

const faqs = [
  {
    question: "What is EOCO?",
    answer: "The Economic and Organised Crime Office (EOCO) is a specialised agency in Ghana established by the EOCO Act, 2010 (Act 804) to monitor, investigate, and on the authority of the Attorney-General, prosecute economic and organised crime."
  },
  {
    question: "How do I report a crime?",
    answer: "You can report a crime by registering for an account and submitting an official report, or by using our completely anonymous reporting feature. Both options are accessible from our home page."
  },
  {
    question: "Is my anonymous report truly anonymous?",
    answer: "Yes. When you use the 'Anonymous Report' feature, we do not log your IP address, browser details, or any identifying information. You will receive a unique tracking token which is the only way to check the status of your report."
  },
  {
    question: "What happens after I submit a report?",
    answer: "Your report is reviewed by our intake team and, if actionable, assigned to an investigative officer. If you have an account, you can track the status and communicate with the officer securely through the portal."
  },
  {
    question: "Can I provide additional evidence later?",
    answer: "Yes. If you submitted the report via your account, you can upload additional files to the case. If you submitted anonymously, you must use your tracking token to access the report and add further information."
  },
  {
    question: "What types of crimes should I report to EOCO?",
    answer: "EOCO investigates financial crimes, money laundering, human trafficking, prohibited cyber activity, tax fraud, and other serious organised crimes."
  }
]

export default function FaqPage() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about reporting crimes and how EOCO handles investigations.
        </p>
      </div>

      <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border">
        
        <div className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group border-b border-border pb-4">
              <summary className="text-lg font-medium cursor-pointer list-none hover:text-primary focus:outline-none">
                {faq.question}
              </summary>
              <div className="text-muted-foreground leading-relaxed text-base mt-2 pl-4 border-l-2 border-primary/20">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

      </div>
    </div>
  )
}
