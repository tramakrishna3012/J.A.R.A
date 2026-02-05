import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>
                <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">1. Introduction</h2>
                        <p>Welcome to J.A.R.A ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">2. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Information:</strong> We collect personal information that you voluntarily provide to us when you register on the application, such as your email address and name.</li>
                            <li><strong>Resume Data:</strong> When you upload a resume, we process the text content to extract skills, experience, and education for the purpose of job matching.</li>
                            <li><strong>Google User Data:</strong> If you choose to connect your Gmail account, we access your emails to identify job application updates (e.g., interview invites, rejections). We strictly use the <code>gmail.readonly</code> scope.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">3. How We Use Google Data</h2>
                        <p>J.A.R.A's use and transfer to any other app of information received from Google APIs will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-400 hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
                        <p className="mt-2">Specifically, we use your Gmail data only to:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>Scan for job-related keywords (e.g., "Application Received", "Interview").</li>
                            <li> categorize your job applications automatically on your dashboard.</li>
                        </ul>
                        <p className="mt-2">We <strong>do not</strong> sell, share, or use your Google data for advertising purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">4. Data Storage and Security</h2>
                        <p>We use industry-standard security measures to protect your data. Your data is stored securely using Supabase (PostgreSQL). We do not store your raw Gmail passwords; we use secure OAuth tokens which are encrypted.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">5. Contact Us</h2>
                        <p>If you have questions or comments about this policy, you may email us at support@jara.ai.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
