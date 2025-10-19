"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Privacy Policy & Terms of Service
          </CardTitle>
          <CardDescription>
            Last updated: October 19, 2025 | Version 1.0
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to SafeHome. We are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains how we collect, use, store, and 
              protect your data when you use our home services platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Name, email address, and username</li>
                  <li>Phone number (encrypted)</li>
                  <li>Service address (encrypted)</li>
                  <li>City, state, and country (for service matching)</li>
                  <li>Vaccination status (optional, for COVID-19 safety)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">2. Booking Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Service type and booking details</li>
                  <li>Preferred date and time</li>
                  <li>Budget and payment information</li>
                  <li>Special instructions and notes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">3. Technical Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>IP address and browser information</li>
                  <li>Device type and operating system</li>
                  <li>Cookies and session data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-primary" />
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>To create and manage your account</li>
              <li>To process and fulfill your service bookings</li>
              <li>To match you with appropriate service providers</li>
              <li>To process payments securely</li>
              <li>To communicate about your bookings and services</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              Data Security & Encryption
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We take data security seriously and implement industry-standard measures to protect 
                your information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Encryption:</strong> Sensitive data (addresses, phone numbers) is encrypted using Fernet symmetric encryption</li>
                <li><strong>Secure Authentication:</strong> JWT tokens stored in HttpOnly cookies to prevent XSS attacks</li>
                <li><strong>Password Security:</strong> Passwords are hashed using PBKDF2 algorithm</li>
                <li><strong>Access Control:</strong> You can only access your own booking and personal data</li>
                <li><strong>HTTPS:</strong> All data transmission is encrypted using SSL/TLS</li>
                <li><strong>Payment Security:</strong> Payment processing handled by Stripe (PCI DSS compliant)</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              Data Sharing & Privacy
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We respect your privacy and follow the principle of data minimization:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Service Providers:</strong> Your encrypted contact details are only shared with matched service providers</li>
                <li><strong>No Location Tracking:</strong> We do NOT store precise GPS coordinates or track your location</li>
                <li><strong>Geographic Data:</strong> Only city/state/country are stored in plain text for service matching</li>
                <li><strong>Third Parties:</strong> We do not sell your personal data to third parties</li>
                <li><strong>Payment Processing:</strong> Payment details are handled securely by Stripe</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct your information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
              <li><strong>Complaint:</strong> Lodge a complaint with data protection authorities</li>
            </ul>
          </section>

          {/* COVID-19 Safety */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">COVID-19 Safety Measures</h2>
            <p className="text-muted-foreground leading-relaxed">
              We display COVID-19 restriction levels for your area to help you make informed decisions. 
              Vaccination status is optional and only used to match you with providers who meet your 
              safety preferences.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies & Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies for authentication (JWT tokens) and session management. 
              These cookies are HttpOnly and Secure to protect against common web vulnerabilities.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal data only as long as necessary to provide our services and 
              comply with legal obligations. Booking history is kept for 7 years for accounting purposes. 
              You can request deletion of your account at any time.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by email or through our platform. Continued use of our services after changes 
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or how we handle your data, 
              please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">SafeHome Privacy Team</p>
              <p className="text-muted-foreground">Email: privacy@safehome.com</p>
              <p className="text-muted-foreground">Address: 123 Privacy Street, Secure City, SC 12345</p>
            </div>
          </section>

          {/* Consent */}
          <section className="border-t pt-6">
            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Your Consent</h3>
              <p className="text-muted-foreground">
                By using SafeHome and creating an account, you acknowledge that you have read, 
                understood, and agree to this Privacy Policy and our Terms of Service. You consent 
                to the collection, use, and processing of your personal data as described above.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

