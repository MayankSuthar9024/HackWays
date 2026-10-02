import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin } from 'lucide-react';

export default function TermsPage() {
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
              Guidelines
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-dark-muted">
              Terms of Participation • CIT Coding Carnival 2026 • Hackways & CIT
            </p>
          </div>

          <div className="space-y-6 text-sm text-dark leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">1. Eligibility</h2>
              <p className="text-dark-muted">
                CIT Coding Carnival is open to all students currently enrolled in undergraduate, postgraduate, or diploma programs across engineering, computer applications, and polytechnic colleges.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">2. Team Rules</h2>
              <ul className="list-disc pl-5 space-y-1 text-dark-muted">
                <li>Each team must consist of exactly <strong>4 members</strong>.</li>
                <li>Cross-college and inter-branch teams are completely allowed.</li>
                <li>All team members must carry valid College ID cards on the event day.</li>
                <li>Total capacity is strictly capped at <strong>70 teams</strong> on a first-come, first-served basis.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">3. ₹99 Refund Policy</h2>
              <p className="text-dark-muted">
                The ₹99 registration fee guarantees your team's table reservation and food catering. This amount is <strong>100% refunded in full</strong> upon physical arrival and check-in at the CIT Campus at 9:00 AM on the event day. Teams that fail to appear without 48-hour prior notice forfeit their seat deposit.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">4. Intellectual Property</h2>
              <p className="text-dark-muted">
                <strong>You own 100% of what you build.</strong> Neither Hackways nor Chartered Institute of Technology claims any intellectual property rights over source code, designs, or prototypes developed during the hackathon.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">5. Code of Conduct</h2>
              <p className="text-dark-muted">
                All participants are expected to maintain professionalism, respect campus property, adhere to safety guidelines, and treat fellow participants, mentors, and staff with courtesy. Plagiarism or submitting pre-built full applications is strictly prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">6. Judging & Awards</h2>
              <p className="text-dark-muted">
                Projects will be evaluated based on innovation, real-world feasibility, UI/UX, and technical execution. The jury's evaluation decisions are final and binding. Cash prizes will be awarded at the closing ceremony on the event day.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-primary">7. Contact</h2>
              <p className="text-dark-muted">
                Questions or support: <a href="mailto:support@hackways.com" className="text-primary font-bold hover:underline">support@hackways.com</a>. Venue: Chartered Institute of Technology, Abu Road.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
