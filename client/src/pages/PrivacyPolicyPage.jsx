import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Mail, MapPin } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-accent/15 p-5 sm:p-8 md:p-12 shadow-card space-y-8">
          <div className="space-y-3 pb-6 border-b border-accent/15">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-secondary/60 text-accent text-xs font-bold uppercase tracking-wider">
              Legal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-dark-muted">
              Last updated: October 2026 • Hackways (MSME Certified) & Chartered Institute of Technology (CIT)
            </p>
          </div>

          <div className="space-y-6 text-sm text-dark leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">1. Overview</h2>
              <p className="text-dark-muted">
                Welcome to <strong>Hackways</strong> (accessible via <strong>hackways.com</strong>). This Privacy Policy explains how Hackways, an MSME Certified Organization, in association with Chartered Institute of Technology (CIT), Abu Road, collects, uses, and protects participant information for the CIT Coding Carnival hackathon.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">2. Information We Collect</h2>
              <p className="text-dark-muted">
                When you sign in with Google or register a team, we collect the following basic information:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-dark-muted">
                <li>Full Name and Email Address (via Google Authentication)</li>
                <li>Contact Phone Number and WhatsApp Contact (for event day coordination)</li>
                <li>College / Educational Institution Name</li>
                <li>Team Member Names and Project Details for participation</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">3. How We Use Your Information</h2>
              <p className="text-dark-muted">Your data is strictly used for:</p>
              <ul className="list-disc pl-5 space-y-1 text-dark-muted">
                <li>Allocating your team's hackathon table and access pass</li>
                <li>Processing your ₹99 commitment deposit and in-person refund at CIT Campus</li>
                <li>Issuing verified digital Certificates of Participation and Merit co-signed with CIT</li>
                <li>Sharing event updates, reporting times, and problem track announcements</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">4. Data Protection & Security</h2>
              <p className="text-dark-muted">
                Participant data is encrypted in transit and at rest using enterprise Google Firebase infrastructure. We do not sell, rent, or trade your personal information to third-party marketing companies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">5. ₹99 Refund Guarantee</h2>
              <p className="text-dark-muted">
                The ₹99 registration fee collected is a commitment deposit to reserve one of the 70 team slots. It is 100% refunded in cash or instant UPI to your team upon physical arrival and check-in at the CIT Campus.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">6. Contact & Questions</h2>
              <p className="text-dark-muted">
                For questions regarding your data or this policy, please reach out to:
              </p>
              <div className="p-4 bg-background-cream rounded-xl border border-accent/15 space-y-1.5 text-xs text-dark">
                <div className="flex items-center gap-2 font-semibold">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>support@hackways.com</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>Chartered Institute of Technology, Abu Road, Rajasthan</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
