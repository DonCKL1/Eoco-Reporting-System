export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          The Economic and Organised Crime Office (EOCO) is committed to protecting your privacy and ensuring the security of your personal and sensitive information. This Privacy Policy outlines how we collect, use, and safeguard data submitted through the EOCO Reporting Portal.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information Collection</h2>
        <p>
          <strong>Registered Users:</strong> We collect personal information such as your name, email address, and optional phone number when you create an account.
        </p>
        <p>
          <strong>Anonymous Reports:</strong> We do NOT collect personally identifiable information (PII), IP addresses, or browser footprints when you use the anonymous reporting feature.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of Information</h2>
        <p>
          Information submitted is used exclusively for the purpose of investigating and preventing economic and organised crime. EOCO may share information with other law enforcement agencies when legally mandated or necessary for an investigation.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
        <p>
          We employ industry-standard security measures including data encryption (in transit and at rest), secure access controls, and regular audits to protect your information from unauthorized access or disclosure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights</h2>
        <p>
          Registered users have the right to request access to or correction of their personal data. Please note that data pertaining to active ongoing investigations may be restricted from access or deletion under Ghanaian law.
        </p>
      </div>
    </div>
  )
}
