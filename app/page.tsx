"use client";

import { useEffect, useRef, useState } from "react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Dark mode state
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    const sections = [
      heroRef.current,
      featuresRef.current,
      testimonialsRef.current,
      ctaRef.current,
    ];
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Mobile Sidebar (RIGHT SIDE) */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity ${
          sidebarOpen ? "block md:hidden" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[101] h-full w-64 bg-card dark:bg-zinc-900 shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6 gap-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-primary">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="text-2xl"
            >
              &times;
            </button>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-2 py-1 rounded border w-full flex items-center gap-2"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <LanguageToggle />
          <Link href="/chat" className="w-full">
            <Button size="lg" className="w-full mb-2">
              Try Chat
            </Button>
          </Link>
          <Link href="/auth/signin" className="w-full">
            <Button className=" text-center  dark:text-white mb-2">
              Sign In
            </Button>
          </Link>
        </div>
      </aside>

      {/* Sticky header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="w-full flex items-center px-2 gap-4">
          {/* Sidebar menu button for mobile (move to right) */}
          <div className="flex flex-1 items-center min-w-0">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img
                  src="/logo (1).svg"
                  alt="LawGen Logo"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover border border-muted shadow"
                />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <h1 className="text-lg font-semibold text-primary truncate">
                  LegalAid
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  Your trusted platform for legal clarity and justice
                </p>
              </div>
            </div>
          </div>
          {/* Hamburger icon only, no box */}
          <div className="md:hidden">
            <button
              className="p-0 bg-transparent border-none shadow-none outline-none focus:outline-none"
              style={{ lineHeight: 0 }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h12M4 10h12M4 14h12" />
              </svg>
            </button>
          </div>
          {/* Right: toggles and buttons (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-3 min-w-0 ml-auto">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 py-1 rounded border"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <LanguageToggle />
            <Link href="/auth/signin">
              <Button className="text-center  dark:text-white mb-2">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <MotionWrapper animation="fadeInUp" delay={200}>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-8 text-balance leading-tight">
              Legal Information &
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                Assistance
              </span>
            </h2>
          </MotionWrapper>

          <MotionWrapper animation="fadeInUp" delay={400}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto text-pretty leading-relaxed">
              Get instant legal guidance, connect with professionals, and access
              comprehensive legal resources in English and Amharic. Your trusted
              companion for legal clarity and justice.
            </p>
          </MotionWrapper>

          <MotionWrapper animation="fadeInUp" delay={600}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/chat">
                <Button
                  size="lg"
                  className="text-xl px-12 py-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Chat Now
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button
                  className="w-full bg-primary text-white hover:bg-primary/90 hover:!text-white transition-colors"
                  size="lg"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </MotionWrapper>

          <MotionWrapper animation="scaleIn" delay={800}>
            <div className="relative max-w-7xl mx-auto">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 backdrop-blur-sm border border-border/50 shadow-2xl flex justify-center w-[1200px] max-w-full mx-auto">
                <img
                  src="/University Of Law.jpg"
                  alt="University Of Law"
                  className="w-full h-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-700 mx-auto"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      <section ref={featuresRef} className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <MotionWrapper animation="fadeInUp">
            <div className="text-center mb-20">
              <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Comprehensive Legal Support
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                Everything you need to navigate legal challenges with
                confidence, clarity, and professional guidance
              </p>
            </div>
          </MotionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "AI Chat Assistant",
                description:
                  "Get instant answers to your legal questions with our intelligent chat system powered by advanced AI technology.",
                icon: "💬",
                href: "/chat",
                gradient: "from-blue-500/10 to-cyan-500/10",
              },
              {
                title: "Legal Aid Directory",
                description:
                  "Connect with verified legal professionals and organizations in your area with detailed profiles and reviews.",
                icon: "🏛️",
                href: "/legal-aid",
                gradient: "from-purple-500/10 to-pink-500/10",
              },
              {
                title: "Interactive Quizzes",
                description:
                  "Test your legal knowledge and learn about your rights through engaging, educational quizzes and assessments.",
                icon: "📝",
                href: "/quiz",
                gradient: "from-green-500/10 to-emerald-500/10",
              },
              {
                title: "Premium Access",
                description:
                  "Unlock advanced features, priority support, and exclusive legal resources for professionals and businesses.",
                icon: "⭐",
                href: "/profile",
                gradient: "from-orange-500/10 to-red-500/10",
              },
            ].map((feature, index) => (
              <MotionWrapper
                key={feature.title}
                animation="staggerIn"
                delay={index * 150}
              >
                <Link href={feature.href}>
                  <Card
                    className={`h-full hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group bg-gradient-to-br ${feature.gradient} border-border/50 backdrop-blur-sm`}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h4 className="text-2xl font-semibold text-primary mb-4">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground text-pretty leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={testimonialsRef}
        className="bg-gradient-to-r from-secondary/30 via-accent/10 to-secondary/30 py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <MotionWrapper animation="fadeInUp">
            <div className="text-center mb-20">
              <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Trusted by Legal Professionals
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                See what our users say about their experience with LegalAid and
                how it's transformed their legal practice
              </p>
            </div>
          </MotionWrapper>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Sarah Johnson",
                role: "Legal Consultant",
                content:
                  "LegalAid has transformed how I provide initial consultations to clients. The AI assistant helps me prepare better and faster, making my practice more efficient.",
                avatar: "/professional-woman-lawyer-headshot.png",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Small Business Owner",
                content:
                  "As a business owner, having quick access to legal guidance has been invaluable. The platform is intuitive, reliable, and saves me countless hours.",
                avatar: "/professional-man-business-owner-headshot.png",
                rating: 5,
              },
              {
                name: "Almaz Tadesse",
                role: "Law Student",
                content:
                  "The bilingual support and interactive quizzes have been perfect for my studies. It's like having a legal tutor available 24/7 with personalized guidance.",
                avatar: "/young-ethiopian-woman-law-student-headshot.png",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <MotionWrapper
                key={testimonial.name}
                animation="staggerIn"
                delay={index * 200}
              >
                <Card className="hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm border-border/50 group hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-accent text-xl">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic text-lg leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-border group-hover:scale-110 transition-transform"
                      />
                      <div>
                        <p className="font-semibold text-primary text-lg">
                          {testimonial.name}
                        </p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="py-32">
        <div className="container mx-auto px-4">
          <MotionWrapper animation="fadeInUp">
            <div className="relative bg-gradient-to-r from-primary via-accent to-primary rounded-3xl p-12 md:p-20 text-center text-primary-foreground overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
              <div className="relative z-10">
                <h3 className="text-4xl md:text-6xl font-bold mb-6">
                  Ready to Get Started?
                </h3>
                <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
                  Join thousands of users who trust LegalAid for their legal
                  information needs. Start your journey to legal clarity today.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/chat">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="text-xl px-12 py-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Try Chat Now
                    </Button>
                  </Link>
                  <Link href="/legal-aid">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-xl px-12 py-4 hover:scale-105 transition-all duration-300 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                    >
                      Browse Legal Aid
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 py-16 mt-16">
        <div className="container mx-auto px-4">
          <MotionWrapper animation="fadeInUp">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h5 className="font-semibold text-primary mb-4">About</h5>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-primary transition-colors"
                    >
                      Our Mission
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/team"
                      className="hover:text-primary transition-colors"
                    >
                      Team
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/careers"
                      className="hover:text-primary transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-primary mb-4">Contact</h5>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      href="/support"
                      className="hover:text-primary transition-colors"
                    >
                      Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/feedback"
                      className="hover:text-primary transition-colors"
                    >
                      Feedback
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/partners"
                      className="hover:text-primary transition-colors"
                    >
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-primary mb-4">Legal</h5>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/disclaimer"
                      className="hover:text-primary transition-colors"
                    >
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-primary mb-4">Resources</h5>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      href="/guides"
                      className="hover:text-primary transition-colors"
                    >
                      Legal Guides
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="hover:text-primary transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="hover:text-primary transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 LegalAid Platform. All rights reserved.</p>
            </div>
          </MotionWrapper>
        </div>
      </footer>
    </div>
  );
}
